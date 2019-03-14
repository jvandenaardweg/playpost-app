import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

// import styles from './styles';

interface Props {

}

export const AudioPlayerLarge = (props: Props) => (
  <View>
    <View>
      <TouchableHighlight>
        <Icon name="chevron" size={32} />
      </TouchableHighlight>
    </View>
    <View>
      <Text>Title</Text>
      <Text>Author on Source.com</Text>
    </View>
    <View>
      <Text>scrollable text</Text>
    </View>
    <View>
      <View>
        <Text>Progress bar</Text>
      </View>
      <View>
        <View><TouchableHighlight><Text>prev</Text></TouchableHighlight></View>
        <View><TouchableHighlight><Text>play/pause</Text></TouchableHighlight></View>
        <View><TouchableHighlight><Text>next</Text></TouchableHighlight></View>
      </View>
    </View>
  </View>
);
