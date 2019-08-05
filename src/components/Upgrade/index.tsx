import getSymbolFromCurrency from 'currency-symbol-map';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Dimensions, Platform, ScrollView, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import * as RNIap from 'react-native-iap';

import * as Icon from '../../components/Icon';

import styles from './styles';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import spacing from '../../constants/spacing';

interface Props {
  isLoadingSubscriptionItems: boolean;
  isLoadingBuySubscription: boolean;
  isLoadingRestorePurchases: boolean;
  isEligibleForTrial: boolean;
  subscriptions?: Array<RNIap.Subscription<string>>;
  /* tslint:disable-next-line no-any */
  subscriptionFeatures: any[];
  activeSubscriptionProductId: string;
  centeredSubscriptionProductId: string;
  onPressUpgrade(productId: string): void;
  onPressRestore(): void;
  onPressPrivacy(): void;
  onPressTerms(): void;
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
    onPressPrivacy,
    onPressTerms,
    onPressCancel,
    isDowngradePaidSubscription
  }) => {
    const horizontalScrollViewRef = useRef<ScrollView>(null);

    const windowWidth = Dimensions.get('window').width;
    const cardMargin = 6;
    const cardFirstMarginLeft = spacing.default * 2;
    const cardLastMarginRight = spacing.default * 2;
    const paymentAccountTitle = (Platform.OS === 'android') ? 'Google Play' : 'Apple ID';

    const cardWidth = windowWidth - cardFirstMarginLeft - cardLastMarginRight;
    const snapToInterval = cardWidth + cardMargin * 2;

    const startOffset = {
      free: snapToInterval,
      'com.aardwegmedia.playpost.premium': snapToInterval,
      'com.aardwegmedia.playpost.subscription.plus': snapToInterval * 2
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
              subscriptionFeatures.map((subscriptionFeature, index) => {
                const isFirst = index === 0;
                const isLast = subscriptionFeatures.length === index + 1;

                // Get the subscription data using the productId
                const featureSubscription = subscriptions && subscriptions.find(subscription => subscription.productId === subscriptionFeature.productId);
                const productId = featureSubscription ? featureSubscription.productId : subscriptionFeature.productId;

                // Get the localized currency, so we can show a localized currency symbol next to our "Free" option
                const localizedCurrency = subscriptions && subscriptions.length && subscriptions[0].currency;
                const currencySymbol = localizedCurrency ? getSymbolFromCurrency(localizedCurrency) : '';
                const localizedPrice = featureSubscription ? featureSubscription.localizedPrice : `${currencySymbol}${subscriptionFeature.price}`;
                const title = subscriptionFeature.title; // Do not use the subscription.title, this appears to be missing on some localizations


                const hasTrial = featureSubscription && featureSubscription.introductoryPricePaymentModeIOS === 'FREETRIAL' && isEligibleForTrial;
                // const trialPrice = (hasTrial && featureSubscription) ? featureSubscription.introductoryPrice : ''; // €0,00, $0,00
                const trialDurationNumber = (hasTrial && featureSubscription) ? featureSubscription.introductoryPriceNumberOfPeriodsIOS : ''; // 3, 7, 1, 14 etc...
                const trialDurationPeriod = (hasTrial && featureSubscription) ? featureSubscription.introductoryPriceSubscriptionPeriodIOS : ''; // DAY, WEEK, MONTH, YEAR
                const trialDurationPeriodLowercased = (trialDurationPeriod) ? trialDurationPeriod.toLowerCase() : ''; // day, week, month, year

                const trialButtonTitle = (hasTrial) ? `Start free ${trialDurationNumber}-${trialDurationPeriodLowercased} trial` : '';
                const defaultButtonTitle = `Upgrade to ${title}`;
                const freeButtonTitle = `Downgrade to ${title}`;

                const buttonTitleAction = isDowngradePaidSubscription(productId) || productId === 'free' ? freeButtonTitle : trialButtonTitle ? trialButtonTitle : defaultButtonTitle;
                const buttonTitle = activeSubscriptionProductId === productId ? 'Current subscription' : buttonTitleAction;

                const isDisabled = isLoadingSubscriptionItems || isLoadingBuySubscription || isLoadingRestorePurchases || activeSubscriptionProductId === productId;
                const isLoading = isLoadingSubscriptionItems || isLoadingBuySubscription;

                return (
                  <View
                    key={subscriptionFeature.productId}
                    style={[
                      styles.card,
                      { width: cardWidth, marginLeft: isFirst ? cardFirstMarginLeft : cardMargin, marginRight: isLast ? cardLastMarginRight : cardMargin }
                    ]}
                  >
                    <View>
                      <Text style={styles.cardTitle}>{title}</Text>
                    </View>
                    <View style={styles.cardPriceContainer}>
                      {isLoadingSubscriptionItems ? <ActivityIndicator size="large" color="black" /> : <Text style={styles.cardPrice}>{localizedPrice}</Text>}
                    </View>
                    <View>
                      <Text style={styles.cardMeta}>per month</Text>
                    </View>
                    <View style={styles.cardButtonContainer}>
                      <Button
                        title={buttonTitle}
                        onPress={() => onPressUpgrade(productId)}
                        disabled={isDisabled }
                        loading={isLoading}
                        loadingProps={{ color: 'black' }}
                      />
                    </View>
                    <View style={styles.cardFeaturesList}>
                      {subscriptionFeature.body.map((featureText: string, featureBodyIndex: number) => (
                        <Text key={featureBodyIndex} style={styles.cardFeaturesListItem}>
                          {featureText}
                        </Text>
                      ))}
                    </View>
                    <View style={styles.cardFooter}>
                      <Text style={styles.cardFooterText}>{subscriptionFeature.footer}</Text>
                    </View>
                    <View>
                      <Button
                        type="clear"
                        title="Restore purchase"
                        loading={isLoadingRestorePurchases}
                        disabled={isLoadingRestorePurchases}
                        onPress={onPressRestore}
                        titleStyle={{ fontSize: fonts.fontSize.body }}
                        loadingProps={{ color: 'black' }}
                      />
                    </View>
                  </View>
                );
              })}
          </ScrollView>
          {/* <View style={styles.cardsScrollViewFooter}>
            <View style={{ width: cardWidth, height: 10, backgroundColor: 'red' }} />
          </View> */}

          <View style={styles.featuresContainer}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Upgrade to Premium or Plus</Text>

              <View style={styles.feature}>
                <Icon.FontAwesome5 name="gem" size={34} style={styles.featureIcon} />
                <View style={styles.featureContent}>
                  <Text style={styles.title}>Higher Quality voices</Text>
                  <Text style={styles.paragraph}>
                    Access to our highest quality Premium and Plus voices for easier listening. You can preview these Higher Quality voices in the settings
                    screen.
                  </Text>
                </View>
              </View>

              <View style={styles.feature}>
                <Icon.FontAwesome5 name="assistive-listening-systems" solid size={34} style={styles.featureIcon} />
                <View style={styles.featureContent}>
                  <Text style={styles.title}>Voice customization options</Text>
                  <Text style={styles.paragraph}>
                    Choose between a variety of male and female voices with accents like American, British or Australian English.
                  </Text>
                </View>
              </View>

              <View style={styles.feature}>
                <Icon.FontAwesome5 name="clock" size={34} style={styles.featureIcon} />
                <View style={styles.featureContent}>
                  <Text style={styles.title}>Higher article limits</Text>
                  <Text style={styles.paragraph}>
                    99.9% of the articles on the internet are within the limitations of our Premium and Plus subscription. So you'll probably never hit that
                    limit!
                  </Text>
                </View>
              </View>

              <View style={styles.feature}>
                <Icon.FontAwesome5 name="ad" solid size={28} style={styles.featureIcon} />
                <View style={styles.featureContent}>
                  <Text style={styles.title}>No advertisements</Text>
                  <Text style={styles.paragraph}>
                    Sponsored content and advertisements helps us continue to provide a free version of Playpost. After upgrading to Playpost Premium or Plus,
                    you won’t see any ads, and you’ll be supporting Playpost more directly!
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Payment will be charged to your {paymentAccountTitle} account at the confirmation of purchase. Subscription automatically renews unless it is canceled at
                least 24 hours before the end of the current period. Your account will be charged for renewal within 24 hours prior to the end of the current
                period. You can manage and cancel your subscriptions by going to your account settings on the App Store after purchase. Refunds are not
                available for unused portions of a subscription.
              </Text>

              <View style={styles.footerLinks}>
                <Text style={[styles.footerText, styles.textHighlight]} onPress={() => onPressPrivacy()}>
                  Privacy Policy
                </Text>
                <Text style={styles.footerText}> - </Text>
                <Text style={[styles.footerText, styles.textHighlight]} onPress={() => onPressTerms()}>
                  Terms of Use
                </Text>
              </View>
              <View style={{ marginTop: 18 }}>
                <Button
                  title="Already upgraded? Restore purchase"
                  loading={isLoadingRestorePurchases}
                  disabled={isLoadingRestorePurchases}
                  onPress={onPressRestore}
                  titleStyle={{ fontSize: fonts.fontSize.body }}
                  loadingProps={{ color: 'black' }}
                />

                {activeSubscriptionProductId !== 'free' && (
                  <View style={{ marginTop: 18 }}>
                    <Button
                      type="clear"
                      titleStyle={{ color: colors.red, fontSize: fonts.fontSize.body }}
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
