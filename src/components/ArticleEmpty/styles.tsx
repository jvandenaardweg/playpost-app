import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import spacing from '../../constants/spacing';
import { UserTheme } from '../../reducers/user';

export default (theme: UserTheme) => StyleSheet.create({
  articleEmptyContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: (theme === UserTheme.dark) ? colors.gray800 : colors.grayLightest,
    padding: spacing.default,
    width: '100%'
  },
  isFailed: {
    backgroundColor: colors.red,
  },
  textWhite: {
    color: colors.white
  },
  textFaded: {
    opacity: 0.9,
  },
  articleEmptyIcon: {
    justifyContent: 'center',
    width: 50
  },
  articleEmptyContent: {
    flexShrink: 1
  },
  articleEmptyFooter: {
    flexShrink: 1,
    height: 30,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  articleEmptyTitle: {
    color: (theme === UserTheme.dark) ? colors.white : colors.black,
    marginBottom: spacing.tiny
  },
  articleEmptyText: {
    color: (theme === UserTheme.dark) ? colors.gray100 : colors.black,
    opacity: 0.9,
    marginBottom: spacing.tiny,
  },
  link: {
    textDecorationLine: 'underline'
  }
});
