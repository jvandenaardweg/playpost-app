import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import spacing from '../../constants/spacing';

const seperatorHeight = 10;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground
  },
  sectionList: {
    padding: spacing.default,
    paddingTop: spacing.default - seperatorHeight
  },
  seperator: {
    height: seperatorHeight
  },
  rightIconText: {
    color: colors.grayDark,
    fontSize: fonts.fontSize.body
  }
});
