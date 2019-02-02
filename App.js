import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import AppNavigator from './src/navigation/AppNavigator'

type Props = {};

export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <AppNavigator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  }
});


