import { Theme } from 'react-native-elements';
import colors from '../constants/colors';
import fonts from '../constants/fonts';

export const reactNativeElementsTheme: Theme = {
  Button: {
    containerStyle: {
      borderRadius: 4
    },
    buttonStyle: {
      height: 50,
      borderRadius: 4
    },
    titleStyle: {
      fontWeight: fonts.fontWeight.semibold,
      fontSize: fonts.fontSize.button
    },
  },
  Divider: {
    style: {
      backgroundColor: colors.borderDefault,
      borderColor: colors.borderDefault
    }
  },
  colors: {
    primary: colors.tintColor,
    error: colors.redLight,
    divider: colors.borderDefault,
    success: colors.green
  }
};
