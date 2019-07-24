import React from 'react';
import { Alert, Animated, StyleSheet, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
// tslint:disable-next-line: no-submodule-imports
import Swipeable from 'react-native-gesture-handler/Swipeable';

import * as Icon from '../../components/Icon';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import { NetworkContext } from '../../contexts/NetworkProvider';

interface Props {
  isFavorited: boolean;
  isArchived: boolean;
  removeArticle(): void;
  archiveArticle(): void;
  favoriteArticle(): void;
  unArchiveArticle(): void;
  unFavoriteArticle(): void;
}
export class SwipeableRow extends React.PureComponent<Props> {

  static contextType = NetworkContext;
  private swipeableRef: React.RefObject<Swipeable> = React.createRef();

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
      } else {
        this.props.unFavoriteArticle();
      }
    }

    if (actionName === 'archive') {
      if (!isArchived) {
        this.props.archiveArticle();
      } else {
        this.props.unArchiveArticle();
      }
    }

    if (actionName === 'download') {
      return Alert.alert('Not available yet', 'This feature is not available yet.');
    }

    return this.close();
  }

  renderRightAction = (action: string, icon: string, iconColor: string | null) => {
    return (
      <View style={styles.rightActionContainer}>
        <RectButton
          style={styles.rightAction}
          onPress={() => this.handleOnPressRightAction(action)}
        >
          <Icon.Feather
            name={icon}
            size={22}
            color={(iconColor) ? iconColor : colors.gray}
          />
        </RectButton>
      </View>
    );
  }

  renderRightActions = (progressAnimatedValue: Animated.Value | Animated.AnimatedInterpolation, dragAnimatedValue: Animated.Value | Animated.AnimatedInterpolation) => {
    const { isArchived, isFavorited } = this.props;

    return (
      <Animated.View style={styles.rightActionsContainer}>
        {/* {this.renderRightAction('download', 'download', null)} */}
        {this.renderRightAction('archive', 'archive', (isArchived) ? colors.black : null)}
        {this.renderRightAction('favorite', 'heart', (isFavorited) ? colors.black : null)}
        {this.renderRightAction('delete', 'trash-2', null)}
      </Animated.View>
    );
  }

  close = () => this.swipeableRef.current && this.swipeableRef.current.close()

  render(): JSX.Element {
    return (
      <Swipeable
        ref={this.swipeableRef}
        friction={2}
        rightThreshold={40}
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
  rightActionsContainer: {
    width: 250,
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 16
  },
  rightActionContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: 54 // 250 - 16 - 16 / 4
  },
});
