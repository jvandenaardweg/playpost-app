import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    height: 160,
    padding: 14,
    borderRadius: 10,
    width: '100%'
  },
  articleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.grayLightest
  },
  footer: {
    marginTop: 12
  },
  footerRow: {
    flexDirection: 'row'
  },
});
