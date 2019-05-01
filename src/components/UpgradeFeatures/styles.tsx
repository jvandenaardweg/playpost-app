import {
  StyleSheet
} from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
  },
  header: {
    marginBottom: 14
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: fonts.fontSize.titleMedium,
    color: colors.black,
    fontWeight: fonts.fontWeight.semibold,
    marginBottom: 16,
    marginTop: 12
  },
  title: {
    fontSize: fonts.fontSize.title,
    fontWeight: fonts.fontWeight.semibold,
    marginBottom: 4
  },
  paragraph: {
    color: colors.paragraphGrayed,
    lineHeight: 24,
    fontSize: fonts.fontSize.body
  },
  feature: {
    marginTop: 14,
    paddingBottom: 14,
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
    marginRight: 18,
    marginLeft: 8,
    width: 40
  },
  footer: {
    marginTop: 16,
    paddingTop: 16,
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
    paddingTop: 24
  }
});
