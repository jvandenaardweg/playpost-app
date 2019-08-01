import React from 'react';
import isEqual from 'react-fast-compare';
import { Alert } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { connect } from 'react-redux';

import { LOCAL_CACHE_VOICE_PREVIEWS_PATH } from '../constants/files';

import * as cache from '../cache';

import { NetworkContext } from '../contexts/NetworkProvider';

import { RootState } from '../reducers';
import { setTrack } from '../reducers/player';
import { getUser, resetSaveSelectedVoiceError, saveSelectedVoice } from '../reducers/user';
import { setDownloadedVoice } from '../reducers/voices';

import { selectPlayerPlaybackState, selectPlayerTrack } from '../selectors/player';
import { selectIsSubscribed } from '../selectors/subscriptions';
import { selectUserErrorSaveSelectedVoice, selectUserSelectedVoiceByLanguageName } from '../selectors/user';
import { selectDownloadedVoicePreviews, selectLanguagesWithActiveVoicesByLanguageName } from '../selectors/voices';

import { ALERT_GENERIC_INTERNET_REQUIRED, ALERT_SETTINGS_VOICE_CHANGE, ALERT_SETTINGS_VOICE_PREVIEW_UNAVAILABLE } from '../constants/messages';

import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { ButtonVoicePreview } from '../components/ButtonVoicePreview';
import { CustomSectionList } from '../components/CustomSectionList';
import colors from '../constants/colors';

interface IProps {
  languageName: string;
}

type Props = IProps & NavigationInjectedProps & StateProps & DispatchProps;

interface State {
  isLoadingPreviewVoiceId: string;
  isLoadingSaveSelectedVoiceId: string;
}

export class VoiceSelectContainerComponent extends React.Component<Props, State> {
  static contextType = NetworkContext;

  state = {
    isLoadingPreviewVoiceId: '',
    isLoadingSaveSelectedVoiceId: ''
  };

  shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
    // Only re-render if props change
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }

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
    if (isSelected) { return; }

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
            text: 'Start free trial',
            style: 'cancel',
            onPress: () => this.props.navigation.navigate('Upgrade')
          },
          {
            text: 'Cancel'
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
        this.setState({ isLoadingSaveSelectedVoiceId: '' });
      }
    });
  }

  handleOnPreviewPress = async (title: string, label: string, voice: Api.Voice) => {
    const { downloadedVoices } = this.props;
    const isPlaying = this.isVoicePlayingInPlayer(voice.id);

    // If the preview of this voice is playing, pause it
    if (isPlaying) { return TrackPlayer.pause(); }

    // Check if the voice is already downloaded
    // If so, we can just play that locally downloaded voice preview
    const foundDownloadedVoice = downloadedVoices.find(downloadedVoice => downloadedVoice.id === voice.id);

    // If we have a downloaded voice preview, just play it
    if (foundDownloadedVoice && foundDownloadedVoice.exampleAudioUrl) {
      const localFilePath = await cache.getLocalFilePath(foundDownloadedVoice.exampleAudioUrl, LOCAL_CACHE_VOICE_PREVIEWS_PATH);
      return this.playVoicePreview(title, localFilePath, label, voice);
    }

    // If we have no voice preview downloaded yet, download it
    if (!foundDownloadedVoice) { return this.fetchVoicePreview(title, label, voice); }
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
        this.setState({ isLoadingPreviewVoiceId: '' });
      }
    });
  }

  isVoicePlayingInPlayer = (voiceId: string): boolean => {
    const { playbackState } = this.props;
    const isPlaying = playbackState === 'playing' && TrackPlayer.STATE_PLAYING && this.isVoiceActiveInPlayer(voiceId);
    return !!isPlaying;
  }

  isVoiceActiveInPlayer = (voiceId: string): boolean => {
    const { playerTrack } = this.props;
    return playerTrack && playerTrack.id === voiceId;
  }

  isSelected = (item: Api.Voice): boolean => {
    const { languagesWithActiveVoicesByLanguageName, userSelectedVoiceByLanguageName } = this.props;
    const selectedLanguageName = this.props.navigation.getParam('languageName', '');
    const languagewithActiveVoices = languagesWithActiveVoicesByLanguageName[selectedLanguageName];
    const userSelectedVoice = userSelectedVoiceByLanguageName[selectedLanguageName];

    const isDefaultSelected = !!languagewithActiveVoices && !!languagewithActiveVoices.voices && !!languagewithActiveVoices.voices.find(voice => voice.id === item.id && voice.isLanguageDefault);
    const isUserSelected = !!userSelectedVoice && userSelectedVoice.id === item.id;

    let isSelected = false;

    if (isUserSelected) {
      isSelected = isUserSelected;
    }

    if (!userSelectedVoice) {
      isSelected = isDefaultSelected;
    }

    return isSelected;
  }

  getBadgeValue(isPremium: boolean, isHighestQuality: boolean): string {
    if (isPremium && isHighestQuality) {
      return 'Premium (HQ)';
    }

    if (isPremium) {
      return 'Premium';
    }

    return 'Free';
  }

  render(): JSX.Element {
    const { languagesWithActiveVoicesByLanguageName } = this.props;
    const { isLoadingSaveSelectedVoiceId, isLoadingPreviewVoiceId } = this.state;
    const selectedLanguageName = this.props.navigation.getParam('languageName', '');

    const availableVoices = languagesWithActiveVoicesByLanguageName[selectedLanguageName].voices || [];

    const sectionListData = [
      // {
      //   title: 'Selected voice',
      //   data: [
      //     {
      //       title: userSelectedVoiceByLanguageName && userSelectedVoiceByLanguageName.name,
      //       subtitle: 'Something'
      //     }
      //   ]
      // },
      {
        key: 'available-voices',
        title: 'Available voices',
        data: availableVoices.map((voice, index) => {
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
          const subtitle = `${defaultLabel}${gender} (${voice.countryCode})`;

          const label = voice.label ? voice.label : 'Unknown';
          const rightIconColor = voice.isPremium ? colors.orange : undefined;

          return {
            key: voice.id,
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
            checkmark: true,
            rightIconColor
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
  readonly languagesWithActiveVoicesByLanguageName: ReturnType<typeof selectLanguagesWithActiveVoicesByLanguageName>;
  readonly userSelectedVoiceByLanguageName: ReturnType<typeof selectUserSelectedVoiceByLanguageName>;
  readonly isSubscribed: ReturnType<typeof selectIsSubscribed>;
  readonly errorSaveSelectedVoice: ReturnType<typeof selectUserErrorSaveSelectedVoice>;
}

const mapStateToProps = (state: RootState, props: Props) => ({
  playbackState: selectPlayerPlaybackState(state),
  playerTrack: selectPlayerTrack(state),
  downloadedVoices: selectDownloadedVoicePreviews(state),
  languagesWithActiveVoicesByLanguageName: selectLanguagesWithActiveVoicesByLanguageName(state),
  userSelectedVoiceByLanguageName: selectUserSelectedVoiceByLanguageName(state),
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
