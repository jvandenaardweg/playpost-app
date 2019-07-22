import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import spacing from '../../constants/spacing';

const seperatorHeight = spacing.default;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
    paddingTop: spacing.default
  },
  seperator: {
    height: seperatorHeight
  },
  rightIconText: {
    color: colors.grayDark,
    fontSize: fonts.fontSize.body
  }
});
