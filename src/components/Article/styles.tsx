import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import layout from '../../constants/layout';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  container: {
  },
  contentContainer: {
    backgroundColor: colors.articleBackground,
    padding: spacing.default,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  isMoving: {
    backgroundColor: colors.appBackground
  },
  isActive: {
    backgroundColor: colors.tintColor
  },
  sectionBody: {
    flex: 1,
    flexDirection: 'column'
  },
  sectionControl: {
    width: 75,
    marginLeft: spacing.default,
    marginTop: 4
  },
  author: {
    color: colors.grayDark
  },
  bodyMeta: {
    flexDirection: 'row',
    alignItems: 'baseline',
    height: 14
  },
  bodyMetaSource: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto'
  },
  bodyTitle: {
    flex: 1,
    flexGrow: 0,
    flexBasis: 'auto',
    marginTop: spacing.tiny,
    marginBottom: spacing.tiny
  },
  bodyFooter: {
    flex: 1,
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    height: 18
  },
  bodyFooterIcons: {
    flexDirection: 'row',
    width: 31,
    justifyContent: 'space-between',
    marginRight: spacing.nano,
    height: 10 // icon height
  },
  bodyTitleText: {
    color: colors.titleDefault
  },
  bodyFooterText: {
    color: colors.grayDark,
    paddingLeft: 2,
    paddingRight: 6 // so our "rtl" text has enough spacing
  },
  bodySourceIcon: { },
  bodySourceText: {
    color: colors.grayDark,
    paddingRight: 0
  },
  authorName: {
    color: colors.grayDark
  },
  publicationName: {
    color: colors.grayDark
  },
  controlButton: {
    backgroundColor: colors.controlButtonDefault,
    width: 32,
    height: 32,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,

    elevation: 1
  },
  controlButtonActive: {
    backgroundColor: colors.controlButtonActive
  },
  duration: {
    color: colors.gray,
    textAlign: 'center',
    marginTop: 6
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray,
    borderRadius: layout.borderRadius.small,
    width: 75,
    height: 75,
    overflow: 'hidden'
  },
  playButtonContainer: {
    position: 'absolute',
    width: 32,
    height: 32
  },
  image: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  imagePlaceholder: {
    backgroundColor: colors.grayLight,
    borderRadius: layout.borderRadius.small,
  },
  warningContainer: {
    borderRadius: layout.borderRadius.small,
    marginTop: spacing.default,
  },
  warningWrapper: {
    padding: spacing.small,
    borderRadius: layout.borderRadius.small,
    backgroundColor: colors.orangeDark,
  },
  warningHighlight: { },
  warningText: {
    flexDirection: 'row',
    // flexWrap: 'wrap'
  },
  warningLink: {
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
    marginTop: 4
  }
});
