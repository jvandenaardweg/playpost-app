import React from 'react';
import { Animated, StyleSheet, View, Alert } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
// import Icon from 'react-native-vector-icons/Feather';
import * as Icon from '../../components/Icon';

import { NetworkContext } from '../../contexts/NetworkProvider';
import fonts from '../../constants/fonts';
import colors from '../../constants/colors';

interface Props {
  removeArticle(): void;
  archiveArticle(): void;
  favoriteArticle(): void;
  isFavorited: boolean;
  isArchived: boolean;
}
export class AppleStyleSwipeableRow extends React.PureComponent<Props> {
  private swipeableRef: React.RefObject<Swipeable> = React.createRef();

  static contextType = NetworkContext;

  renderLeftActions = (progress: Animated.Value, dragX: Animated.Value) => {
    return (
      <RectButton style={styles.leftAction} onPress={this.close}>
        <Icon.Feather
          name="archive"
          size={20}
          color="#10A641"
          style={styles.actionIcon}
        />
      </RectButton>
    );
  }

  handleOnPressRightAction = (actionName: string) => {
    const { isConnected } = this.context;
    const { isFavorited, isArchived } = this.props;

    if (!isConnected) {
      this.close();
      return Alert.alert('No internet', 'You need an active internet connection to do this.');
    }

    if (actionName === 'delete') {
      this.props.removeArticle();
    }

    if (actionName === 'favorite') {
      if (!isFavorited) {
        this.props.favoriteArticle();
      }
    }

    if (actionName === 'archive') {
      if (!isArchived) {
        this.props.archiveArticle();
      }
    }

    if (actionName === 'download') {
      return Alert.alert('Not available yet', 'This feature is not available yet.');
    }

    return this.close();
  }

  renderRightAction = (action: string, icon: string, iconColor: string | null) => {
    return (
      <Animated.View style={{ flex: 1 }}>
        <RectButton
          style={styles.rightAction}
          onPress={() => this.handleOnPressRightAction(action)}
        >
          <Icon.Feather
            name={icon}
            size={20}
            color={(iconColor) ? iconColor : colors.gray}
            style={styles.actionIcon}
          />
        </RectButton>
      </Animated.View>
    );
  }

  renderRightActions = (progress: Animated.Value, dragX: Animated.Value) => (
    <View style={{ width: 250, flexDirection: 'row', paddingLeft: 16, paddingRight: 16 }}>
      {this.renderRightAction('download', 'download', null)}
      {this.renderRightAction('archive', 'archive', (this.props.isArchived) ? colors.black : null)}
      {this.renderRightAction('favorite', 'heart', (this.props.isFavorited) ? colors.black : null)}
      {this.renderRightAction('delete', 'trash-2', null)}
    </View>
  )

  // onSwipeableLeftWillOpen = () => {
  //   const { isConnected } = this.context;

  //   if (!isConnected) {
  //     this.close();
  //     return Alert.alert('No internet', 'You need an active internet connection to listen to archive this article.');
  //   }

  //   return this.props.archiveArticle();
  // }

  close = () => {
    this.swipeableRef.current && this.swipeableRef.current.close();
  }

  render() {
    return (
      <Swipeable
        ref={this.swipeableRef}
        friction={2}
        // leftThreshold={80}
        rightThreshold={40}
        // onSwipeableLeftWillOpen={this.onSwipeableLeftWillOpen}
        // renderLeftActions={this.renderLeftActions}
        renderRightActions={this.renderRightActions}
      >
        {this.props.children}
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
    fontSize: fonts.fontSize.body,
    backgroundColor: 'transparent',
    padding: 10,
  },
  actionIcon: {
    width: 30,
    marginHorizontal: 20,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
