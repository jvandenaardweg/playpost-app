import { Theme } from 'react-native-elements';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import spacing from '../constants/spacing';

export const reactNativeElementsTheme: Theme = {
  Button: {
    containerStyle: {
      borderRadius: 8
    },
    buttonStyle: {
      height: 50,
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
  ListItem: {
    containerStyle: {
      marginLeft: spacing.default,
      marginRight: spacing.default,
    },
    titleStyle: {
      fontWeight: fonts.fontWeight.medium,
      fontSize: fonts.fontSize.title,
      color: colors.black
    },
    subtitleStyle: {
      color: colors.grayDark,
      fontSize: fonts.fontSize.small,
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
