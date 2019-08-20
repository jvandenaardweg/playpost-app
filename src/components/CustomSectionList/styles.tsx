import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import spacing from '../../constants/spacing';

const sectionFooterHeight = spacing.default;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  containerStyle: {
    paddingTop: spacing.default,
    overflow: 'visible'
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
    fontSize: fonts.fontSize.small,
    fontWeight: fonts.fontWeight.medium
  },
  listItemContainer: {
    overflow: 'hidden',
    marginLeft: spacing.default,
    marginRight: spacing.default
  },
  listItemContainerBorderTopRadius: {
    borderTopLeftRadius: 8, borderTopRightRadius: 8
  },
  listItemContainerBorderBottomRadius: {
    borderBottomLeftRadius: 8, borderBottomRightRadius: 8
  }
});
