
import React from 'react'
import { View } from 'react-native'
import { BottomTabBar } from 'react-navigation'
import { AudioPlayerContainer } from '../containers/AudioPlayerContainer'

// import Colors from '../constants/Colors'

export const TabBar = (props) => (
  <View style={{ borderTopColor: '#666', backgroundColor: '#fff' }}>
    <AudioPlayerContainer />
    <BottomTabBar {...props} />
  </View>
);
