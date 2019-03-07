import React, { Component, Ref } from 'react';
import { Animated, StyleSheet, View, Alert } from 'react-native';

import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import Icon from 'react-native-vector-icons/Feather';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export class AppleStyleSwipeableRow extends Component {
  swipeableRow: any = React.createRef()

  renderLeftActions = (progress: Animated.Value, dragX: Animated.Value) => {
    const translateX = dragX.interpolate({
      inputRange: [0, 50, 80, 81],
      outputRange: [-20, 0, 0, 1],
    });
    const scale = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    return (
      <RectButton style={styles.leftAction} onPress={this.close}>
        <AnimatedIcon
          name="archive"
          size={20}
          color="#10A641"
          style={[styles.actionIcon, { transform: [{ scale }, { translateX }] }]}
        />
      </RectButton>
    );
  };

  renderRightAction = (action: string, icon: string, color: string, fill: string, x: number, progress: Animated.Value, dragX: Animated.Value) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    const pressHandler = (actionName: string) => {
      this.close();
      Alert.alert(`Should ${actionName} this article.`);
    };
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={() => pressHandler(action)}
        >
          <AnimatedIcon
            name={icon}
            size={20}
            color={fill}
            style={[styles.actionIcon, { transform: [{ scale }] }]}
          />
        </RectButton>
      </Animated.View>
    );
  };

  renderRightActions = (progress: Animated.Value, dragX: Animated.Value) => (
    <View style={{ width: 192, flexDirection: 'row' }}>
      {this.renderRightAction('download', 'download', '#CDE7F0', '#1566AA', 128, progress, dragX)}
      {this.renderRightAction('delete', 'trash-2', '#FBD6D6', '#E7383D', 64, progress, dragX)}
    </View>
  );

  onSwipeableLeftWillOpen = () => {
    Alert.alert('Should archive this article');
  };

  updateRef = (ref: any) => {
    this.swipeableRow = ref;
  };

  close = () => {
    this.swipeableRow && this.swipeableRow.close();
  };

  render() {
    const { children } = this.props;
    return (
      <Swipeable
        ref={this.updateRef}
        friction={2}
        leftThreshold={80}
        rightThreshold={40}
        onSwipeableLeftWillOpen={this.onSwipeableLeftWillOpen}
        renderLeftActions={this.renderLeftActions}
        renderRightActions={this.renderRightActions}
      >
        {children}
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#CDF0D8',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  // rightAction: {
  //   alignItems: 'center',
  //   flex: 1,
  //   justifyContent: 'center',
  // },
  actionIcon: {
    width: 30,
    marginHorizontal: 20,
  },
  rightAction: {
    alignItems: 'center',
    backgroundColor: '#dd2c00',
    flex: 1,
    justifyContent: 'center',
  },
});
