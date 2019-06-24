import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';

import styles from '../AudioPlayerSmall/styles';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  wrapper: {
    ...styles.wrapper
  },
  container: {
    ...styles.container
  },
  emptyText: {
    fontSize: fonts.fontSize.body,
    color: colors.white,
    fontWeight: fonts.fontWeight.medium
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
