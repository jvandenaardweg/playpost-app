import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default class SummariesScreen extends React.Component {
  static navigationOptions = {
    title: 'Summaries'
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>Quick summaries of large articles</Text>
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
