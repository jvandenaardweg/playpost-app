import React from 'react';
import { View, Text, Linking, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import * as RNIap from 'react-native-iap';

import { NetworkContext } from '../../contexts/NetworkProvider';

import * as Icon from '../../components/Icon';
import fonts from '../../constants/fonts';

import { subscriptionProductIds } from '../../billing';

import styles from './styles';
import { URL_PRIVACY_POLICY, URL_TERMS_OF_USE } from '../../constants/urls';
import { ALERT_GENERIC_INTERNET_REQUIRED } from '../../constants/messages';

interface State {
  readonly product: RNIap.Subscription<string> | null;
  readonly receipt: RNIap.ProductPurchase | string;
  readonly isLoadingBuySubscription: boolean;
  readonly isPurchased: boolean;
}

type Props = {
  onClose(): void;
};
export class UpgradeFeatures extends React.PureComponent<Props, State> {

  state = {
    product: {} as RNIap.Subscription<string>,
    receipt: {} as RNIap.ProductPurchase,
    isLoadingBuySubscription: false,
    isPurchased: false
  };

  static contextType = NetworkContext;

  componentDidMount() {
    const { isConnected } = this.context;

    // For now, just close the screen when there's no active internet connection
    // TODO: make more user friendly to show upgrade features when there's no internet connection
    if (!isConnected) {
      this.props.onClose();
      return Alert.alert('Upgrading requires internet', ALERT_GENERIC_INTERNET_REQUIRED);
    }

    this.fetchInAppPurchaseItems();
    this.getSubscriptions();
  }

  // TODO: https://github.com/dooboolab/react-native-iap#ios-purchasing-process-right-way
  // Validate receipt on server

  handleOnPressUpgrade = () => {
    this.buySubscriptionItem(subscriptionProductIds[0]);
    // Alert.alert('Upgrade to Premium', 'This is currently not working in this version of the App. Upgrading to Premium becomes available in later versions.');
  }

  handleOnPressRestore = () => {
    Alert.alert('Restore purchase', 'This is currently not working in this version of the App. Restoring purchases becomes available in later versions.');
  }

  goToNext = () => {
    // this.props.navigation.navigate('Second', {
    //   receipt: this.state.receipt,
    // });
  }

  fetchInAppPurchaseItems = async () => {
    try {
      const result = await RNIap.initConnection();
      await RNIap.consumeAllItems();
      console.log('result', result);
    } catch (err) {
      console.warn(err.code, err.message);
    }
  }

  getSubscriptions = async() => {
    try {
      const products = await RNIap.getSubscriptions(subscriptionProductIds);
      console.log('Products', products);
      this.setState({ product: products[0] });
    } catch (err) {
      console.warn(err.code, err.message);
    }
  }

  buySubscriptionItem = async (sku: string) => {
    return this.setState({ isLoadingBuySubscription: true }, async () => {
      try {
        console.log('buySubscriptionItem: ' + sku);
        const purchase = await RNIap.buySubscription(sku);
        console.info(purchase);

        // TODO: set purchase in state, so our app does not show the purchase button anymore
        // TODO: add purchase check on app load
        this.setState({ receipt: purchase.transactionReceipt }, () => this.props.onClose());
      } catch (err) {
        console.warn(err.code, err.message);
        Alert.alert('Oops!', err.message);
      } finally {
        this.setState({ isLoadingBuySubscription: false });
      }
    });
  }

  /**
   * Method to buy a subscription and validate the receipt on the server
   */
  // buySubscriptionItemTransaction = async (sku: string) => {
  //   await RNIap.clearTransaction(); // add this method at the start of purchase.
  //   const purchase = await RNIap.buyProductWithoutFinishTransaction(productId);
  //   // to something in your server
  //   const { transactionReceipt } = purchase;
  //   sendToServer(transactionReceipt, {
  //     onSuccess: () => {
  //       RNIap.finishTransaction();
  //     },
  //   });
  // }

  getAvailablePurchases = async() => {
    try {
      console.info('Get available purchases (non-consumable or unconsumed consumable)');
      const purchases = await RNIap.getAvailablePurchases();
      console.info('Available purchases :: ', purchases);
      if (purchases && purchases.length > 0) {
        this.setState({
          receipt: purchases[0].transactionReceipt,
        });
      }
    } catch (err) {
      console.warn(err.code, err.message);
      Alert.alert(err.message);
    }
  }

  /**
   * Method to restore any previous purchases
   */
  restorePurchases = async() => {
    try {
      const purchases = await RNIap.getAvailablePurchases();
      purchases.forEach((purchase) => {
        if (subscriptionProductIds.includes(purchase.productId)) {
          this.setState({ isPurchased: true });
        }
      });
      Alert.alert('Restore Successful', 'You successfully restored the subscription!');
    } catch (err) {
      console.warn(err); // standardized err.code and err.message available
      Alert.alert('Oops!', err.message);
    }
  }

  get buttonTitle() {
    const { product } = this.state;
    return `Upgrade for ${product.localizedPrice} per month`;
  }

  get isLoading() {
    const { product } = this.state;
    const { isConnected } = this.context;

    return (isConnected && (!product || !product.localizedPrice));
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.feature}>
            <Icon.FontAwesome5 name="gem" size={28} style={styles.featureIcon} />
            <View style={styles.featureContent}>
              <Text style={styles.title}>Higher quality voices</Text>
              <Text style={styles.paragraph}>Besided the free voices, you can use our highest quality Premium voices. You can preview these Premium voices in the settings screen.</Text>
            </View>
          </View>
          <View style={styles.feature}>
            <Icon.FontAwesome5 name="assistive-listening-systems" solid size={28} style={styles.featureIcon} />
            <View style={styles.featureContent}>
              <Text style={styles.title}>More voice customization options</Text>
              <Text style={styles.paragraph}>Choose between a variety of high quality male and female voices with accents like American, British or Australian English.</Text>
            </View>
          </View>
          <View style={styles.feature}>
            <Icon.FontAwesome5 name="clock" size={28} style={styles.featureIcon} />
            <View style={styles.featureContent}>
              <Text style={styles.title}>Unlimited listening</Text>
              <Text style={styles.paragraph}>No article limits. Listen to articles longer then 5 minutes.</Text>
            </View>
          </View>
          <View style={styles.feature}>
            <Icon.FontAwesome5 name="headphones-alt" size={28} style={styles.featureIcon} />
            <View style={styles.featureContent}>
              <Text style={styles.title}>Playlist auto-play</Text>
              <Text style={styles.paragraph}>Automatically play the next article in your playlist.</Text>
            </View>
          </View>
          <View style={styles.feature}>
            <Icon.FontAwesome5 name="star" solid size={28} style={styles.featureIcon} />
            <View style={styles.featureContent}>
              <Text style={styles.title}>No advertisements</Text>
              <Text style={styles.paragraph}>Sponsored content helps us continue to provide a free version of Playpost. After upgrading to Playpost Premium, you won’t see any ads, and you’ll be supporting Playpost more directly!</Text>
            </View>
          </View>
        </View>

        <View style={styles.subscribeContainer}>
          <Button title={this.buttonTitle} onPress={() => this.handleOnPressUpgrade()} loading={this.isLoading} />
          <Button type="clear" title="Already upgraded? Restore purchase" onPress={() => this.handleOnPressRestore()} titleStyle={{ fontSize: fonts.fontSize.body }} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Payment will be charged to your Apple ID account at the confirmation of purchase. Subscription automatically renews unless it is canceled at least 24 hours before the end of the current period. Your account will be charged for renewal within 24 hours prior to the end of the current period. You can manage and cancel your subscriptions by going to your account settings on the App Store after purchase.</Text>
          <View style={styles.footerLinks}>
            <Text style={[styles.footerText, styles.textHighlight]} onPress={() => Linking.openURL(`${URL_PRIVACY_POLICY}?ref=playpost://upgrade`)}>Privacy Policy</Text>
            <Text> - </Text>
            <Text style={[styles.footerText, styles.textHighlight]} onPress={() => Linking.openURL(`${URL_TERMS_OF_USE}?ref=playpost://upgrade`)}>Terms of Use</Text>
          </View>
        </View>

      </View>
    );
  }
}
