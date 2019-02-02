import React from 'react'
import { Text, View, StyleSheet } from 'react-native'

import Colors from '../constants/Colors'

export class Tag extends React.PureComponent {
  render() {
    const { focused, name } = this.props

    return (
      <View style={styles.container}>
        <Text style={styles.label}>{name}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: 25,
    paddingRight: 12,
    paddingLeft: 12,
    backgroundColor: '#E0F0FE',
    alignSelf: 'flex-start',
    borderRadius: 3
  },
  label: {
    color: '#3685D6',
    fontSize: 12,
    textAlign: 'center'
  }
})
