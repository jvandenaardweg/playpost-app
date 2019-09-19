import {
  StyleSheet
} from 'react-native';

import colors from '../../constants/colors';
import layout from '../../constants/layout';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: spacing.default,
    borderRadius: layout.borderRadius.large
  },
  footer: {
    marginTop: spacing.default
  },
  messageText: {
    color: colors.black
  }
});
