import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export class ListHeader extends React.PureComponent {

  render() {
    const { title, subtitle } = this.props

    return (
      <View style={styles.listHeader}>
        <Text style={styles.listHeaderTitle}>{title}</Text>
        <Text style={styles.listHeaderSubTitle}>{subtitle}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listHeader: {
    backgroundColor: '#0260ee',
    padding: 24
  },
  listHeaderTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6
  },
  listHeaderSubTitle: {
    color: '#ffffff',
    opacity: 0.6,
    fontSize: 15
  }
})
