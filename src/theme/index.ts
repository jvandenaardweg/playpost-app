import { Theme } from 'react-native-elements';
import colors from '../constants/colors';
import fonts from '../constants/fonts';

export const reactNativeElementsTheme: Theme = {
  Button: {
    buttonStyle: {
      height: 50
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
  }
};
