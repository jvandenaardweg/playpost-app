import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ArticlesContainer } from '../containers/ArticlesContainer';
import { AudioPlayer } from '../components/AudioPlayer';

export default class MessagesScreen extends React.Component {
  static navigationOptions = {
    title: 'Articles',
  };

  render() {
    return (
      <View>
        <AudioPlayer />
        <ArticlesContainer />
      </View>

    );
  }
}
