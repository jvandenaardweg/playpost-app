import {
  StyleSheet
} from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.default,
  },
  header: {
    marginBottom: spacing.default
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: fonts.fontSize.titleMedium,
    color: colors.black,
    fontWeight: fonts.fontWeight.semibold,
    marginBottom: spacing.default,
    marginTop: 12
  },
  title: {
    fontSize: fonts.fontSize.title,
    fontWeight: fonts.fontWeight.semibold,
    lineHeight: 21,
    marginBottom: 4
  },
  paragraph: {
    color: colors.paragraphGrayed,
    lineHeight: 24,
    fontSize: fonts.fontSize.body
  },
  feature: {
    marginBottom: spacing.medium,
    paddingBottom: spacing.medium,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  featureContent: {
    flex: 1,
    flexDirection: 'column'
  },
  featureIcon: {
    color: colors.tintColor,
    marginRight: spacing.default,
    marginLeft: 8,
    width: 40
  },
  footer: {
    marginTop: spacing.default,
    paddingTop: spacing.default,
    borderTopWidth: 1,
    borderColor: colors.grayLightest,
    paddingBottom: 24
  },
  footerText: {
    fontSize: fonts.fontSize.small,
    lineHeight: 18,
    opacity: 0.5
  },
  footerLinks: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 6,
    justifyContent: 'center'
  },
  textHighlight: {
    color: colors.black,
    opacity: 1
  },
  subscribeContainer: {
    paddingTop: 0
  }
});
