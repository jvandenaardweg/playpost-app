import React from 'react';
import { View, Text, Linking, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';

import styles from './styles';

export class UpgradeFeatures extends React.PureComponent {

  handleOnPressUpgrade = () => {
    Alert.alert('Upgrade to Pro', 'This is currently not working in this version of the App. Upgrading to Pro becomes available in later versions.');
  }

  handleOnPressRestore = () => {
    Alert.alert('Restore purchase', 'This is currently not working in this version of the App. Restoring purchases becomes available in later versions.');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Upgrade for premium features</Text>

          <View style={styles.feature}>
            <Icon name="gem" size={32} style={styles.featureIcon} />
            <View style={styles.featureContent}>
              <Text style={styles.title}>Higher quality voices</Text>
              <Text style={styles.paragraph}>For our pro users we have even higher quality voices that sound more life-like.</Text>
            </View>
          </View>
          <View style={styles.feature}>
            <Icon name="assistive-listening-systems" solid size={32} style={styles.featureIcon} />
            <View style={styles.featureContent}>
              <Text style={styles.title}>Voice customization</Text>
              <Text style={styles.paragraph}>Choose between a variety of high quality male and female voices with accents like American, British or Australian English.</Text>
            </View>
          </View>
          <View style={styles.feature}>
            <Icon name="clock" size={32} style={styles.featureIcon} />
            <View style={styles.featureContent}>
              <Text style={styles.title}>Unlimited listening</Text>
              <Text style={styles.paragraph}>No article limits. Listen to articles longer then 10 minutes.</Text>
            </View>
          </View>
        </View>

        <View style={styles.subscribeContainer}>
          <Button title="Upgrade for €9,99 per month" onPress={() => this.handleOnPressUpgrade()} />
          <Button type="clear" title="Already upgraded? Restore purchase" onPress={() => this.handleOnPressRestore()} titleStyle={{ fontSize: 14 }} />
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Payment will be charged to your Apple ID account at the confirmation of purchase. Subscription automatically renews unless it is canceled at least 24 hours before the end of the current period. Your account will be charged for renewal within 24 hours prior to the end of the current period. You can manage and cancel your subscriptions by going to your account settings on the App Store after purchase.</Text>
          <View style={styles.footerLinks}>
            <Text style={[styles.footerText, styles.textHighlight]} onPress={() => Linking.openURL('https://playpost.app/privacy-policy?ref=playpost://upgrade')}>Privacy Policy</Text>
            <Text> - </Text>
            <Text style={[styles.footerText, styles.textHighlight]} onPress={() => Linking.openURL('https://playpost.app/terms-of-use?ref=playpost://upgrade')}>Terms of Use</Text>
          </View>
        </View>
      </View>
    );
  }
}
