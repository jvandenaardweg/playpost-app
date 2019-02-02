import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default class OrganizationsScreen extends React.Component {
  static navigationOptions = {
    title: 'Organizations',
    header: ( /* Your custom header */
      <View
        style={{
          height: 80,
          marginTop: 20 /* only for IOS to give StatusBar Space */
        }}
      >
        <Text>This is CustomHeader</Text>
      </View>
    )
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>Organizations</Text>
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
