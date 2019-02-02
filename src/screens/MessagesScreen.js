import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default class MessagesScreen extends React.Component {
  static navigationOptions = {
    title: 'Messages',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>Messages</Text>
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
