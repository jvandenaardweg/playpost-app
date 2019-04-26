import React from 'react';
import { FlatList, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import TrackPlayer from 'react-native-track-player';
import { setTrack, PlaybackStatus } from '../../reducers/player';
import { getPlayerPlaybackState } from '../../selectors/player';
import { downloadVoicePreview } from '../../storage';

import { getAvailableVoices, getSelectedVoice } from '../../selectors/voices';
import { setSelectedVoice } from '../../reducers/voices';

// import styles from './styles';
import { RootState } from '../../reducers';
import { VoicePreviewButton } from '../VoicePreviewButton';

interface Props {
  allAvailableVoices: Api.Voice[];
  playbackState: PlaybackStatus;
  setSelectedVoice(voiceId: string): void;
  selectedVoice: Api.Voice | undefined;
  setTrack(track: TrackPlayer.Track): void;
}

export class VoicesSelectComponent extends React.PureComponent<Props> {

  keyExtractor = (item: Api.Voice, index: number) => index.toString();

  handleOnListItemPress = (item: Api.Voice) => {
    const { selectedVoice } = this.props;

    if (item.isPremium) {
      Alert.alert(
        'Upgrade to Premium',
        'This higher quality voice is only available for Premium users.',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Upgrade',
            onPress: () => {},
          },
        ],
        { cancelable: true }
        );
    } else {
      if (selectedVoice && selectedVoice.id !== item.id) {
        this.props.setSelectedVoice(item.id);
      }
    }
  }

  handleOnPreviewPress = async (title: string, label: string, url: string | null, id: string) => {
    if (!url) return Alert.alert('No voice preview available, yet.');

    const localFilePath = await downloadVoicePreview(url);

    return this.props.setTrack({
      id,
      title,
      url: localFilePath,
      artist: label,
      album: 'Voice previews'
    });
  }

  renderItem = ({ item }: { item: Api.Voice}) => {
    const { selectedVoice, playbackState } = this.props;
    const badgeValue = (item.isPremium) ? 'premium' : 'free';
    const title = `${item.languageName} (${item.countryCode})`;
    const label = (item.label) ? item.label : 'Unknown';
    const gender = (item.gender === 'MALE') ? 'Male' : 'Female';

    const isSelected = (selectedVoice && selectedVoice.id && selectedVoice.id === item.id) ? true : false;

    return (
      <ListItem
        onPress={() => this.handleOnListItemPress(item)}
        title={`${item.languageName} (${item.countryCode})`}
        subtitle={`${label}, ${gender}, ${playbackState}`}
        subtitleStyle={{ opacity: 0.7 }}
        badge={{ value: badgeValue, textStyle: { color: 'white' }, badgeStyle: { paddingLeft: 4, paddingRight: 4 } }}
        rightElement={<VoicePreviewButton onPress={() => this.handleOnPreviewPress(title, label, item.exampleAudioUrl, item.id)} />}
        bottomDivider
        checkmark={isSelected}
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

const mapStateToProps = (state: RootState) => ({
  allAvailableVoices: getAvailableVoices(state),
  selectedVoice: getSelectedVoice(state),
  playbackState: getPlayerPlaybackState(state)
});

const mapDispatchToProps = {
  setSelectedVoice,
  setTrack
};

export const VoicesSelect = connect(
  mapStateToProps,
  mapDispatchToProps
)(VoicesSelectComponent);
