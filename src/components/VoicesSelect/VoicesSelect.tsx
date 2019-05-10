import React from 'react';
import { FlatList, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import TrackPlayer from 'react-native-track-player';

import { LOCAL_CACHE_VOICE_PREVIEWS_PATH } from '../../constants/files';

import * as cache from '../../cache';

import { VoicePreviewButton } from '../VoicePreviewButton';

import { RootState } from '../../reducers';
import { setTrack, PlaybackStatus } from '../../reducers/player';
import { setSelectedVoice, setDownloadedVoice } from '../../reducers/voices';

import { getPlayerPlaybackState, getPlayerTrack } from '../../selectors/player';
import { getAvailableVoices, getSelectedVoice, getDownloadedVoices } from '../../selectors/voices';

import styles from './styles';
import { ALERT_SETTINGS_VOICE_CHANGE } from '../../constants/messages';

interface IProps {
  onPressUpgrade(): void;
}

type Props = IProps & StateProps & DispatchProps;

interface State {
  isLoadingVoiceId: string; // voice ID: "d2ede165-9dc0-4969-af8c-f4ff3716da53"
}

export class VoicesSelectComponent extends React.PureComponent<Props, State> {

  state = {
    isLoadingVoiceId: ''
  };

  keyExtractor = (item: Api.Voice, index: number) => index.toString();

  handleOnListItemPress = (item: Api.Voice) => {
    const { selectedVoice } = this.props;

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
    if (selectedVoice && selectedVoice.id !== item.id) {
      Alert.alert(
        'Only for new articles',
        ALERT_SETTINGS_VOICE_CHANGE,
        [
          {
            text: 'OK',
            onPress: () => this.props.setSelectedVoice(item.id)
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

  renderItem = ({ item }: { item: Api.Voice}) => {
    const { selectedVoice } = this.props;
    const { isLoadingVoiceId } = this.state;

    const badgeValue = (item.isPremium) ? 'premium' : 'free';
    const title = `${item.languageName} (${item.countryCode})`;
    const gender = (item.gender === 'MALE') ? 'Male' : 'Female';
    const subtitle = `${item.label} (${gender})`;
    const label = (item.label) ? item.label : 'Unknown';
    const badgeStatus = (item.isPremium) ? 'warning' : 'primary';

    const isSelected = (selectedVoice && selectedVoice.id && selectedVoice.id === item.id) ? true : false;
    const isPlaying = this.isVoicePlayingInPlayer(item.id);
    const isLoading = isLoadingVoiceId === item.id;
    const isActive = this.isVoiceActiveInPlayer(item.id);

    return (
      <ListItem
        bottomDivider
        onPress={() => this.handleOnListItemPress(item)}
        title={`${item.languageName} (${item.countryCode})`}
        subtitle={subtitle}
        badge={{ value: badgeValue, status: badgeStatus, textStyle: styles.listItemBadgeText, badgeStyle: styles.listItemBadge }}
        leftElement={<VoicePreviewButton isPlaying={isPlaying} isLoading={isLoading} isActive={isActive} onPress={() => this.handleOnPreviewPress(title, label, item)} />}
        checkmark={isSelected}
        containerStyle={styles.listItemContainer}
        titleStyle={styles.listItemTitle}
        subtitleStyle={styles.listItemSubtitle}
      />
    );
  }

  render() {
    return (
      <FlatList
        keyExtractor={this.keyExtractor}
        data={this.props.allAvailableVoices}
        renderItem={this.renderItem}
        extraData={this.props} // So it re-renders when our props change
      />
    );
  }
}

interface DispatchProps {
  setSelectedVoice: typeof setSelectedVoice;
  setDownloadedVoice: typeof setDownloadedVoice;
  setTrack: typeof setTrack;
}

interface StateProps {
  readonly allAvailableVoices: ReadonlyArray<Api.Voice>;
  readonly playbackState: PlaybackStatus;
  readonly selectedVoice: Api.Voice | undefined;
  readonly playerTrack: TrackPlayer.Track;
  readonly downloadedVoices: ReadonlyArray<Api.Voice>;
}

const mapStateToProps = (state: RootState) => ({
  allAvailableVoices: getAvailableVoices(state),
  selectedVoice: getSelectedVoice(state),
  playbackState: getPlayerPlaybackState(state),
  playerTrack: getPlayerTrack(state),
  downloadedVoices: getDownloadedVoices(state)
});

const mapDispatchToProps = {
  setSelectedVoice,
  setTrack,
  setDownloadedVoice
};

export const VoicesSelect = connect(
  mapStateToProps,
  mapDispatchToProps
)(VoicesSelectComponent);
