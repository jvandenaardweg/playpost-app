import React from 'react';
import { FlatList, TouchableOpacity, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { getAvailableVoices, getSelectedVoice } from '../../selectors/voices';
import { setSelectedVoice } from '../../reducers/voices';

import styles from './styles';
import { RootState } from '../../reducers';

interface Props {
  allAvailableVoices: Api.Voice[];
  setSelectedVoice(voiceId: string): void;
  selectedVoice: Api.Voice | undefined;
}

export class VoicesSelectComponent extends React.PureComponent<Props> {

  keyExtractor = (item: Api.Voice, index: number) => index.toString();

  renderPreviewButton = () => {
    return (
      <TouchableOpacity style={styles.previewButton} activeOpacity={1} onPress={() => Alert.alert('Preview', 'Not available yet in this version of the app.')}>
        <Icon name="play" size={10} style={styles.previewButtonIcon} />
      </TouchableOpacity>
    );
  }

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

  renderItem = ({ item }: { item: Api.Voice}) => {
    const { selectedVoice } = this.props;
    const badgeValue = (item.isPremium) ? 'premium' : 'free';
    const label = (item.label) ? item.label : 'Unknown';
    const gender = (item.gender === 'MALE') ? 'Male' : 'Female';

    const isSelected = (selectedVoice && selectedVoice.id && selectedVoice.id === item.id) ? true : false;

    return (
      <ListItem
        onPress={() => this.handleOnListItemPress(item)}
        title={`${item.languageName} (${item.countryCode})`}
        subtitle={`${label}, ${gender}`}
        subtitleStyle={{ opacity: 0.7 }}
        badge={{ value: badgeValue, textStyle: { color: 'white' }, badgeStyle: { paddingLeft: 4, paddingRight: 4 } }}
        rightElement={this.renderPreviewButton()}
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
  selectedVoice: getSelectedVoice(state)
});

const mapDispatchToProps = {
  setSelectedVoice
};

export const VoicesSelect = connect(
  mapStateToProps,
  mapDispatchToProps
)(VoicesSelectComponent);
