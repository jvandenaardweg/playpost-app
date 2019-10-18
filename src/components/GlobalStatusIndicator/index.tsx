import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, View } from 'react-native';

import { Props } from '../../containers/GlobalStatusIndicatorContainer';

import Text from '../Text';
import styles from './styles';

export type Props = Props;

export const GlobalStatusIndicator: React.FC<Props> = React.memo((props) => {
  const startAnimatedValue = 60;
  const [animatedBottomValue] = useState(new Animated.Value(startAnimatedValue));
  const [localLabel, setLocalLabel] = useState('')

  const labelPlaylistIsLoadingCreateItem = (props.playlistIsLoadingCreateItem) ? 'Adding article...' : '';
  const labelAudiofileStatus = (props.audiofileStatus) ? props.audiofileStatus : '';

  const label = labelPlaylistIsLoadingCreateItem || labelAudiofileStatus;

  const isActive = !!labelAudiofileStatus || !!labelPlaylistIsLoadingCreateItem;

  useEffect(() => {
    if (isActive) {
      Animated.spring(
        animatedBottomValue,
        {
          toValue: 0,
          useNativeDriver: true,
          velocity: 4,
          speed: 8
        }
      ).start();
    } else {
      Animated.spring(
        animatedBottomValue,
        {
          delay: 250,
          toValue: startAnimatedValue,
          useNativeDriver: true,
          velocity: 4,
          speed: 8
        }
      ).start(() => setLocalLabel(''));
    }

  }, [isActive, label])

  useEffect(() => {
    if (label) {
      setLocalLabel(label);
    }
  }, [label])

  return (
    <Animated.View style={[styles.container, { transform: [{translateY: animatedBottomValue}] }]}>
      <View style={styles.wrapper}>
        <ActivityIndicator size="small" color="white" style={styles.activityIndicator} />
        <Text style={styles.label} testID="GlobalStatusIndicator-label" preset="subheadEmphasized">
          {localLabel}
        </Text>
      </View>
    </Animated.View>
  );
});
