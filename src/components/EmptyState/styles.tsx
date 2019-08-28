import { Platform, StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.appBackground,
    paddingRight: spacing.small,
    paddingLeft: spacing.small,
  },
  content: {
    alignItems: 'center'
  },
  title: {
    textAlign: 'center',
    fontSize: fonts.fontSize.titleMedium,
    fontWeight: Platform.OS === 'ios' ? fonts.fontWeight.semibold : fonts.fontWeight.bold,
    color: colors.titleDefault,
    marginBottom: 6
  },
  description: {
    textAlign: 'center',
    fontSize: fonts.fontSize.body,
    lineHeight: Math.ceil(fonts.fontSize.body * 1.5),
    color: colors.paragraphGrayed,
    paddingRight: spacing.large,
    paddingLeft: spacing.large,
    marginBottom: spacing.medium
  },
  button: {
    marginTop: spacing.large,
    paddingLeft: spacing.large,
    paddingRight: spacing.large
  },
  icon: {
    marginTop: spacing.small,
    marginBottom: spacing.default,
    borderWidth: 1,
    borderColor: colors.grayLight,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    opacity: 0.8
  }
});
