import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import { UserTheme } from '../../reducers/user';

export default (theme?: UserTheme) => StyleSheet.create({
  actionText: {
    color: colors.white,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightActionsContainer: {
    width: 250,
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 16
  },
  rightActionContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: 54 // 250 - 16 - 16 / 4
  },
});
