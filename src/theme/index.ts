import { Theme } from 'react-native-elements';
import { textPresets } from '../components/Text';
import colors from '../constants/colors';
import layout from '../constants/layout';

export const reactNativeElementsTheme: Theme = {
  Button: {
    containerStyle: {
      borderRadius: layout.borderRadius.small
    },
    buttonStyle: {
      height: 50,
      borderRadius: layout.borderRadius.small
    },
    titleStyle: {
      ...textPresets['bodyEmphasized']
    },
    loadingProps: {
      color: colors.black
    }
  },
  Divider: {
    style: {
      backgroundColor: colors.borderDefault,
      borderColor: colors.borderDefault
    }
  },
  ListItem: {
    containerStyle: {
      backgroundColor: colors.listItemBackground
    },
    titleStyle: {
      ...textPresets['callout'],
      color: colors.black
    },
    subtitleStyle: {
      ...textPresets['footNote'],
      color: colors.grayDark,
      marginTop: 2
    }
  },
  colors: {
    primary: colors.tintColor,
    error: colors.redLight,
    divider: colors.borderDefault,
    success: colors.green,
    disabled: colors.appBackground
  }
};
