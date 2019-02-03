import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { Article } from '../components/Article';

export default class MessagesScreen extends React.Component {
  static navigationOptions = {
    title: 'Articles',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Article />
        <Article />
        <Article />
        <Article />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
