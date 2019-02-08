import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings'
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>Adjust voice settings</Text>
        <Text>Adjust audio quality</Text>
        <Text>Version info</Text>
        <Text>Contact info</Text>
        <Text>Clear cache</Text>
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
