import React, { useContext, useRef } from 'react';
import { Alert, Animated, LayoutAnimation, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
// tslint:disable-next-line: no-submodule-imports
import Swipeable from 'react-native-gesture-handler/Swipeable';

import * as Icon from '../../components/Icon';
import colors from '../../constants/colors';
import { ALERT_TITLE_ERROR_NO_INTERNET } from '../../constants/messages';
import { NetworkContext } from '../../contexts/NetworkProvider';
import { UserThemeContext } from '../../contexts/UserThemeProvider';

import styles from './styles';
import { UserTheme } from '../../reducers/user';

interface Props {
  isFavorited: boolean;
  isArchived: boolean;
  removeArticle(): void;
  archiveArticle(): void;
  favoriteArticle(): void;
  unArchiveArticle(): void;
  unFavoriteArticle(): void;
}

export const SwipeableRow: React.FC<Props> = React.memo(({
  isFavorited, isArchived, removeArticle, archiveArticle, favoriteArticle, unArchiveArticle, unFavoriteArticle, children
}) => {
  const { isConnected } = useContext(NetworkContext)
  const { theme } = useContext(UserThemeContext)
  const swipeableRef = useRef<Swipeable>(null)

  const handleOnPressRightAction = (actionName: string) => {
    if (!isConnected) {
      close();
      return Alert.alert(ALERT_TITLE_ERROR_NO_INTERNET, 'You need an active internet connection to do ');
    }

    close();

    // Animate the change in the list view
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    if (actionName === 'delete') {
      removeArticle();
    }

    if (actionName === 'favorite') {
      if (!isFavorited) {
        favoriteArticle();
      } else {
        unFavoriteArticle();
      }
    }

    if (actionName === 'archive') {
      if (!isArchived) {
        archiveArticle()
      } else {
        unArchiveArticle();
      }
    }
  }

  const renderRightAction = (action: string, icon: string, iconColor: string | null) => {
    const defaultColor = (theme === UserTheme.dark) ? colors.grayDarker : colors.gray
    return (
      <View style={styles(theme).rightActionContainer}>
        <RectButton
          style={styles(theme).rightAction}
          onPress={() => handleOnPressRightAction(action)}
        >
          <Icon.Feather
            name={icon}
            size={22}
            color={(iconColor) ? iconColor : defaultColor}
          />
        </RectButton>
      </View>
    );
  }

  const renderRightActions = (progressAnimatedValue: Animated.Value | Animated.AnimatedInterpolation, dragAnimatedValue: Animated.Value | Animated.AnimatedInterpolation) => {
    const iconColorActive = (theme === UserTheme.dark) ? colors.white : colors.black;

    return (
      <View style={styles(theme).rightActionsContainer}>
        {/* {this.renderRightAction('download', 'download-cloud', (isArchived) ? colors.black : null)} */}
        {renderRightAction('archive', 'archive', (isArchived) ? iconColorActive : null)}
        {renderRightAction('favorite', 'heart', (isFavorited) ? iconColorActive : null)}
        {renderRightAction('delete', 'trash-2', null)}
      </View>
    );
  }

  const close = () => swipeableRef.current && swipeableRef.current.close()


  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      rightThreshold={50}
      renderRightActions={renderRightActions}
      useNativeAnimations
    >
      {children}
    </Swipeable>
  )
})
