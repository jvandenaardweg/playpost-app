import { Theme } from 'react-native-elements';
import colors from '../constants/colors';
import fonts from '../constants/fonts';

export const reactNativeElementsTheme: Theme = {
  Button: {
    containerStyle: {
      borderRadius: 8
    },
    buttonStyle: {
      height: 54,
      borderRadius: 8
    },
    titleStyle: {
      fontWeight: fonts.fontWeight.bold,
      fontSize: fonts.fontSize.button
    }
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
