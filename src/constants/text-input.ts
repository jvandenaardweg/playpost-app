import { TextStyle } from 'react-native';
import { textPresets } from '../components/Text';
import colors from '../constants/colors';
import { UserTheme } from '../reducers/user';
import layout from './layout';
import spacing from './spacing';

const textInput = (theme: UserTheme): TextStyle => ({
  height: 50,
  backgroundColor: (theme === UserTheme.dark) ? colors.gray700 : colors.grayLightest,
  borderRadius: layout.borderRadius.small,
  paddingLeft: spacing.medium,
  paddingRight: spacing.medium,
  color: (theme === UserTheme.dark) ? colors.white : colors.pureBlack,
  alignItems: 'center',
  ...textPresets['lead'],
  lineHeight: undefined
});

export const placeholderTextcolor = (theme: UserTheme) => (theme === UserTheme.dark) ? colors.gray400 : colors.gray100

export default textInput;
