import { Platform, StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import layout from '../../constants/layout';
import spacing from '../../constants/spacing';
import { UserTheme } from '../../reducers/user';

export default (theme: UserTheme) => StyleSheet.create({
  container: {
    paddingTop: spacing.default,
    backgroundColor: theme === UserTheme.dark ? colors.black : colors.grayLightest
  },
  header: {
    marginBottom: spacing.default
  },
  headerTitle: {
    textAlign: 'center',
    marginTop: spacing.default,
    marginBottom: spacing.large,
    color: theme === UserTheme.dark ? colors.white : colors.black
  },
  title: {
    marginBottom: 4,
    color: theme === UserTheme.dark ? colors.white : colors.black
  },
  paragraph: {
    color: theme === UserTheme.dark ? colors.gray100 : colors.gray900
  },
  featuresContainer: {
    padding: spacing.large,
    backgroundColor: theme === UserTheme.dark ? colors.black : colors.white,
    borderTopWidth: 1,
    borderTopColor: theme === UserTheme.dark ? colors.black : colors.grayLight
  },
  feature: {
    paddingTop: spacing.large,
    paddingBottom: spacing.large,
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
    width: 48
  },
  footer: {
    marginTop: spacing.large,
    marginBottom: spacing.large
  },
  footerText: {
    opacity: 0.5
  },
  footerLinks: {
    flex: 1,
    flexDirection: 'row',
    marginTop: spacing.default,
    marginBottom: spacing.default,
    justifyContent: 'center'
  },
  textHighlight: {
    color: theme === UserTheme.dark ? colors.white : colors.black,
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
    backgroundColor: theme === UserTheme.dark ? colors.black : colors.grayLightest,
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
    textAlign: 'center'
  },
  card: {
    padding: spacing.default,
    alignItems: 'center',
    borderRadius: layout.borderRadius.small,
    backgroundColor: theme === UserTheme.dark ? colors.gray900 : colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.05,
    shadowRadius: (Platform.OS === 'ios') ? 5 : 10,
    elevation: 4,
    marginBottom: spacing.default,
    marginTop: spacing.default
  },
  cardTitle: {
    marginBottom: 12,
    marginTop: 12,
    color: theme === UserTheme.dark ? colors.white : colors.black
  },
  cardPriceContainer: {
    height: 70,
    justifyContent: 'center'
  },
  cardPrice: {
    fontSize: 48,
    letterSpacing: -2,
    color: theme === UserTheme.dark ? colors.white : colors.black
  },
  cardMeta: {
    marginBottom: 8,
    marginTop: 6,
    marginLeft: 4,
    color: theme === UserTheme.dark ? colors.gray400 : colors.gray900
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
    color: theme === UserTheme.dark ? colors.gray400 : colors.gray,
    textAlign: 'center'
  },
  cardFeaturesList: {
    alignItems: 'center',
    paddingTop: spacing.default
  },
  cardFeaturesListItem: {
    marginBottom: 8,
    color: theme === UserTheme.dark ? colors.white : colors.black,
    textAlign: 'center',
  },
  cardFeaturesListItemHighlight: { }
});
