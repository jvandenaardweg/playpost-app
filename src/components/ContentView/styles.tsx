import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  container: {
    flex: 1
  },
  footer: {
    padding: spacing.default,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderDefault
  }
});
