import React from 'react';
import { Button, ScrollView, StyleSheet, Text } from 'react-native';

export default class ProjectsDetailScreen extends React.Component {
  static navigationOptions = {
    title: 'A single project',
    headerStyle: {
      backgroundColor: '#0260ee'
    }
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>A single project</Text>
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
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
