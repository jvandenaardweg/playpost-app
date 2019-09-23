import { TextStyle } from 'react-native';
import { textPresets } from '../components/Text';
import colors from '../constants/colors';
import layout from './layout';
import spacing from './spacing';

const textInput: TextStyle = {
  height: 50,
  backgroundColor: colors.grayLightest,
  borderRadius: layout.borderRadius.small,
  paddingLeft: spacing.medium,
  paddingRight: spacing.medium,
  alignItems: 'center',
  ...textPresets['lead'],
  lineHeight: textPresets['lead'].fontSize
};

export default textInput;
