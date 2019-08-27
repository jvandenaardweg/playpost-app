import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  container: {
    paddingTop: spacing.default
    // padding: spacing.default
  },
  header: {
    marginBottom: spacing.default
  },
  headerTitle: {
    fontSize: fonts.fontSize.titleLarge,
    textAlign: 'center',
    fontWeight: fonts.fontWeight.bold,
    marginTop: spacing.default,
    marginBottom: spacing.large,
    color: colors.black
  },
  title: {
    fontSize: fonts.fontSize.title,
    fontWeight: fonts.fontWeight.semibold,
    lineHeight: Math.ceil(fonts.fontSize.title * 1.2),
    marginBottom: 4,
    color: colors.black
  },
  paragraph: {
    color: colors.paragraphGrayed,
    lineHeight: Math.ceil(fonts.fontSize.body * 1.5),
    fontSize: fonts.fontSize.body
  },
  featuresContainer: {
    padding: spacing.default,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: colors.grayLight
  },
  feature: {
    paddingTop: spacing.large,
    // marginBottom: spacing.medium,
    paddingBottom: spacing.large,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
    // backgroundColor: 'red'
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
    // padding: spacing.default,
    paddingBottom: 24
  },
  footerText: {
    fontSize: fonts.fontSize.small,
    lineHeight: Math.ceil(fonts.fontSize.small * 1.5),
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
    opacity: 1,
    textDecorationLine: 'underline'
  },
  subscribeContainer: {
    borderTopWidth: 1,
    borderColor: colors.grayLightest,
    padding: spacing.large
  },
  primaryButtonDisabledStyle: {
    backgroundColor: colors.tintColor
  },
  cardsScrollView: {
    backgroundColor: colors.appBackground,
    marginBottom: spacing.default,
    paddingLeft: 0,
    paddingRight: 0
  },
  cardsScrollViewFooter: {
    alignItems: 'center',
    paddingLeft: spacing.default,
    paddingRight: spacing.default,
    backgroundColor: 'green'
  },
  cardsScrollViewFooterText: {
    fontWeight: fonts.fontWeight.medium,
    fontSize: fonts.fontSize.body,
    textAlign: 'center'
  },
  card: {
    padding: spacing.default,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: spacing.default,
    marginTop: spacing.default
  },
  cardTitle: {
    fontSize: fonts.fontSize.titleLarge,
    fontWeight: fonts.fontWeight.normal,
    marginBottom: 12,
    marginTop: 12,
    color: colors.black
  },
  cardPriceContainer: {
    height: 70,
    justifyContent: 'center'
  },
  cardPrice: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -2,
    color: colors.black
  },
  cardMeta: {
    marginBottom: 8,
    marginTop: 6,
    marginLeft: 4,
    color: colors.paragraphGrayed
  },
  cardButtonContainer: {
    alignSelf: 'stretch',
    marginTop: 12,
    marginBottom: 6
  },
  cardFooter: {
    marginTop: 12
  },
  cardFooterText: {
    color: colors.gray
  },
  cardFeaturesList: {
    alignItems: 'center',
    paddingTop: spacing.default
  },
  cardFeaturesListItem: {
    marginBottom: 8,
    fontSize: fonts.fontSize.body
  },
  cardFeaturesListItemHighlight: {
    fontWeight: fonts.fontWeight.semibold
  }
});
