import { StyleSheet } from 'react-native';

import fonts from '../../constants/fonts';
import colors from '../../constants/colors';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.articleBackground,
    padding: spacing.default,
    width: '100%',
    flexDirection: 'row',
  },
  isMoving: {
    backgroundColor: colors.appBackground
  },
  isActive: {
    backgroundColor: colors.tintColor
  },
  seperator: {
    backgroundColor: colors.articleBackground,
    paddingLeft: spacing.default,
    paddingRight: spacing.default
  },
  seperatorLine: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderDefault,
  },
  sectionBody: {
    flex: 1,
    flexDirection: 'column'
  },
  sectionControl: {
    width: 80,
    marginLeft: spacing.default
  },
  author: {
    fontSize: fonts.fontSize.tiny,
    color: colors.paragraphGrayed,
    lineHeight: 18
  },
  bodyMeta: {
    flexDirection: 'row',
    alignItems: 'baseline',
    height: 14
  },
  bodyMetaIcons: {
    flexDirection: 'row',
    width: 39
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
    height: 16
  },
  bodyTitleText: {
    fontSize: fonts.fontSize.title,
    fontWeight: fonts.fontWeight.semibold,
    color: colors.titleDefault,
    lineHeight: 21,
  },
  bodyFooterText: {
    fontSize: fonts.fontSize.tiny,
    color: colors.paragraphGrayed,
    fontWeight: fonts.fontWeight.thin,
    paddingLeft: 2
  },
  bodySourceIcon: {
    marginRight: 4
  },
  bodySourceText: {
    fontSize: fonts.fontSize.tiny,
    color: colors.paragraphGrayed,
    paddingRight: 0,
    fontWeight: fonts.fontWeight.thin
  },
  authorName: {
    color: colors.paragraphGrayed
  },
  publicationName: {
    color: colors.paragraphGrayed
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
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,

    elevation: 1,
  },
  controlButtonActive: {
    backgroundColor: colors.controlButtonActive
  },
  duration: {
    color: colors.paragraphGrayed,
    textAlign: 'center',
    marginTop: 6,
    fontSize: fonts.fontSize.tiny,
    fontWeight: fonts.fontWeight.thin
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray,
    borderRadius: 4,
    width: 80,
    height: 80
  },
  playButtonContainer: {
    position: 'absolute',
    width: 32,
    height: 32
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 4,
    opacity: 0.8
  },
  imagePlaceholder: {
    backgroundColor: colors.grayLight
  }
});
