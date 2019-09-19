import { Theme } from 'react-native-elements';
import { textTemplates } from '../components/Text';
import colors from '../constants/colors';
import layout from '../constants/layout';

export const reactNativeElementsTheme: Theme = {
  Button: {
    containerStyle: {
      borderRadius: layout.borderRadius.medium
    },
    buttonStyle: {
      height: 50,
      borderRadius: layout.borderRadius.medium
    },
    titleStyle: {
      ...textTemplates['bodyEmphasized']
    }
  },
  Divider: {
    style: {
      backgroundColor: colors.borderDefault,
      borderColor: colors.borderDefault
    }
  },
  ListItem: {
    titleStyle: {
      ...textTemplates['body'],
      color: colors.black
    },
    subtitleStyle: {
      ...textTemplates['footNote'],
      color: colors.grayDark,
      marginTop: 2
    }
  },
  colors: {
    primary: colors.tintColor,
    error: colors.redLight,
    divider: colors.borderDefault,
    success: colors.green
  }
};
