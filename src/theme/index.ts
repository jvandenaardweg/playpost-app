import { Theme } from 'react-native-elements';
import colors from '../constants/colors';

export const reactNativeElementsTheme: Theme = {
  Button: {
    buttonStyle: {
      height: 55
    },
    titleStyle: {
      fontWeight: '600',
      fontSize: 17
    },
  },
  Divider: {
    style: {
      backgroundColor: colors.borderDefault
    }
  }
};
