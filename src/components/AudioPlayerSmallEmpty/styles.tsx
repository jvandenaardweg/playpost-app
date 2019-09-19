import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';

import spacing from '../../constants/spacing';
import styles from '../AudioPlayerSmall/styles';

export default StyleSheet.create({
  wrapper: {
    ...styles.wrapper
  },
  container: {
    ...styles.container
  },
  emptyText: {
    color: colors.white
  },
  placeHolder: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    position: 'absolute',
    right: spacing.large + 6,
    top: 2,
    bottom: 0
  }
});
