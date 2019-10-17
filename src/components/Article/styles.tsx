import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import layout from '../../constants/layout';
import spacing from '../../constants/spacing';
import { UserTheme } from '../../reducers/user';

export default (theme?: UserTheme) => StyleSheet.create({
  container: {
  },
  contentContainer: {
    backgroundColor: theme === UserTheme.dark ? colors.grayDarkest : colors.articleBackground,
    padding: spacing.default,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  isMoving: {
    backgroundColor: theme === UserTheme.dark ? colors.grayDarker : colors.appBackground
  },
  isActive: {
    backgroundColor: colors.tintColor
  },
  sectionBody: {
    flex: 1,
    flexDirection: 'column',
  },
  sectionControl: {
    width: 75,
    marginLeft: spacing.large,
    marginTop: 4,
    height: '100%',
    alignItems: 'center'
  },
  author: {
    color: theme === UserTheme.dark ? colors.grayDarkest : colors.grayDark
  },
  bodyMeta: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  bodyMetaSource: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    alignItems: 'stretch'
  },
  bodyTitle: {
    flex: 1,
    flexGrow: 0,
    flexBasis: 'auto',
    marginBottom: spacing.tiny
  },
  bodyFooter: {
    flex: 1,
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 'auto',
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  bodyFooterIcons: {
    flexDirection: 'row',
    width: 31,
    justifyContent: 'space-between',
    marginRight: spacing.nano,
    height: 10 // icon height
  },
  bodyTitleText: {
    color: theme === UserTheme.dark ? colors.white : colors.titleDefault
  },
  bodyFooterText: {
    color: theme === UserTheme.dark ? colors.grayDarker : colors.grayDark,
    paddingRight: 6 // so our "rtl" text has enough spacing
  },
  bodySourceIcon: {
    marginRight: 6
  },
  bodySourceText: {
    color: theme === UserTheme.dark ? colors.grayDarker : colors.grayDark,
    paddingRight: 0,
    marginBottom: spacing.tiny
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
  durationContainer: {
    textAlign: 'center',
    marginTop: spacing.micro,
    backgroundColor: theme === UserTheme.dark ? 'rgba(255, 255, 255, 0.2)' : colors.grayLightest,
    borderRadius: 21,
    paddingTop: 3,
    paddingBottom: 0,
    paddingLeft: 8,
    paddingRight: 8,
    height: 21,
  },
  durationText: {
    color: theme === UserTheme.dark ? colors.gray : colors.grayDark,
  },
  downloadText: {
    color: theme === UserTheme.dark ? colors.grayDarker : colors.grayDark,
  },
  durationContainerActive: {
    backgroundColor: colors.tintColor
  },
  durationTextActive: {
    color: colors.white
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
    flexDirection: 'row'
  },
  warningLink: {
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
    marginTop: 4
  }
});
