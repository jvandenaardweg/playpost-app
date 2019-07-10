import React from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import TrackPlayer from 'react-native-track-player';

import { LOCAL_CACHE_VOICE_PREVIEWS_PATH } from '../constants/files';

import * as cache from '../cache';

import { NetworkContext } from '../contexts/NetworkProvider';

import { RootState } from '../reducers';
import { setTrack } from '../reducers/player';
import { setDownloadedVoice } from '../reducers/voices';
import { saveSelectedVoice, getUser, resetSaveSelectedVoiceError } from '../reducers/user';

import { selectPlayerPlaybackState, selectPlayerTrack } from '../selectors/player';
import { selectDownloadedVoicePreviews, selectAvailableVoicesByLanguageName, selectDefaultVoiceByLanguageName } from '../selectors/voices';
import { selectUserSelectedVoiceByLanguageName, selectUserErrorSaveSelectedVoice } from '../selectors/user';
import { selectIsSubscribed } from '../selectors/subscriptions';

import { ALERT_SETTINGS_VOICE_CHANGE, ALERT_GENERIC_INTERNET_REQUIRED, ALERT_SETTINGS_VOICE_PREVIEW_UNAVAILABLE } from '../constants/messages';

import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import { CustomSectionList } from '../components/CustomSectionList';
import { ButtonVoicePreview } from '../components/ButtonVoicePreview';

type IProps = {
  languageName: string;
};

type Props = IProps & NavigationInjectedProps & StateProps & DispatchProps;

interface State {
  isLoadingPreviewVoiceId: string;
  isLoadingSaveSelectedVoiceId: string;
}

export class VoiceSelectContainerComponent extends React.PureComponent<Props, State> {
  state = {
    isLoadingPreviewVoiceId: '',
    isLoadingSaveSelectedVoiceId: ''
  };

  static contextType = NetworkContext;

  // componentDidUpdate(prevProps: Props) {
  //   const { errorSaveSelectedVoice } = this.props;
  //   const { isLoadingSaveSelectedVoiceId } = this.state;

  //   // If we have an while saving the selected voice
  //   if (isLoadingSaveSelectedVoiceId && errorSaveSelectedVoice && prevProps.errorSaveSelectedVoice !== errorSaveSelectedVoice) {
  //     return Alert.alert(
  //       'Oops!',
  //       errorSaveSelectedVoice,
  //       [
  //         {
  //           text: 'OK',
  //           onPress: () => this.props.resetSaveSelectedVoiceError()
  //         }
  //       ]
  //     );
  //   }
  // }

  keyExtractor = (item: Api.Voice, index: number) => index.toString();

  handleOnListItemPress = (voice: Api.Voice) => {
    const { isConnected } = this.context;
    const { isSubscribed } = this.props;
    const isSelected = this.isSelected(voice);

    // If it's already selected, do nothing
    if (isSelected) return;

    if (!isConnected) {
      return Alert.alert('Not connected', ALERT_GENERIC_INTERNET_REQUIRED);
    }

    // If it's a premium voice and the user is not subscribed
    // Show a warning
    if (voice.isPremium && !isSubscribed) {
      return Alert.alert(
        'Upgrade to Premium or Plus',
        'This higher quality voice is only available for Premium and Plus users.\n\nYou can preview this voice by using the play button on the left.',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Upgrade',
            onPress: () => this.props.navigation.navigate('Upgrade')
          }
        ]
      );
    }

    // Warn the user, it only applies to new articles
    Alert.alert('Only applies to new articles', ALERT_SETTINGS_VOICE_CHANGE, [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'OK',
        onPress: () => this.handleOnSaveSelectedVoice(voice)
      }
    ]);
  }

  /**
   * Handles the saving of the selected voice to the database
   * Will also properly handle errors by showing an Alert to the user
   */
  handleOnSaveSelectedVoice = async (item: Api.Voice) => {
    return this.setState({ isLoadingSaveSelectedVoiceId: item.id }, async () => {
      try {
        // Save the selected voice for the user
        await this.props.saveSelectedVoice(item.id);

        // Get the updated settings
        await this.props.getUser();
      } finally {
        return this.setState({ isLoadingSaveSelectedVoiceId: '' });
      }
    });
  }

  handleOnPreviewPress = async (title: string, label: string, voice: Api.Voice) => {
    const { downloadedVoices } = this.props;
    const isPlaying = this.isVoicePlayingInPlayer(voice.id);

    // If the preview of this voice is playing, pause it
    if (isPlaying) return TrackPlayer.pause();

    // Check if the voice is already downloaded
    // If so, we can just play that locally downloaded voice preview
    const downloadedVoice = downloadedVoices.find(downloadedVoice => downloadedVoice.id === voice.id);

    // If we have a downloaded voice preview, just play it
    if (downloadedVoice && downloadedVoice.exampleAudioUrl) {
      const localFilePath = await cache.getLocalFilePath(downloadedVoice.exampleAudioUrl, LOCAL_CACHE_VOICE_PREVIEWS_PATH);
      return this.playVoicePreview(title, localFilePath, label, voice);
    }

    // If we have no voice preview downloaded yet, download it
    if (!downloadedVoice) return this.fetchVoicePreview(title, label, voice);
  }

  playVoicePreview = (title: string, localFilePath: string, label: string, voice: Api.Voice) => {
    // Only add the track to the player when it's not in there yet
    if (!this.isVoiceActiveInPlayer(voice.id)) {
      this.props.setTrack(
        {
          title,
          id: voice.id,
          url: localFilePath,
          artist: label,
          album: 'Voice previews'
        },
        ''
      );
    }

    return TrackPlayer.play();
  }

  fetchVoicePreview = (title: string, label: string, voice: Api.Voice) => {
    const { isConnected } = this.context;
    const exampleAudioUrl = voice && voice.exampleAudioUrl;

    if (!isConnected) {
      return Alert.alert('Not connected', ALERT_GENERIC_INTERNET_REQUIRED);
    }

    if (!exampleAudioUrl) {
      return Alert.alert('Oops!', ALERT_SETTINGS_VOICE_PREVIEW_UNAVAILABLE);
    }

    return this.setState({ isLoadingPreviewVoiceId: voice.id }, async () => {
      try {
        // Download the file and put it in a local cache directory
        const localFilePath = await cache.downloadVoicePreview(exampleAudioUrl);

        // Set it as downloaded in the Redux store
        this.props.setDownloadedVoice(voice);

        // Set the track, resulting in automatic playback
        return this.playVoicePreview(title, localFilePath, label, voice);
      } catch (err) {
        const message = err.message ? err.message : null;
        const alertMessage = message
          ? `An error happened while downloading the voice preview: "${message}".`
          : 'An error happened while downloading the voice preview.';

        Alert.alert('Oops!', alertMessage, [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Try again',
            onPress: () => this.fetchVoicePreview(title, label, voice)
          }
        ]);
      } finally {
        return this.setState({ isLoadingPreviewVoiceId: '' });
      }
    });
  }

  isVoicePlayingInPlayer = (voiceId: string) => {
    const { playbackState } = this.props;
    return playbackState === 'playing' && this.isVoiceActiveInPlayer(voiceId);
  }

  isVoiceActiveInPlayer = (voiceId: string) => {
    const { playerTrack } = this.props;
    return playerTrack && playerTrack.id === voiceId;
  }

  isSelected = (item: Api.Voice) => {
    // const { isLoadingSaveSelectedVoiceId } = this.state;
    const { defaultVoiceByLanguageName, userSelectedVoiceByLanguageName } = this.props;
    const isDefaultSelected = defaultVoiceByLanguageName ? defaultVoiceByLanguageName.id === item.id : false;
    const isUserSelected = userSelectedVoiceByLanguageName && userSelectedVoiceByLanguageName.id === item.id;

    let isSelected = false;

    if (isUserSelected) {
      isSelected = isUserSelected;
    }

    if (!userSelectedVoiceByLanguageName) {
      isSelected = isDefaultSelected;
    }

    // When we are saving a selected voice, just show it as selected already
    // So we give the user the impression the app is fast.
    // if (isLoadingSaveSelectedVoiceId === item.id) {
    //   return true;
    // }

    // // If there's a saving of the selected voice in progress, remove the selected status from the other items
    // if (isLoadingSaveSelectedVoiceId && isLoadingSaveSelectedVoiceId !== item.id) {
    //   return false;
    // }

    return isSelected;
  }

  getBadgeValue(isPremium: boolean, isHighestQuality: boolean) {
    if (isPremium && isHighestQuality) {
      return 'premium (hq)';
    }

    if (isPremium) {
      return 'premium';
    }

    return 'free';
  }

  render() {
    const { availableVoicesByLanguageName } = this.props;
    const { isLoadingSaveSelectedVoiceId, isLoadingPreviewVoiceId } = this.state;

    const sectionListData = [
      {
        title: 'Lanuage',
        data: availableVoicesByLanguageName.map((voice, index) => {
          const isSelected = this.isSelected(voice);
          const isPlaying = this.isVoicePlayingInPlayer(voice.id);
          const isActive = this.isVoiceActiveInPlayer(voice.id);
          const isAvailable = !!voice.exampleAudioUrl;
          const isLoadingSaveSelected = isLoadingSaveSelectedVoiceId === voice.id;
          const isLoadingVoicePreview = isLoadingPreviewVoiceId === voice.id;

          const title = `${voice.label || voice.name}`;
          const badgeValue = this.getBadgeValue(voice.isPremium, voice.isHighestQuality);
          const defaultLabel = voice.isLanguageDefault ? '(Default) ' : '';
          const gender = voice.gender === 'MALE' ? 'Male' : 'Female';
          const subtitle = `${defaultLabel}${gender}, ${voice.language.name} (${voice.countryCode})`;

          const label = voice.label ? voice.label : 'Unknown';
          // const badgeStatus = (voice.isPremium) ? 'warning' : 'primary';

          return {
            title,
            subtitle,
            isSelected,
            icon: 'play',
            leftIcon: (
              <ButtonVoicePreview
                isPlaying={isPlaying}
                isLoading={isLoadingVoicePreview}
                isActive={isActive}
                isAvailable={isAvailable}
                onPress={() => this.handleOnPreviewPress(title, label, voice)}
              />
            ),
            onPress: () => this.handleOnListItemPress(voice),
            value: badgeValue,
            chevron: false,
            isLoading: isLoadingSaveSelected,
            checkmark: true
          };
        })
      }
    ];

    return <CustomSectionList sectionListData={sectionListData} />;
  }
}

interface DispatchProps {
  saveSelectedVoice: typeof saveSelectedVoice;
  setDownloadedVoice: typeof setDownloadedVoice;
  setTrack: typeof setTrack;
  getUser: typeof getUser;
  resetSaveSelectedVoiceError: typeof resetSaveSelectedVoiceError;
}

interface StateProps {
  readonly playbackState: ReturnType<typeof selectPlayerPlaybackState>;
  readonly playerTrack: ReturnType<typeof selectPlayerTrack>;
  readonly downloadedVoices: ReturnType<typeof selectDownloadedVoicePreviews>;
  readonly availableVoicesByLanguageName: ReturnType<typeof selectAvailableVoicesByLanguageName>;
  readonly defaultVoiceByLanguageName: ReturnType<typeof selectDefaultVoiceByLanguageName>;
  readonly userSelectedVoiceByLanguageName: ReturnType<typeof selectUserSelectedVoiceByLanguageName>;
  readonly isSubscribed: ReturnType<typeof selectIsSubscribed>;
  readonly errorSaveSelectedVoice: ReturnType<typeof selectUserErrorSaveSelectedVoice>;
}

const mapStateToProps = (state: RootState, props: Props) => ({
  playbackState: selectPlayerPlaybackState(state),
  playerTrack: selectPlayerTrack(state),
  downloadedVoices: selectDownloadedVoicePreviews(state),
  availableVoicesByLanguageName: selectAvailableVoicesByLanguageName(state, props.navigation.getParam('languageName', '')), // does not memoize correctly? // https://github.com/reduxjs/reselect#containersvisibletodolistjs-2
  defaultVoiceByLanguageName: selectDefaultVoiceByLanguageName(state, props.navigation.getParam('languageName', '')),
  userSelectedVoiceByLanguageName: selectUserSelectedVoiceByLanguageName(state, props.navigation.getParam('languageName', '')),
  isSubscribed: selectIsSubscribed(state),
  errorSaveSelectedVoice: selectUserErrorSaveSelectedVoice(state)
});

const mapDispatchToProps = {
  saveSelectedVoice,
  setTrack,
  setDownloadedVoice,
  getUser,
  resetSaveSelectedVoiceError
};

export const VoiceSelectContainer = withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(VoiceSelectContainerComponent)
);
