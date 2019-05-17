import React from 'react';
import { FlatList, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import TrackPlayer from 'react-native-track-player';

import { LOCAL_CACHE_VOICE_PREVIEWS_PATH } from '../../constants/files';

import * as cache from '../../cache';

import { VoicePreviewButton } from '../VoicePreviewButton';
import { NetworkContext } from '../../contexts/NetworkProvider';
import { RootState } from '../../reducers';
import { setTrack } from '../../reducers/player';
import { setDownloadedVoice } from '../../reducers/voices';
import { saveSelectedVoice } from '../../reducers/user';

import { getPlayerPlaybackState, getPlayerTrack } from '../../selectors/player';
import { getDownloadedVoicePreviews, getAvailableVoicesByLanguageName, getDefaultVoicesByLanguageName } from '../../selectors/voices';

import styles from './styles';
import { ALERT_SETTINGS_VOICE_CHANGE, ALERT_GENERIC_INTERNET_REQUIRED } from '../../constants/messages';

import * as Icon from '../../components/Icon';
import colors from '../../constants/colors';
import { getUserSelectedVoiceByLanguageName } from '../../selectors/user';

interface IProps {
  onPressUpgrade(): void;
  languageName: string;
}

type Props = IProps & StateProps & DispatchProps;

interface State {
  isLoadingVoiceId: string; // voice ID: "d2ede165-9dc0-4969-af8c-f4ff3716da53"
}

export class VoicesSelectComponent extends React.PureComponent<Props, State> {

  state = {
    isLoadingVoiceId: ''
  };

  static contextType = NetworkContext;

  keyExtractor = (item: Api.Voice, index: number) => index.toString();

  handleOnListItemPress = (item: Api.Voice) => {
    const { isConnected } = this.context;
    const isSelected = this.isSelected(item);

    if (!isConnected) {
      return Alert.alert('Not connected', ALERT_GENERIC_INTERNET_REQUIRED);
    }

    // TODO: check if user is premium
    // if (item.isPremium) {
    //   Alert.alert(
    //     'Upgrade to Premium',
    //     'This higher quality voice is only available for Premium users.',
    //     [
    //       {
    //         text: 'Cancel',
    //         style: 'cancel'
    //       },
    //       {
    //         text: 'Upgrade',
    //         onPress: () => this.props.onPressUpgrade(),
    //       },
    //     ],
    //     { cancelable: true }
    //     );
    // } else {

    // Only change voice when it's not already selected
    if (!isSelected) {
      Alert.alert(
        'Only for new articles',
        ALERT_SETTINGS_VOICE_CHANGE,
        [
          {
            text: 'OK',
            onPress: () => {
              this.props.saveSelectedVoice(item.id); // Saves the selected voice in the database
              // TODO: get user voice settings after success
            }
          }
        ]
      );
    }
    // }
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
      this.props.setTrack({
        title,
        id: voice.id,
        url: localFilePath,
        artist: label,
        album: 'Voice previews'
      });
    }

    return TrackPlayer.play();
  }

  fetchVoicePreview = async (title: string, label: string, voice: Api.Voice) => {

    this.setState({ isLoadingVoiceId: voice.id }, async () => {
      try {
        if (!voice.exampleAudioUrl) return Alert.alert('No voice preview available, yet.');

        // Download the file and put it in a local cache directory
        const localFilePath = await cache.downloadVoicePreview(voice.exampleAudioUrl);

        // Set it as downloaded in the Redux store
        this.props.setDownloadedVoice(voice);

        // Set the track, resulting in automatic playback
        return this.playVoicePreview(title, localFilePath, label, voice);

      } catch (err) {
        const message = (err.message) ? err.message : null;
        const alertMessage = (message) ? `An error happened while downloading the voice preview: "${message}".` : 'An error happened while downloading the voice preview.';

        return Alert.alert(
          'Oops!',
          alertMessage,
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Try again',
              onPress: () => this.fetchVoicePreview(title, label, voice),
            },
          ],
          { cancelable: true }
        );
      } finally {
        return this.setState({ isLoadingVoiceId: '' });
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
    const { defaultVoicesByLanguageName, userSelectedVoiceByLanguageName } = this.props;
    const isDefaultSelected = (defaultVoicesByLanguageName) ? !!defaultVoicesByLanguageName.find(voice => voice.id === item.id) : false;
    const isUserSelected = (userSelectedVoiceByLanguageName && userSelectedVoiceByLanguageName.id === item.id);

    let isSelected = false;

    if (isUserSelected) {
      isSelected = isUserSelected;
    }

    if (!userSelectedVoiceByLanguageName) {
      isSelected = isDefaultSelected;
    }

    return isSelected;
  }

  renderItem = ({ item }: { item: Api.Voice}) => {

    const { isLoadingVoiceId } = this.state;

    const defaultLabel = (item.isLanguageDefault) ? '(Default) ' : '';
    const badgeValue = (item.isPremium) ? 'premium' : 'free';
    const gender = (item.gender === 'MALE') ? 'Male' : 'Female';
    const subtitle = `${defaultLabel}${gender}, ${item.language.name} (${item.countryCode})`;

    const title = `${item.label || item.name}`;
    const label = (item.label) ? item.label : 'Unknown';
    const badgeStatus = (item.isPremium) ? 'warning' : 'primary';

    // Determine if the default voice is selected
    // Or if the user already selected a different voice as it's language default
    const isSelected = this.isSelected(item);
    const isPlaying = this.isVoicePlayingInPlayer(item.id);
    const isLoading = isLoadingVoiceId === item.id;
    const isActive = this.isVoiceActiveInPlayer(item.id);

    return (
      <ListItem
        bottomDivider
        onPress={() => this.handleOnListItemPress(item)}
        title={title}
        subtitle={subtitle}
        badge={{ value: badgeValue, status: badgeStatus, textStyle: styles.listItemBadgeText, badgeStyle: styles.listItemBadge }}
        leftElement={<VoicePreviewButton isPlaying={isPlaying} isLoading={isLoading} isActive={isActive} onPress={() => this.handleOnPreviewPress(title, label, item)} />}
        containerStyle={[styles.listItemContainer, (isSelected) ? { backgroundColor: colors.grayLightest } : {}]}
        titleStyle={styles.listItemTitle}
        subtitleStyle={styles.listItemSubtitle}
        rightElement={
          <Icon.FontAwesome5
            name="check"
            size={16}
            solid
            color={(isSelected) ? colors.black : colors.grayLightest}
          />
        }
      />
    );
  }

  render() {
    const { availableVoicesByLanguageName } = this.props;

    return (
      <FlatList
        keyExtractor={this.keyExtractor}
        data={availableVoicesByLanguageName}
        renderItem={this.renderItem}
        extraData={this.props} // So it re-renders when our props change
      />
    );
  }
}

interface DispatchProps {
  saveSelectedVoice: typeof saveSelectedVoice;
  setDownloadedVoice: typeof setDownloadedVoice;
  setTrack: typeof setTrack;
}

interface StateProps {
  readonly playbackState: ReturnType<typeof getPlayerPlaybackState>;
  readonly playerTrack: ReturnType<typeof getPlayerTrack>;
  readonly downloadedVoices: ReturnType<typeof getDownloadedVoicePreviews>;
  readonly availableVoicesByLanguageName: ReturnType<typeof getAvailableVoicesByLanguageName>;
  readonly defaultVoicesByLanguageName: ReturnType<typeof getDefaultVoicesByLanguageName>;
  readonly userSelectedVoiceByLanguageName: ReturnType<typeof getUserSelectedVoiceByLanguageName>;
}

const mapStateToProps = (state: RootState, props: Props) => ({
  playbackState: getPlayerPlaybackState(state),
  playerTrack: getPlayerTrack(state),
  downloadedVoices: getDownloadedVoicePreviews(state),
  availableVoicesByLanguageName: getAvailableVoicesByLanguageName(state, props), // does not memoize correctly? // https://github.com/reduxjs/reselect#containersvisibletodolistjs-2
  defaultVoicesByLanguageName: getDefaultVoicesByLanguageName(state, props),
  userSelectedVoiceByLanguageName: getUserSelectedVoiceByLanguageName(state, props)
});

const mapDispatchToProps = {
  saveSelectedVoice,
  setTrack,
  setDownloadedVoice
};

export const VoicesSelect = connect(
  mapStateToProps,
  mapDispatchToProps
)(VoicesSelectComponent);
