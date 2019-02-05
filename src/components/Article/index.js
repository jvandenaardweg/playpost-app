import React from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import styles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome5'

import Swipeout from 'react-native-swipeout';

// Buttons
var swipeoutBtns = [
  {
    text: 'Archive',
    backgroundColor: 'green',
    component: <View style={{height: '100%', justifyContent: 'center', alignItems: 'center'}}><Icon name='archive' size={20} color={'white'} /></View>
  },
  {
    text: 'Delete',
    backgroundColor: 'red',
    component: <View style={{height: '100%', justifyContent: 'center', alignItems: 'center'}}><Icon name='trash-alt' size={20} color={'white'} /></View>
  }
]

export class Article extends React.PureComponent {

  handleOnPress = (event) => {
    alert('press')
  }

  render() {
    return (
      <Swipeout right={swipeoutBtns}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>How to use the Digital Transformation to create new markets</Text>
          </View>
          <View style={styles.body}>
            <View style={styles.meta}>
              <View style={styles.source}>
                <Icon
                  name='bookmark'
                  size={12}
                  style={styles.sourceIcon}
                />
                {/* <Icon
                  name='arrow-circle-down'
                  size={12}
                  style={styles.sourceIcon}
                /> */}
                <Text style={styles.sourceName}>medium.com</Text>
              </View>
              <Text style={styles.description} ellipsizeMode='tail' numberOfLines={2}>Can we describe as digital transformation all those projects that include digital technologies? Are we making a transformation if we do not</Text>
              <Text style={styles.author}>
                <Text style={styles.authorName}>Gianfilippo Ceraselli</Text> in <Text style={styles.publicationName}>The Startup</Text>
              </Text>
            </View>
            <View style={styles.control}>
              <TouchableOpacity style={styles.controlButton} onPress={this.handleOnPress}>
                <Icon
                  name="play"
                  size={14}
                  color={'white'}
                  style={styles.controlIcon}
                />
              </TouchableOpacity>
              <Text style={styles.duration}>5 min</Text>
            </View>
          </View>
        </View>
      </Swipeout>

    );
  }
}
