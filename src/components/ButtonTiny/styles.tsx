import memoize from 'fast-memoize';
import { StyleSheet } from 'react-native';

import spacing from '../../constants/spacing';
import { UserTheme } from '../../reducers/user';

export default memoize((theme: UserTheme) => StyleSheet.create({
  container: {
    height: 28,
    borderRadius: 28
  },
  wrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 28,
    borderRadius: 28,
    paddingLeft: spacing.small,
    paddingRight: spacing.small,
  },
  icon: {
    marginLeft: 6,
    marginRight: -1
  }
}));
