import React from 'react'
import { StyleSheet, View } from 'react-native'

import LinkedInModal from 'react-native-linkedin'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default class Linked extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <LinkedInModal
          clientID="[ Your client id from https://www.linkedin.com/developer/apps ]"
          clientSecret="[ Your client secret from https://www.linkedin.com/developer/apps ]"
          redirectUri="[ Your redirect uri set into https://www.linkedin.com/developer/apps ]"
          onSuccess={token => console.log(token)}
        />
      </View>
    )
  }
}
