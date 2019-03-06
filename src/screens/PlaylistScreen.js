import React from 'react';
import { View } from 'react-native';
import { PlaylistsContainer } from '@/containers/PlaylistsContainer';
import colors from '@/constants/colors';

export default class PlaylistScreen extends React.Component {
  static navigationOptions = {
    title: 'Playlist',
  };

  render() {
    return (
      <View style={{ backgroundColor: colors.appBackground, flex: 1 }}>
        <PlaylistsContainer />
      </View>
    );
  }
}
