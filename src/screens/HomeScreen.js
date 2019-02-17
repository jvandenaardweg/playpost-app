import React from 'react';
import { View } from 'react-native';

import { ArticlesContainer } from '../containers/ArticlesContainer';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Playlist',
  };

  render() {
    return (
      <View>
        <ArticlesContainer />
      </View>
    );
  }
}
