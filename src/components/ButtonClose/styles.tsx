import memoize from 'fast-memoize';
import { StyleSheet } from 'react-native';

import spacing from '../../constants/spacing';
import { UserTheme } from '../../reducers/user';

export default memoize((theme: UserTheme) => StyleSheet.create({
  container: {
    marginRight: spacing.default,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 36
  }
}));
