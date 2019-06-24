import React from 'react';
import { View, Text, Linking } from 'react-native';
import { Button } from 'react-native-elements';

import * as Icon from '../../components/Icon';

import styles from './styles';
import fonts from '../../constants/fonts';
import { URL_PRIVACY_POLICY, URL_TERMS_OF_USE } from '../../constants/urls';
import { ScrollView } from 'react-native-gesture-handler';

interface Props {
  isLoadingSubscriptionItems: boolean;
  isLoadingBuySubscription: boolean;
  isLoadingRestorePurchases: boolean;
  upgradeButtonTitle: string;
  onPressUpgrade(): void;
  onPressRestore(): void;
}

export const Upgrade: React.FC<Props> = React.memo(({ isLoadingSubscriptionItems, isLoadingBuySubscription, isLoadingRestorePurchases, onPressUpgrade, onPressRestore, upgradeButtonTitle }) => {
  return (

    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.feature}>
            <Icon.FontAwesome5 name="gem" size={28} style={styles.featureIcon} />
            <View style={styles.featureContent}>
              <Text style={styles.title}>Higher quality voices</Text>
              <Text style={styles.paragraph}>Access to our highest quality Premium voices for easier listening. You can preview these Premium voices in the settings screen.</Text>
            </View>
          </View>
          <View style={styles.feature}>
            <Icon.FontAwesome5 name="assistive-listening-systems" solid size={28} style={styles.featureIcon} />
            <View style={styles.featureContent}>
              <Text style={styles.title}>Voice customization options</Text>
              <Text style={styles.paragraph}>Choose between a variety of male and female voices with accents like American, British or Australian English.</Text>
            </View>
          </View>
          <View style={styles.feature}>
            <Icon.FontAwesome5 name="clock" size={28} style={styles.featureIcon} />
            <View style={styles.featureContent}>
              <Text style={styles.title}>Unlimited listening</Text>
              <Text style={styles.paragraph}>No article time limits. Listen to articles longer than 5 minutes.</Text>
            </View>
          </View>
          {/* <View style={styles.feature}>
            <Icon.FontAwesome5 name="headphones-alt" size={28} style={styles.featureIcon} />
            <View style={styles.featureContent}>
              <Text style={styles.title}>Playlist auto-play</Text>
              <Text style={styles.paragraph}>Automatically play the next article in your playlist.</Text>
            </View>
          </View> */}
          <View style={styles.feature}>
            <Icon.FontAwesome5 name="star" solid size={28} style={styles.featureIcon} />
            <View style={styles.featureContent}>
              <Text style={styles.title}>No advertisements</Text>
              <Text style={styles.paragraph}>Sponsored content helps us continue to provide a free version of Playpost. After upgrading to Playpost Premium, you won’t see any ads, and you’ll be supporting Playpost more directly!</Text>
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Payment will be charged to your Apple ID account at the confirmation of purchase. Subscription automatically renews unless it is canceled at least 24 hours before the end of the current period. Your account will be charged for renewal within 24 hours prior to the end of the current period. You can manage and cancel your subscriptions by going to your account settings on the App Store after purchase.</Text>
          <View style={styles.footerLinks}>
            <Text style={[styles.footerText, styles.textHighlight]} onPress={() => Linking.openURL(`${URL_PRIVACY_POLICY}?ref=playpost://upgrade`)}>Privacy Policy</Text>
            <Text> - </Text>
            <Text style={[styles.footerText, styles.textHighlight]} onPress={() => Linking.openURL(`${URL_TERMS_OF_USE}?ref=playpost://upgrade`)}>Terms of Use</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.subscribeContainer}>
        <Button
          title={upgradeButtonTitle}
          onPress={onPressUpgrade}
          loading={isLoadingBuySubscription || isLoadingSubscriptionItems}
          disabled={isLoadingBuySubscription || isLoadingSubscriptionItems}
          disabledStyle={styles.primaryButtonDisabledStyle}
        />
        <Button
          type="clear"
          title="Already upgraded? Restore purchase"
          loading={isLoadingRestorePurchases}
          disabled={isLoadingRestorePurchases}
          onPress={onPressRestore}
          titleStyle={{ fontSize: fonts.fontSize.body }}
        />
      </View>

    </View>
  );
});
