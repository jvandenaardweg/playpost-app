import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import spacing from '../../constants/spacing';

const sectionFooterHeight = spacing.default;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
    paddingTop: spacing.default
  },
  sectionFooter: {
    height: sectionFooterHeight
  },
  itemSeperator: {
    marginLeft: spacing.default,
    marginRight: spacing.default
  },
  rightIconText: {
    color: colors.grayDark,
    fontSize: fonts.fontSize.body
  }
});
