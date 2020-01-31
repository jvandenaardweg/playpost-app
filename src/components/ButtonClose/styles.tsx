import memoize from 'fast-memoize';
import { StyleSheet } from 'react-native';

import spacing from '../../constants/spacing';

export default memoize(() => StyleSheet.create({
  container: {
    marginRight: spacing.default,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32
  }
}));
