import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import spacing from '../../constants/spacing';
import fonts from '../../constants/fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground
  },
  sectionList: {
    padding: spacing.default
  },
  seperator: {
    height: 10
  },
  rightIconText: {
    color: colors.gray,
    fontSize: fonts.fontSize.body
  }
});
