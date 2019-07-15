import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  articleEmptyContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.appBackground,
    padding: spacing.medium,
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
    fontSize: fonts.fontSize.body,
    fontWeight: fonts.fontWeight.semibold,
    color: colors.black,
    lineHeight: 21,
    marginBottom: spacing.tiny
  },
  articleEmptyText: {
    color: colors.black,
    opacity: 0.9,
    marginBottom: spacing.tiny,
  },
  link: {
    textDecorationLine: 'underline'
  }
});
