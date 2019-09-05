import React from 'react';
import { fireEvent, render, RenderAPI } from 'react-native-testing-library';

import { SUBSCRIPTION_PRODUCT_ID_FREE, SUBSCRIPTION_PRODUCT_ID_FREE_ANDROID, SUBSCRIPTION_PRODUCT_ID_FREE_APPLE, SUBSCRIPTION_PRODUCT_ID_PLUS, SUBSCRIPTION_PRODUCT_ID_PLUS_ANDROID, SUBSCRIPTION_PRODUCT_ID_PLUS_APPLE, SUBSCRIPTION_PRODUCT_ID_PREMIUM, SUBSCRIPTION_PRODUCT_ID_PREMIUM_ANDROID, SUBSCRIPTION_PRODUCT_ID_PREMIUM_APPLE } from '../../../constants/in-app-purchase';
import { Upgrade } from '../index';

import mockSubscriptionsAndroid from '../../../../tests/__mocks__/react-native-iap/subscriptions-android';
import mockSubscriptionsIOS from '../../../../tests/__mocks__/react-native-iap/subscriptions-ios';

const subscriptionFeaturesIOS = [
  {
    productId: SUBSCRIPTION_PRODUCT_ID_FREE,
    title: 'Free',
    price: '0',
    body: ['Basic quality voices', 'One voice option per language', 'Max. 30 minutes per month', 'Unlimited playlist items', 'Some advertisements'],
    footer: 'About 5 articles to audio, per month'
  },
  {
    productId: SUBSCRIPTION_PRODUCT_ID_PREMIUM,
    title: 'Premium',
    price: null,
    body: [`10+ High Quality voices`, 'Multiple voice options per language', 'Max. 120 minutes per month', 'Unlimited playlist items', 'No advertisements'],
    footer: 'About 25 articles to audio, per month'
  },
  {
    productId: SUBSCRIPTION_PRODUCT_ID_PLUS,
    title: 'Plus',
    price: null,
    body: [`10+ High Quality voices`, 'Multiple voice options per language', 'Max. 300 minutes per month', 'Unlimited playlist items', 'No advertisements'],
    footer: 'About 65 articles to audio, per month'
  }
]

const subscriptionFeaturesAndroid = [
  {
    productId: SUBSCRIPTION_PRODUCT_ID_FREE_ANDROID,
    title: 'Free',
    price: '0',
    body: ['Basic quality voices', 'One voice option per language', 'Max. 30 minutes per month', 'Unlimited playlist items', 'Some advertisements'],
    footer: 'About 5 articles to audio, per month'
  },
  {
    productId: SUBSCRIPTION_PRODUCT_ID_PREMIUM_ANDROID,
    title: 'Premium',
    price: null,
    body: [`10+ High Quality voices`, 'Multiple voice options per language', 'Max. 120 minutes per month', 'Unlimited playlist items', 'No advertisements'],
    footer: 'About 25 articles to audio, per month'
  },
  {
    productId: SUBSCRIPTION_PRODUCT_ID_PLUS_ANDROID,
    title: 'Plus',
    price: null,
    body: [`10+ High Quality voices`, 'Multiple voice options per language', 'Max. 300 minutes per month', 'Unlimited playlist items', 'No advertisements'],
    footer: 'About 65 articles to audio, per month'
  }
]

const onPressUpgradeHandler = jest.fn();
const onPressRestoreHandler = jest.fn();
const onPressPrivacyHandler = jest.fn();
const onPressTermsHandler = jest.fn();
const onPressCancelHandler = jest.fn();
const isDowngradePaidSubscriptionHandler = jest.fn();

// TODO: use Prop type when RNIap types are correct
const defaultProps: any = {
  isLoadingSubscriptionItems: false,
  isLoadingBuySubscription: false,
  isLoadingRestorePurchases: false,
  isEligibleForTrial: true,
  subscriptions: mockSubscriptionsIOS,
  activeSubscriptionProductId: SUBSCRIPTION_PRODUCT_ID_FREE,
  centeredSubscriptionProductId: SUBSCRIPTION_PRODUCT_ID_PREMIUM,
  subscriptionFeatures: subscriptionFeaturesIOS,
  onPressUpgrade: onPressUpgradeHandler,
  onPressRestore: onPressRestoreHandler,
  onPressPrivacy: onPressPrivacyHandler,
  onPressTerms: onPressTermsHandler,
  onPressCancel: onPressCancelHandler,
  isDowngradePaidSubscription: isDowngradePaidSubscriptionHandler,
}

describe('Upgrade', () => {
  describe('rendering', () => {
    let wrapper: RenderAPI;

    afterEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    beforeAll(() => {
      const props = {
        ...defaultProps
      }

      wrapper = render(<Upgrade {...props} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render the correct subscription information for iOS', () => {
      const Platform = require('react-native').Platform;
      Platform.OS = 'ios';

      const props = {
        ...defaultProps,
        subscriptions: mockSubscriptionsIOS,
        isLoadingSubscriptionItems: false,
        isEligibleForTrial: true,
        subscriptionFeatures: subscriptionFeaturesIOS
      }

      wrapper.update(<Upgrade {...props} />)

      expect(wrapper.getAllByTestId('Upgrade-Text-price')[0].props.children).toBe('€0');
      expect(wrapper.getAllByTestId('Upgrade-Text-price')[1].props.children).toBe('€ 4,99');
      expect(wrapper.getAllByTestId('Upgrade-Text-price')[2].props.children).toBe('€ 9,99');

      expect(wrapper.getAllByTestId('Upgrade-Button')[0].props.children[0].props.children[2].props.children).toBe('Current subscription'); // free
      expect(wrapper.getAllByTestId('Upgrade-Button')[1].props.children[0].props.children[2].props.children).toBe('Start free 3-day trial'); // premium
      expect(wrapper.getAllByTestId('Upgrade-Button')[2].props.children[0].props.children[2].props.children).toBe('Start free 3-day trial'); // plus

    });

    it('should render the correct subscription information for Android', () => {
      const Platform = require('react-native').Platform;
      Platform.OS = 'android';

      const props = {
        ...defaultProps,
        subscriptions: mockSubscriptionsAndroid,
        isLoadingSubscriptionItems: false,
        isEligibleForTrial: true,
        subscriptionFeatures: subscriptionFeaturesAndroid
      }

      wrapper.update(<Upgrade {...props} />)

      expect(wrapper.getAllByTestId('Upgrade-Text-price')[0].props.children).toBe('€0');
      expect(wrapper.getAllByTestId('Upgrade-Text-price')[1].props.children).toBe('€4.99');
      expect(wrapper.getAllByTestId('Upgrade-Text-price')[2].props.children).toBe('€9.99');

      expect(wrapper.getAllByTestId('Upgrade-Button')[0].props.children[0].props.children[2].props.children).toBe('Current subscription'); // free
      expect(wrapper.getAllByTestId('Upgrade-Button')[1].props.children[0].props.children[2].props.children).toBe('Start free 3-day trial'); // premium
      expect(wrapper.getAllByTestId('Upgrade-Button')[2].props.children[0].props.children[2].props.children).toBe('Start free 3-day trial'); // plus

    });

    it('should render the correct active subscription for iOS', () => {
      const Platform = require('react-native').Platform;
      Platform.OS = 'ios';

      const props = {
        ...defaultProps,
        subscriptions: mockSubscriptionsIOS,
        isLoadingSubscriptionItems: false,
        isEligibleForTrial: false,
        subscriptionFeatures: subscriptionFeaturesIOS,
        activeSubscriptionProductId: SUBSCRIPTION_PRODUCT_ID_PREMIUM_APPLE,
        centeredSubscriptionProductId: SUBSCRIPTION_PRODUCT_ID_PREMIUM_APPLE,
      }

      wrapper.update(<Upgrade {...props} />)

      expect(wrapper.getAllByTestId('Upgrade-Button')[0].props.children[0].props.children[2].props.children).toBe('Downgrade to Free'); // free
      expect(wrapper.getAllByTestId('Upgrade-Button')[1].props.children[0].props.children[2].props.children).toBe('Current subscription'); // premium
      expect(wrapper.getAllByTestId('Upgrade-Button')[2].props.children[0].props.children[2].props.children).toBe('Upgrade to Plus'); // plus

    });

    it('should render the correct active subscription for Android', () => {
      const Platform = require('react-native').Platform;
      Platform.OS = 'android';

      const props = {
        ...defaultProps,
        subscriptions: mockSubscriptionsAndroid,
        isLoadingSubscriptionItems: false,
        isEligibleForTrial: false,
        subscriptionFeatures: subscriptionFeaturesAndroid,
        activeSubscriptionProductId: SUBSCRIPTION_PRODUCT_ID_PREMIUM_ANDROID,
        centeredSubscriptionProductId: SUBSCRIPTION_PRODUCT_ID_PREMIUM_ANDROID,
      }

      wrapper.update(<Upgrade {...props} />)

      expect(wrapper.getAllByTestId('Upgrade-Button')[0].props.children[0].props.children[2].props.children).toBe('Downgrade to Free'); // free
      expect(wrapper.getAllByTestId('Upgrade-Button')[1].props.children[0].props.children[2].props.children).toBe('Current subscription'); // premium
      expect(wrapper.getAllByTestId('Upgrade-Button')[2].props.children[0].props.children[2].props.children).toBe('Upgrade to Plus'); // plus

    });

    it('should fire onPressUpgrade when pressing on the upgrade button on Android', () => {
      const Platform = require('react-native').Platform;
      Platform.OS = 'android';

      const props = {
        ...defaultProps,
        subscriptions: mockSubscriptionsAndroid,
        isLoadingSubscriptionItems: false,
        isEligibleForTrial: false,
        subscriptionFeatures: subscriptionFeaturesAndroid,
        activeSubscriptionProductId: SUBSCRIPTION_PRODUCT_ID_PREMIUM_ANDROID,
        centeredSubscriptionProductId: SUBSCRIPTION_PRODUCT_ID_PREMIUM_ANDROID,
      }

      wrapper.update(<Upgrade {...props} />)

      fireEvent.press(wrapper.getAllByTestId('Upgrade-Button')[0]);
      fireEvent.press(wrapper.getAllByTestId('Upgrade-Button')[1]);
      fireEvent.press(wrapper.getAllByTestId('Upgrade-Button')[2]);

      expect(onPressUpgradeHandler).toHaveBeenCalledTimes(3);
      expect(onPressUpgradeHandler).toHaveBeenNthCalledWith(1, SUBSCRIPTION_PRODUCT_ID_FREE_ANDROID);
      expect(onPressUpgradeHandler).toHaveBeenNthCalledWith(2, SUBSCRIPTION_PRODUCT_ID_PREMIUM_ANDROID);
      expect(onPressUpgradeHandler).toHaveBeenNthCalledWith(3, SUBSCRIPTION_PRODUCT_ID_PLUS_ANDROID);

    });

    it('should fire onPressUpgrade when pressing on the upgrade button on iOS', () => {
      const Platform = require('react-native').Platform;
      Platform.OS = 'ios';

      const props = {
        ...defaultProps,
        subscriptions: mockSubscriptionsIOS,
        isLoadingSubscriptionItems: false,
        isEligibleForTrial: false,
        subscriptionFeatures: subscriptionFeaturesIOS,
        activeSubscriptionProductId: SUBSCRIPTION_PRODUCT_ID_PREMIUM_APPLE,
        centeredSubscriptionProductId: SUBSCRIPTION_PRODUCT_ID_PREMIUM_APPLE,
      }

      wrapper.update(<Upgrade {...props} />)

      fireEvent.press(wrapper.getAllByTestId('Upgrade-Button')[0]);
      fireEvent.press(wrapper.getAllByTestId('Upgrade-Button')[1]);
      fireEvent.press(wrapper.getAllByTestId('Upgrade-Button')[2]);

      expect(onPressUpgradeHandler).toHaveBeenCalledTimes(3);
      expect(onPressUpgradeHandler).toHaveBeenNthCalledWith(1, SUBSCRIPTION_PRODUCT_ID_FREE_APPLE);
      expect(onPressUpgradeHandler).toHaveBeenNthCalledWith(2, SUBSCRIPTION_PRODUCT_ID_PREMIUM_APPLE);
      expect(onPressUpgradeHandler).toHaveBeenNthCalledWith(3, SUBSCRIPTION_PRODUCT_ID_PLUS_APPLE);

    });
  });
});
