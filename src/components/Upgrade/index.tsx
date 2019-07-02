import React from 'react';
import { View, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
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
  subscriptions?: RNIap.Subscription<string>[];
  subscriptionFeatures: any[];
  activeSubscriptionProductId: string;
  onPressUpgrade(productId: string): void;
  onPressRestore(): void;
  onPressPrivacy(): void;
  onPressTerms(): void;
  onPressCancel(): void;
}

export const Upgrade: React.FC<Props> = React.memo(
  ({
    isLoadingSubscriptionItems,
    isLoadingBuySubscription,
    isLoadingRestorePurchases,
    subscriptions,
    subscriptionFeatures,
    activeSubscriptionProductId,
    onPressUpgrade,
    onPressRestore,
    onPressPrivacy,
    onPressTerms,
    onPressCancel
  }) => {
    const windowWidth = Dimensions.get('window').width;
    const cardMargin = 6;
    const cardFirstMarginLeft = spacing.default * 2;
    const cardLastMarginRight = spacing.default * 2;

    const cardWidth = windowWidth - cardFirstMarginLeft - cardLastMarginRight;
    const snapToInterval = cardWidth + cardMargin * 2;
    const startOffset = snapToInterval;
    const contentOffset = { x: startOffset, y: 0 };
    const scrollEnabled = !isLoadingBuySubscription;

    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ ...styles.container, backgroundColor: colors.appBackground }}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.cardsScrollView}
            pagingEnabled
            snapToInterval={snapToInterval}
            scrollEnabled={scrollEnabled}
            decelerationRate={0}
            contentOffset={contentOffset}
          >
            {subscriptionFeatures &&
              subscriptionFeatures.map((subscriptionFeature, index) => {
                const isFirst = index === 0;
                const isLast = subscriptionFeatures.length === index + 1;

                // Get the subscription data using the productId
                const subscription = subscriptions && subscriptions.find(subscription => subscription.productId === subscriptionFeature.productId);
                const localizedPrice = subscription ? subscription.localizedPrice : subscriptionFeature.price;
                const title = subscription ? subscription.title : subscriptionFeature.title;
                const productId = subscription ? subscription.productId : subscriptionFeature.productId;
                const buttonLabel = productId === 'free' ? 'Cancel to downgrade' : `Upgrade to ${title}`;

                return (
                  <View
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
                        title={activeSubscriptionProductId === productId ? 'Current subscription' : buttonLabel}
                        onPress={() => onPressUpgrade(productId)}
                        disabled={
                          isLoadingSubscriptionItems ||
                          isLoadingBuySubscription ||
                          isLoadingRestorePurchases ||
                          activeSubscriptionProductId === productId ||
                          productId === 'free'
                        }
                        loading={isLoadingSubscriptionItems || isLoadingBuySubscription}
                        loadingProps={{ color: 'black' }}
                      />
                    </View>
                    <View style={styles.cardFeaturesList}>
                      {subscriptionFeature.body.map((featureText: string) => (
                        <Text style={styles.cardFeaturesListItem}>{featureText}</Text>
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
                    Access to our highest quality Premium and Plus voices for easier listening. You can preview these Premium voices in the settings screen.
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
                Payment will be charged to your Apple ID account at the confirmation of purchase. Subscription automatically renews unless it is canceled at
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
                {activeSubscriptionProductId !== 'free' && (
                  <View style={{ marginBottom: 18 }}>
                    <Button
                      type="outline"
                      titleStyle={{ color: colors.red, fontSize: fonts.fontSize.body }}
                      buttonStyle={{ borderColor: colors.red }}
                      onPress={() => onPressCancel()}
                      title="Cancel active subscription?"
                    />
                  </View>
                )}

                <Button
                  title="Already upgraded? Restore purchase"
                  loading={isLoadingRestorePurchases}
                  disabled={isLoadingRestorePurchases}
                  onPress={onPressRestore}
                  titleStyle={{ fontSize: fonts.fontSize.body }}
                  loadingProps={{ color: 'black' }}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
);
