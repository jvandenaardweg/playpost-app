import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.tintColor
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.tintColor,
    padding: 16,
    paddingTop: 0,
    paddingBottom: '27%'
  },
  image: {
    width: 320,
    height: 320,
  },
  text: {
    color: colors.white,
    opacity: 0.9,
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
    fontSize: fonts.fontSize.body,
    lineHeight: 24,
  },
  title: {
    fontSize: fonts.fontSize.headline,
    lineHeight: 28,
    color: colors.white,
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: fonts.fontWeight.semibold
  },
  footerContainer: {
    marginBottom: 22,
    paddingLeft: 14,
    paddingRight: 14
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
