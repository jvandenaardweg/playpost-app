import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  modal: {
    alignItems: 'center'
  },
  container: {
    backgroundColor: colors.white,
    padding: spacing.large,
    paddingBottom: spacing.default,
    borderRadius: 8,
    maxWidth: 450
  },
  title: {
    marginTop: spacing.tiny,
    fontSize: fonts.fontSize.titleExtraLarge,
    fontWeight: fonts.fontWeight.semibold,
    marginBottom: spacing.large,
    lineHeight: fonts.fontSize.titleExtraLarge * 1.2,
    textAlign: 'center'
  },
  paragraph: {
    fontSize: fonts.fontSize.body,
    lineHeight: fonts.fontSize.body * 1.5,
    marginBottom: spacing.large,
    textAlign: 'center'
  },
  paragraphBold: {
    fontWeight: fonts.fontWeight.semibold
  },
  footer: {
    marginTop: spacing.tiny
  }
});
