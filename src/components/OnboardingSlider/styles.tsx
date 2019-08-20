import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.tintColor
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tintColor,
    padding: spacing.default,
    paddingTop: 0,
    paddingBottom: '25%'
  },
  image: {
    width: 320,
    // height: 320,
  },
  text: {
    color: colors.white,
    opacity: 0.9,
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: spacing.default,
    fontSize: fonts.fontSize.paragraph,
    lineHeight: Math.ceil(fonts.fontSize.paragraph * 1.5),
  },
  title: {
    fontSize: fonts.fontSize.headline,
    lineHeight: Math.ceil(fonts.fontSize.headline * 1.2),
    color: colors.white,
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: spacing.default,
    fontWeight: fonts.fontWeight.bold
  },
  footerContainer: {
    marginBottom: 22,
    paddingLeft: spacing.default,
    paddingRight: spacing.default
  },
  signupButtonTitleStyle: {
    color: colors.black
  },
  signupButtonStyle: {
    backgroundColor: colors.white,
    marginBottom: 4
  },
  loginButtonTitleStyle: {
    color: colors.white
  }
});
