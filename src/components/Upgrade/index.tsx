import getSymbolFromCurrency from 'currency-symbol-map';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Dimensions, Platform, ScrollView, View } from 'react-native';
import { Button } from 'react-native-elements';
import * as RNIap from 'react-native-iap';

import * as Icon from '../Icon';
import { Text } from '../Text';

import styles from './styles';

import colors from '../../constants/colors';
import { SUBSCRIPTION_PRODUCT_ID_FREE, SUBSCRIPTION_PRODUCT_ID_PLUS, SUBSCRIPTION_PRODUCT_ID_PREMIUM, SUBSCRIPTION_PRODUCT_ID_UNLIMITED } from '../../constants/in-app-purchase';
import spacing from '../../constants/spacing';
import { URL_ACCEPTABLE_USE_POLICY, URL_PRIVACY_POLICY, URL_TERMS_OF_USE } from '../../constants/urls';
import { SubscriptionFeatures } from '../../containers/UpgradeContainer';

export interface Props {
  isLoadingSubscriptionItems: boolean;
  isLoadingBuySubscription: boolean;
  isLoadingRestorePurchases: boolean;
  isEligibleForTrial: boolean;
  subscriptions?: Array<RNIap.Subscription<string>>;
  /* tslint:disable-next-line no-any */
  subscriptionFeatures: SubscriptionFeatures;
  activeSubscriptionProductId: string;
  centeredSubscriptionProductId: string;
  onPressUpgrade(productId: string): void;
  onPressRestore(): void;
  onPressOpenUrl(url: string): void;
  onPressCancel(): void;
  isDowngradePaidSubscription(productId: string): boolean;
}

export const Upgrade: React.FC<Props> = React.memo(
  ({
    isLoadingSubscriptionItems,
    isLoadingBuySubscription,
    isLoadingRestorePurchases,
    isEligibleForTrial,
    subscriptions,
    subscriptionFeatures,
    activeSubscriptionProductId,
    centeredSubscriptionProductId,
    onPressUpgrade,
    onPressRestore,
    onPressOpenUrl,
    onPressCancel,
    isDowngradePaidSubscription
  }) => {
    const horizontalScrollViewRef = useRef<ScrollView>(null);

    const windowWidth = Dimensions.get('window').width;
    const cardMargin = 6;
    const cardFirstMarginLeft = spacing.default * 2.75;
    const cardLastMarginRight = spacing.default * 2.75;
    const paymentAccountTitle = (Platform.OS === 'android') ? 'Google Play' : 'Apple ID';

    const cardWidth = windowWidth - cardFirstMarginLeft - cardLastMarginRight;
    const snapToInterval = cardWidth + cardMargin * 2;

    const startOffset = {
      [SUBSCRIPTION_PRODUCT_ID_FREE]: snapToInterval,
      [SUBSCRIPTION_PRODUCT_ID_PREMIUM]: snapToInterval,
      [SUBSCRIPTION_PRODUCT_ID_PLUS]: snapToInterval * 2,
      [SUBSCRIPTION_PRODUCT_ID_UNLIMITED]: snapToInterval * 2,
    };

    // Center the subscription based on centeredSubscriptionProductId
    // Else on activeSubscriptionProductId
    // Else, show free
    const contentOffsetX = centeredSubscriptionProductId ? startOffset[centeredSubscriptionProductId] : activeSubscriptionProductId ? startOffset[activeSubscriptionProductId] : snapToInterval;

    const contentOffset = { x: contentOffsetX, y: 0, animated: false };
    const scrollEnabled = !isLoadingBuySubscription;

    useEffect(() => {
      if (!horizontalScrollViewRef || !horizontalScrollViewRef.current) {
        return;
      }

      // We use a simple scrollTo to center the correct subscription in the ScrollView
      // This is because Android does not support "contentOffset" on the <ScrollView>
      horizontalScrollViewRef.current.scrollTo(contentOffset)

    }, [horizontalScrollViewRef, contentOffset])

    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ ...styles.container, backgroundColor: colors.appBackground }}>
          <ScrollView
            ref={horizontalScrollViewRef}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.cardsScrollView}
            pagingEnabled
            snapToInterval={snapToInterval}
            scrollEnabled={scrollEnabled}
            decelerationRate={0}
          >
            {subscriptionFeatures &&
              Object.keys(subscriptionFeatures).map((subscriptionFeatureProductId, index) => {
                const isFirst = index === 0;
                const isLast = Object.keys(subscriptionFeatures).length === index + 1;

                const subscriptionFeature = subscriptionFeatures[subscriptionFeatureProductId];

                // Get the subscription data using the productId
                const featureSubscription = subscriptions && subscriptions.find(subscription => subscription.productId === subscriptionFeatureProductId);
                const productId = featureSubscription ? featureSubscription.productId : subscriptionFeatureProductId;
                const isAvailableOnService = !!featureSubscription;

                const androidTrialPeriodMapping = {
                  'D': 'day',
                  'W': 'week',
                  'M': 'month',
                  'Y': 'year'
                }

                const iosTrialPeriodMapping = {
                  'DAY': 'day',
                  'WEEK': 'week',
                  'MONTH': 'month',
                  'YEAR': 'year'
                }

                // Get the localized currency, so we can show a localized currency symbol next to our "Free" option
                const localizedCurrency = subscriptions && subscriptions.length && subscriptions[0].currency;
                const currencySymbol = localizedCurrency ? getSymbolFromCurrency(localizedCurrency) : '';
                const localizedPrice = featureSubscription ? featureSubscription.localizedPrice : `${currencySymbol}${subscriptionFeature.price}`;
                const title = subscriptionFeature.title; // Do not use the subscription.title, this appears to be missing on some localizations


                const hasTrialIOS = featureSubscription && featureSubscription.introductoryPricePaymentModeIOS === 'FREETRIAL' && isEligibleForTrial;
                const hasTrialAndroid = featureSubscription && featureSubscription.freeTrialPeriodAndroid && isEligibleForTrial;

                const hasTrial = hasTrialIOS || hasTrialAndroid;

                // const trialPrice = (hasTrial && featureSubscription) ? featureSubscription.introductoryPrice : ''; // €0,00, $0,00
                const trialDurationNumberIOS = (hasTrial && featureSubscription) ? featureSubscription.introductoryPriceNumberOfPeriodsIOS : ''; // 3, 7, 1, 14 etc...
                const trialDurationNumberAndroid = (hasTrial && featureSubscription && featureSubscription.freeTrialPeriodAndroid) ? featureSubscription.freeTrialPeriodAndroid.charAt(1) : ''; // P3D => 3
                const trialDurationNumber = trialDurationNumberIOS || trialDurationNumberAndroid;

                const trialDurationPeriodIOS = (hasTrial && featureSubscription && featureSubscription.introductoryPriceSubscriptionPeriodIOS) ? iosTrialPeriodMapping[featureSubscription.introductoryPriceSubscriptionPeriodIOS] : '';
                const trialDurationPeriodAndroid = (hasTrial && featureSubscription && featureSubscription.freeTrialPeriodAndroid) ? androidTrialPeriodMapping[featureSubscription.freeTrialPeriodAndroid.charAt(2)]  : '';
                const trialDurationPeriod = trialDurationPeriodIOS || trialDurationPeriodAndroid; // day, week, month, year

                const trialButtonTitle = (hasTrial) ? `Start free ${trialDurationNumber}-${trialDurationPeriod} trial` : '';
                const defaultButtonTitle = `Upgrade to ${title}`;
                const freeButtonTitle = `Downgrade to ${title}`;

                const buttonTitleAction = isDowngradePaidSubscription(productId) || productId === SUBSCRIPTION_PRODUCT_ID_FREE ? freeButtonTitle : trialButtonTitle ? trialButtonTitle : defaultButtonTitle;
                const buttonTitle = activeSubscriptionProductId === productId ? 'Current subscription' : buttonTitleAction;

                const isDisabled = isLoadingSubscriptionItems || isLoadingBuySubscription || isLoadingRestorePurchases || activeSubscriptionProductId === productId || !isAvailableOnService;
                const isLoading = isLoadingSubscriptionItems || isLoadingBuySubscription;

                return (
                  <View
                    key={subscriptionFeatureProductId}
                    style={[
                      styles.card,
                      { width: cardWidth, marginLeft: isFirst ? cardFirstMarginLeft : cardMargin, marginRight: isLast ? cardLastMarginRight : cardMargin }
                    ]}
                  >
                    <View>
                      <Text style={styles.cardTitle} preset="title3">{title}</Text>
                    </View>
                    <View style={styles.cardPriceContainer}>
                      {isLoadingSubscriptionItems ? <ActivityIndicator size="large" color={colors.black} /> : <Text style={styles.cardPrice} testID="Upgrade-Text-price" fontWeight="extraBold">{localizedPrice}</Text>}
                    </View>
                    <View>
                      <Text style={styles.cardMeta} preset="footnote">per month</Text>
                    </View>
                    <View style={styles.cardButtonContainer}>
                      <Button
                        title={buttonTitle}
                        onPress={() => onPressUpgrade(productId)}
                        disabled={isDisabled}
                        loading={isLoading}
                        loadingProps={{ color: 'black' }}
                        testID="Upgrade-Button"
                      />
                    </View>
                    <View style={styles.cardFeaturesList}>
                      {subscriptionFeature.body.map((featureText: string, featureBodyIndex: number) => (
                        <Text key={featureBodyIndex} style={styles.cardFeaturesListItem} preset="subhead">
                          {featureText}
                        </Text>
                      ))}
                    </View>
                    {!!subscriptionFeature.footer && (
                      <View style={styles.cardFooter}>
                        <Text style={styles.cardFooterText} preset="subhead">{subscriptionFeature.footer}</Text>
                      </View>
                    )}

                    {(productId !== 'free') && (
                      <View>
                        <Button
                          type="clear"
                          title="Restore purchase"
                          loading={isLoadingRestorePurchases}
                          disabled={isLoadingRestorePurchases}
                          onPress={onPressRestore}
                          loadingProps={{ color: 'black' }}
                        />
                      </View>
                    )}
                  </View>
                );
              })}
          </ScrollView>
          {/* <View style={styles.cardsScrollViewFooter}>
            <View style={{ width: cardWidth, height: 10, backgroundColor: 'red' }} />
          </View> */}

          <View style={styles.featuresContainer}>
            <View style={styles.header}>
              <Text style={styles.headerTitle} preset="title1Emphasized">{'Upgrade to\nPremium or Unlimited'}</Text>

              <View style={styles.feature}>
                <Icon.FontAwesome5 name="gem" size={34} style={styles.featureIcon} />
                <View style={styles.featureContent}>
                  <Text style={styles.title} preset="bodyEmphasized">Higher Quality voices</Text>
                  <Text style={styles.paragraph} preset="subhead">
                    Access to our highest quality Premium voices for easier listening. You can preview these Higher Quality voices in the settings
                    screen.
                  </Text>
                </View>
              </View>

              <View style={styles.feature}>
                <Icon.FontAwesome5 name="assistive-listening-systems" solid size={34} style={styles.featureIcon} />
                <View style={styles.featureContent}>
                  <Text style={styles.title} preset="bodyEmphasized">Voice customization options</Text>
                  <Text style={styles.paragraph} preset="subhead">
                    Choose between a variety of male and female voices with accents like American, British or Australian English.
                  </Text>
                </View>
              </View>

              <View style={styles.feature}>
                <Icon.FontAwesome5 name="clock" size={34} style={styles.featureIcon} />
                <View style={styles.featureContent}>
                  <Text style={styles.title} preset="bodyEmphasized">More listening limits</Text>
                  <Text style={styles.paragraph} preset="subhead">
                    With our Premium and Unlimited subscription you can enjoy higher listening minutes. Unlimited gives you unlimited listening minutes.
                  </Text>
                </View>
              </View>

              <View style={styles.feature}>
                <Icon.FontAwesome5 name="ad" solid size={28} style={styles.featureIcon} />
                <View style={styles.featureContent}>
                  <Text style={styles.title} preset="bodyEmphasized">No advertisements</Text>
                  <Text style={styles.paragraph} preset="subhead">
                    Sponsored content and advertisements helps us continue to provide a free version of Playpost. After upgrading
                    you won’t see any ads, and you’ll be supporting Playpost more directly!
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText} preset="caption2">
                Payment will be charged to your {paymentAccountTitle} account at the confirmation of purchase. Subscription automatically renews unless it is canceled at
                least 24 hours before the end of the current period. Your account will be charged for renewal within 24 hours prior to the end of the current
                period. You can manage and cancel your subscriptions by going to your account settings on the App Store after purchase. Refunds are not
                available for unused portions of a subscription.
              </Text>

              <View style={styles.footerLinks}>
                <Text preset="caption2" style={[styles.footerText, styles.textHighlight]} onPress={() => onPressOpenUrl(URL_PRIVACY_POLICY)}>
                  Privacy Policy
                </Text>
                <Text preset="caption2" style={styles.footerText}> - </Text>
                <Text preset="caption2" style={[styles.footerText, styles.textHighlight]} onPress={() => onPressOpenUrl(URL_TERMS_OF_USE)}>
                  Terms of Use
                </Text>
                <Text preset="caption2" style={styles.footerText}> - </Text>
                <Text preset="caption2" style={[styles.footerText, styles.textHighlight]} onPress={() => onPressOpenUrl(URL_ACCEPTABLE_USE_POLICY)}>
                  Acceptable Use Policy
                </Text>
              </View>
              <View style={{ marginTop: 18 }}>
                <Button
                  title="Already upgraded? Restore purchase"
                  loading={isLoadingRestorePurchases}
                  disabled={isLoadingRestorePurchases}
                  onPress={onPressRestore}
                  loadingProps={{ color: 'black' }}
                />

                {activeSubscriptionProductId !== SUBSCRIPTION_PRODUCT_ID_FREE && (
                  <View style={{ marginTop: 18 }}>
                    <Button
                      type="clear"
                      buttonStyle={{ borderColor: colors.red }}
                      onPress={() => onPressCancel()}
                      title="Cancel active subscription?"
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
);
