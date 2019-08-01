import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  container: {
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
    fontSize: fonts.fontSize.tiny,
    color: colors.grayDark,
    lineHeight: 18
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
    marginTop: 6,
    marginBottom: 6
  },
  bodyFooter: {
    flex: 1,
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 'auto',
    flexDirection: 'row',
    alignItems: 'baseline',
    height: 14
  },
  bodyFooterIcons: {
    flexDirection: 'row',
    width: 35
  },
  bodyTitleText: {
    fontSize: fonts.fontSize.title,
    fontWeight: fonts.fontWeight.semibold,
    color: colors.titleDefault,
    lineHeight: 21
  },
  bodyFooterText: {
    fontSize: fonts.fontSize.tiny,
    color: colors.grayDark,
    fontWeight: fonts.fontWeight.light,
    paddingLeft: 2
  },
  bodySourceIcon: {
    marginRight: 4
  },
  bodySourceText: {
    fontSize: fonts.fontSize.tiny,
    color: colors.grayDark,
    paddingRight: 0,
    fontWeight: fonts.fontWeight.light
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
    color: colors.grayDark,
    textAlign: 'center',
    marginTop: 6,
    fontSize: fonts.fontSize.tiny,
    fontWeight: fonts.fontWeight.light
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray,
    borderRadius: 4,
    width: 75,
    height: 75
  },
  playButtonContainer: {
    position: 'absolute',
    width: 32,
    height: 32
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 4,
    opacity: 0.9
  },
  imagePlaceholder: {
    backgroundColor: colors.grayLight
  },
  warningContainer: {
    backgroundColor: colors.orangeDark,
    padding: spacing.small,
    borderRadius: 6,
    marginTop: spacing.default,
  },
  warningHighlight: {
    fontStyle: 'italic',
    fontWeight: fonts.fontWeight.semibold
  },
  warningText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  warningLink: {
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
    marginTop: 4
  }
});
