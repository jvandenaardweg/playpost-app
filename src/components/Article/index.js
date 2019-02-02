import React from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import styles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome5'

export class Article extends React.PureComponent {

  handleOnPress = (event) => {
    alert('press')
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.meta}>
          <Text style={styles.title}>How to use the Digital Transformation to create new markets</Text>
          <Text style={styles.description} ellipsizeMode='tail' numberOfLines={2}>Can we describe as digital transformation all those projects that include digital technologies? Are we making a transformation if we do not</Text>
          <Text style={styles.author}>
            <Text style={styles.authorName}>Gianfilippo Ceraselli</Text> in <Text style={styles.publicationName}>The Startup</Text>, 12 jan. 2019
          </Text>
        </View>
        <View style={styles.control}>
          <TouchableOpacity style={styles.button} onPress={this.handleOnPress}>
            <Icon
              name="play"
              size={14}
              color={'white'}
            />
          </TouchableOpacity>
          <Text style={styles.duration}>5 min</Text>
          {/* <Button title="Play" /> */}
        </View>
      </View>
    );
  }
}
