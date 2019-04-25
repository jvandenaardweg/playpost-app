import React from 'react';
import { FlatList, TouchableOpacity, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { getVoices, getAvailableVoices } from '../../selectors/voices';

import styles from './styles';
import { RootState } from '../../reducers';

interface Props {
  allVoices: Api.Voice[];
  allAvailableVoices: Api.Voice[];
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
      // Alert.alert('Standard voice', 'This premium voice is only available for Premium users.');
    }

  }

  renderItem = ({ item }: { item: Api.Voice}) => {
    const badgeValue = (item.isPremium) ? 'premium' : 'free';
    const label = (item.label) ? item.label : 'Unknown';
    const gender = (item.gender === 'MALE') ? 'Male' : 'Female';

    return (
      <ListItem
        onPress={() => this.handleOnListItemPress(item)}
        title={`${item.languageName} (${item.countryCode})`}
        subtitle={`${label}, ${gender}`}
        subtitleStyle={{ opacity: 0.7 }}
        // leftAvatar={{ source: { uri: item.avatar_url } }}
        badge={{ value: badgeValue, textStyle: { color: 'white' }, badgeStyle: { paddingLeft: 4, paddingRight: 4 } }}
        rightElement={this.renderPreviewButton()}
        bottomDivider
      />
    );
  }

  render() {
    return (
      <FlatList
        keyExtractor={this.keyExtractor}
        data={this.props.allAvailableVoices}
        renderItem={this.renderItem}
        // style={styles.container}
      />
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  allVoices: getVoices(state),
  allAvailableVoices: getAvailableVoices(state)
});

const mapDispatchToProps = { };

export const VoicesSelect = connect(
  mapStateToProps,
  mapDispatchToProps
)(VoicesSelectComponent);
