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
    flexDirection: 'row'
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
    // flexGrow: 0,
    // flexShrink: 1,
    // flexBasis: 'auto',
    flexDirection: 'column',
    // backgroundColor: 'red'
  },
  sectionControl: {
    width: 80,
    marginLeft: spacing.default,
    // backgroundColor: 'red'
  },
  author: {
    fontSize: fonts.fontSize.tiny,
    color: colors.paragraphGrayed,
    lineHeight: 18
  },
  bodyMeta: {
    flex: 1,
    flexGrow: 0,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    // backgroundColor: 'green',
    height: 16
  },
  bodyTitle: {
    flex: 1,
    flexGrow: 0,
    flexBasis: 'auto',
    marginTop: 6,
    marginBottom: 6,
    // backgroundColor: 'yellow'
  },
  bodyFooter: {
    flex: 1,
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 'auto',
    flexDirection: 'row',
    alignItems: 'baseline',
    // backgroundColor: 'blue',
    height: 16
  },
  bodyTitleText: {
    fontSize: fonts.fontSize.title,
    fontWeight: fonts.fontWeight.semibold,
    color: colors.titleDefault,
    lineHeight: 21,
    // marginTop: 6,
    // marginBottom: 6
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
    paddingRight: 28,
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
    width: 30,
    height: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
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
  articleEmptyActivityIndicator: {
    marginBottom: spacing.small
  },
  articleEmpty: {
    flex: 1,
    backgroundColor: colors.articleBackground,
    padding: spacing.medium,
    width: '100%',
    justifyContent: 'center'
  },
  articleEmptyText: {
    color: colors.grayLight,
    alignSelf: 'center'
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray,
    borderRadius: 4,
    width: 80,
    height: 80,
  },
  playButtonContainer: {
    position: 'absolute',
    width: 30,
    height: 30
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 4,
    opacity: 0.9
  },
  imagePlaceholder: {
    backgroundColor: colors.grayLight
  }
});
