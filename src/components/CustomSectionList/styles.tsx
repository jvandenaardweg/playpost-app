import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import layout from '../../constants/layout';
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
  itemSeperator: { },
  rightIconText: {
    color: colors.grayDark
  },
  listItemLeftIconContainer: {
    borderRadius: layout.borderRadius.tiny,
    marginTop: -4,
    marginBottom: -4,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  listItemLeftIcon: {
    height: 14,
    width: 14
  },
  listItemContainer: {
    overflow: 'hidden'
    // marginLeft: spacing.default,
    // marginRight: spacing.default
  },
  listItemContainerBorderTopRadius: {
    // borderTopLeftRadius: 8, borderTopRightRadius: 8
  },
  listItemContainerBorderBottomRadius: {
    // borderBottomLeftRadius: 8, borderBottomRightRadius: 8
  }
});
