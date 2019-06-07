import React from 'react';
import { View, TouchableOpacity, ScrollView, NativeScrollEvent } from 'react-native';

import * as Icon from '../Icon';
import { AudioPlayerProgressBar } from '../AudioPlayerProgressBar';
import { PlayPauseControlCircle } from '../PlayPauseControl';
import { ArticleReader } from '../ArticleReader';

import { defaultHitslop } from '../../constants/buttons';
import colors from '../../constants/colors';

import styles from './styles';

interface Props {
  isPlaying: boolean;
  isLoading: boolean;
  article: Api.Article | undefined;
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
    this.scrollViewRef.current && this.scrollViewRef.current.scrollTo({ x: 0, y: scrolled });
  }

  render() {
    const {
      isPlaying,
      isLoading,
      onPressPlay,
      article,
      // onPressNext,
      // onPressPrevious,
      onPressClose,
      // onScroll,
      onProgressChange
    } = this.props;

    return (
      <View style={styles.wrapper}>
        <TouchableOpacity activeOpacity={1} onPress={onPressClose} style={styles.openCloseControl} hitSlop={defaultHitslop}>
          <Icon.FontAwesome5 name="chevron-down" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.container}>
          <View style={styles.scrollableContainer}>
            <ArticleReader article={article} theme="dark" />
            {/* <ScrollView indicatorStyle="white" onScroll={onScroll} scrollEventThrottle={500} ref={this.scrollViewRef}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.album}>{artist}</Text>
              </View>
              <View style={styles.scrollableContent}>
                {articleHtml && <WebView source={{ html: articleHtml }} />}
              </View>
            </ScrollView> */}
          </View>
          <View style={styles.controlsContainer}>
            <AudioPlayerProgressBar onProgressChange={onProgressChange} />
            <View style={styles.controlsRow}>
              {/* <View>
                <TouchableHighlight onPress={onPressPrevious} hitSlop={defaultHitslop}>
                  <Icon.FontAwesome5 name="redo-alt" size={20} color="#fff" />
                </TouchableHighlight>
              </View> */}
              <View>
                <PlayPauseControlCircle size={24} iconColor={colors.black} isLoading={isLoading} isPlaying={isPlaying} onPressPlay={onPressPlay} />
              </View>
              {/* <View>
                <TouchableHighlight onPress={onPressNext} hitSlop={defaultHitslop}>
                  <View>
                    <Icon.FontAwesome5 name="redo-alt" size={20} color="#fff" />
                  </View>
                </TouchableHighlight>
              </View> */}
            </View>
          </View>
        </View>
      </View>
    );
  }
}
