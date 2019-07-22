import {
  StyleSheet
} from 'react-native';

import colors from '../../constants/colors';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: spacing.default,
    borderRadius: 10
  },
  footer: {
    marginTop: spacing.default
  },
  messageText: {
    color: colors.black
  }
});
