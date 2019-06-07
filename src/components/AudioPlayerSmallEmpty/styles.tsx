import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';

import styles from '../AudioPlayerSmall/styles';

export default StyleSheet.create({
  container: {
    ...styles.container
  },
  emptyText: {
    fontSize: fonts.fontSize.body,
    color: colors.white,
    fontWeight: fonts.fontWeight.medium
  }
});
