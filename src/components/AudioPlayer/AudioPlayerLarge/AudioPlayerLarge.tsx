import React from 'react';
import { View, Text, TouchableHighlight, TouchableOpacity, ScrollView, NativeScrollEvent } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import TrackPlayer from 'react-native-track-player';
import { Slider } from 'react-native-elements';

import { ProgressBar } from '../ProgressBar';
import { PlayPauseControl } from '../PlayPauseControl';
import colors from '../../../constants/colors';

import styles from './styles';

interface Props {
  isPlaying: boolean;
  isLoading: boolean;
  track: TrackPlayer.Track;
  articleText: string | null | undefined;
  scrolled: number;
  onPressPlay(): void;
  onPressNext(): void;
  onPressPrevious(): void;
  onPressClose(): void;
  onScroll(event: { nativeEvent: NativeScrollEvent }): void;
  onProgressChange(value: number): void;
}

export class AudioPlayerLarge extends React.PureComponent<Props> {

  private scrollViewRef: React.RefObject<ScrollView> = React.createRef();

  componentDidMount() {
    const { scrolled } = this.props;
    console.log('set scrolled', scrolled);
    this.scrollViewRef.current && this.scrollViewRef.current.scrollTo({ x: 0, y: scrolled });
  }

  componentDidUpdate() {
    console.log('Update');
  }

  render() {
    const {
      isPlaying,
      isLoading,
      track: { title, artist },
      articleText,
      onPressPlay,
      onPressNext,
      onPressPrevious,
      onPressClose,
      onScroll,
      onProgressChange
    } = this.props;

    return (
      <View style={styles.wrapper}>
        <TouchableOpacity activeOpacity={1} onPress={onPressClose} style={styles.openCloseControl}>
          <Icon name="chevron-down" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.album}>{artist}</Text>
          </View>
          <View style={styles.scrollableContainer}>
            <ScrollView indicatorStyle="white" onScroll={onScroll} scrollEventThrottle={500} ref={this.scrollViewRef}>
              <View style={styles.scrollableContent}>
                <Text style={styles.contentText}>{articleText}</Text>
              </View>
            </ScrollView>
          </View>
          <View style={styles.controlsContainer}>
            <View style={styles.progressBarRow}>
              <ProgressBar onProgressChange={onProgressChange} />
              {/* <Slider
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor={colors.tintColor}
                maximumTrackTintColor={colors.grayDark}
                thumbTintColor={colors.white}
                thumbStyle={{ width: 16, height: 16 }}
                trackStyle={{ height: 3, borderRadius: 3 }}
                onSlidingComplete={onProgressChange}
              /> */}
            </View>
            <View style={styles.controlsRow}>
              <View><TouchableHighlight onPress={onPressPrevious}><Icon name="step-backward" size={22} color="#fff" /></TouchableHighlight></View>
              <View><PlayPauseControl size={42} isLoading={isLoading} isPlaying={isPlaying} onPressPlay={onPressPlay} /></View>
              <View><TouchableHighlight onPress={onPressNext}><Icon name="step-forward" size={22} color="#fff" /></TouchableHighlight></View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
