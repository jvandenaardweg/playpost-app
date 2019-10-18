import {
  StyleSheet
} from 'react-native';

import colors from '../../constants/colors';
import spacing from '../../constants/spacing';
import { UserTheme } from '../../reducers/user';

export default (theme?: UserTheme) => StyleSheet.create({
  container: {

  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme === UserTheme.dark ? colors.gray800 : colors.white,
    paddingBottom: spacing.default,
    paddingTop: spacing.default,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme === UserTheme.dark ? colors.gray600 : colors.borderDefault
  },
  filterLabel: {
    marginRight: spacing.default,
    width: 56,
    marginLeft: spacing.default
  },
  scrollView: {
    flexDirection: 'row', alignItems: 'center'
  },
  filterOption: {
    marginRight: 6
  }
});
