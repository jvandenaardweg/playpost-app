import { TextStyle } from 'react-native';
import { textTemplates } from '../components/Text';
import colors from '../constants/colors';
import layout from './layout';
import spacing from './spacing';

const textInput: TextStyle = {
  height: 54,
  backgroundColor: colors.white,
  borderWidth: 1,
  borderColor: colors.borderDefault,
  borderRadius: layout.borderRadius.tiny,
  paddingLeft: spacing.default,
  paddingRight: spacing.default,
  marginBottom: spacing.small,
  alignItems: 'center',
  ...textTemplates['callout']
};

export default textInput;
