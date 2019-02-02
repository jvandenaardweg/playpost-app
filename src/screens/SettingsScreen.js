import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
    headerStyle: {
      backgroundColor: '#0260ee'
    },
    headerTitleStyle: {
      color: '#ffffff'
    }
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>Projects</Text>
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
