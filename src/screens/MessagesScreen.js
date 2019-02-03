import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { ArticlesContainer } from '../containers/ArticlesContainer';

export default class MessagesScreen extends React.Component {
  static navigationOptions = {
    title: 'Articles',
  };

  render() {
    return (
      <ArticlesContainer />
    );
  }
}
