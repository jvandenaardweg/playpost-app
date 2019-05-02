import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.errorBackground,
    padding: spacing.default,
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignContent: 'flex-start'
  },
  title: {
    color: colors.white,
    fontWeight: fonts.fontWeight.bold,
    marginBottom: 6
  },
  message: {
    color: colors.white
  },
  content: {
    width: '100%',
    flexShrink: 1
  },
  button: {
    width: 40,
    height: 40,
    alignItems: 'flex-end'
  }
});
