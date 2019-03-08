import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.errorBackground,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignContent: 'flex-start'
  },
  title: {
    color: colors.white,
    fontWeight: '700',
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
