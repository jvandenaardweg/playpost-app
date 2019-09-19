import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
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
    width: 320
  },
  text: {
    color: colors.white,
    opacity: 0.9,
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: spacing.default
  },
  title: {
    color: colors.white,
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: spacing.default
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
