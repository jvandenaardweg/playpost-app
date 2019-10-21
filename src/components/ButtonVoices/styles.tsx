import { StyleSheet } from 'react-native';

import spacing from '../../constants/spacing';
import { UserTheme } from '../../reducers/user';

export default (theme: UserTheme) => StyleSheet.create({
  container: {
    paddingLeft: spacing.default
  }
});
