import React from 'react';
// import { render, RenderAPI, fireEvent } from 'react-native-testing-library';
import renderer from 'react-test-renderer';

import { Props, UpgradeContainerComponent } from '../UpgradeContainer';

jest.mock('../../navigation/NavigationService');

import mockApplePurchases from '../../../tests/__mocks__/apple-purchases';
import mockInAppSubscriptionApple from '../../../tests/__mocks__/in-app-subscription-apple';
import mockInAppSubscriptionGoogle from '../../../tests/__mocks__/in-app-subscription-google';
import mockSubscriptions from '../../../tests/__mocks__/subscriptions';

import { SUBSCRIPTION_PRODUCT_ID_FREE, SUBSCRIPTION_PRODUCT_ID_PREMIUM } from '../../constants/in-app-purchase';
import { ALERT_SUBSCRIPTION_RESTORE_PLATFORM_ANDROID, ALERT_SUBSCRIPTION_RESTORE_PLATFORM_IOS, ALERT_SUBSCRIPTION_UPGRADE_PLATFORM_ANDROID, ALERT_SUBSCRIPTION_UPGRADE_PLATFORM_IOS, ALERT_TITLE_ERROR } from '../../constants/messages';

const getInAppSubscriptionsHandler = jest.fn();
const getUserHandler = jest.fn();
const navigateHandler = jest.fn();
const navigationGetParamHandler = jest.fn();
const navigationGoBackHandler = jest.fn();
const setIsLoadingUpgradeHandler = jest.fn();
const setIsLoadingRestoreHandler = jest.fn();
const setLocalPurchaseHistoryHandler = jest.fn();

const defaultProps: Props = {
  subscriptionsError: '',
  validationResult: null,
  activeSubscriptionProductId: '',
  centeredSubscriptionProductId: '',
  userDetails: null,
  totalAvailableVoices: 10,
  isSubscribed: false,
  userIsEligibleForTrial: false,
  isLoadingUpgrade: false,
  isLoadingRestore: false,
  activeInAppSubscription: null,
  totalAvailableUnsubscribedVoices: 28,
  availableInAppSubscriptions: [],
  getInAppSubscriptions: getInAppSubscriptionsHandler,
  getUser: getUserHandler,
  setIsLoadingUpgrade: setIsLoadingUpgradeHandler,
  setIsLoadingRestore: setIsLoadingRestoreHandler,
  setLocalPurchaseHistory: setLocalPurchaseHistoryHandler,

  navigation: {
    navigate: navigateHandler,
    getParam: navigationGetParamHandler,
    goBack: navigationGoBackHandler,
  } as any
};

describe('UpgradeContainerComponent', () => {

  describe('rendering', () => {
    let wrapper: renderer.ReactTestRenderer;

    beforeEach(() => {
      const props = {
        ...defaultProps
      }

      wrapper = renderer.create(<UpgradeContainerComponent {...props} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });

  describe('interacting', () => {
    let wrapper: renderer.ReactTestRenderer;

    afterEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    beforeEach(() => {
      const props = {
        ...defaultProps
      }

      wrapper = renderer.create(<UpgradeContainerComponent {...props} />);
    });

    it('handleOnPressUpgrade() should correctly handle an downgrade to free', async () => {
      const testProductId = SUBSCRIPTION_PRODUCT_ID_FREE;
      const testInstance = wrapper.root.instance;

      const spySubscriptionAlert = jest.spyOn(testInstance, 'showManageSubscriptionAlert');

      // User is not downgrading from a paid subscription
      testInstance.isDowngradePaidSubscription = jest.fn().mockReturnValue(false)

      // User is downgrading to a free subscription
      testInstance.isDowngradeFreeSubscription = jest.fn().mockReturnValue(true)

      await testInstance.handleOnPressUpgrade(testProductId);

      expect(spySubscriptionAlert).toHaveBeenCalledTimes(1);
      expect(spySubscriptionAlert).toHaveBeenCalledWith(
        'Downgrade to Free?',
        'To downgrade to Free you need to cancel your current subscription. Cancelling a subscription can only be done through iTunes.\n\n Press \"Manage Subscriptions\" below to manage your subscriptions.');
    });

    it('handleOnPressUpgrade() should correctly handle an downgrade from a higher subscription', async () => {
      const testProductId = SUBSCRIPTION_PRODUCT_ID_PREMIUM;
      const testInstance = wrapper.root.instance;

      const spySubscriptionAlert = jest.spyOn(testInstance, 'showManageSubscriptionAlert');

      // User is downgrading from a paid subscription to free
      testInstance.isDowngradePaidSubscription = jest.fn().mockReturnValue(true)

      // User is not downgrading to a free subscription
      testInstance.isDowngradeFreeSubscription = jest.fn().mockReturnValue(false)

      await testInstance.handleOnPressUpgrade(testProductId);

      expect(spySubscriptionAlert).toHaveBeenCalledTimes(1);
      expect(spySubscriptionAlert).toHaveBeenCalledWith(
        'Downgrading Subscription?',
        'Downgrading a subscription can only be done through iTunes.\n\n Press "Manage Subscriptions" below to manage your subscriptions.');
    });

    it('handleOnPressUpgrade() should correctly handle an upgrade', async () => {
      const testProductId = SUBSCRIPTION_PRODUCT_ID_PREMIUM;

      const testInstance = wrapper.root.instance;

      const spySubscriptionAlert = jest.spyOn(testInstance, 'showManageSubscriptionAlert');
      const spyRequestSubscription = jest.spyOn(testInstance, 'requestSubscription');
      const spySetIsLoadingUpgrade = jest.spyOn(testInstance.props, 'setIsLoadingUpgrade');

      // User is not downgrading from a paid subscription
      testInstance.isDowngradePaidSubscription = jest.fn().mockReturnValue(false)

      // User is not downgrading to a free subscription
      testInstance.isDowngradeFreeSubscription = jest.fn().mockReturnValue(false)

      // Test an upgrade to a higher subscription level
      await testInstance.handleOnPressUpgrade(testProductId);

      expect(spySubscriptionAlert).toHaveBeenCalledTimes(0);
      expect(spyRequestSubscription).toHaveBeenCalledTimes(1);
      expect(spySetIsLoadingUpgrade).toHaveBeenCalledTimes(1);
      expect(spySetIsLoadingUpgrade).toHaveBeenCalledWith(true);
      expect(spyRequestSubscription).toHaveBeenCalledWith(testProductId, '', '');
      expect(testInstance.state.centeredSubscriptionProductId).toBe(testProductId);

    });

    it('handleOnPressUpgrade() should correctly handle an error on an upgrade', async () => {
      const testProductId = SUBSCRIPTION_PRODUCT_ID_PREMIUM;

      const testInstance = wrapper.root.instance;

      const spyRequestSubscription = jest.spyOn(testInstance, 'requestSubscription').mockRejectedValueOnce(new Error('Some error!'));
      const spyShowErrorAlert = jest.spyOn(testInstance, 'showErrorAlert');
      const spySetIsLoadingUpgrade = jest.spyOn(testInstance.props, 'setIsLoadingUpgrade');

      // User is not downgrading from a paid subscription
      testInstance.isDowngradePaidSubscription = jest.fn().mockReturnValue(false)

      // User is not downgrading to a free subscription
      testInstance.isDowngradeFreeSubscription = jest.fn().mockReturnValue(false)

      // Test an upgrade to a higher subscription level
      await testInstance.handleOnPressUpgrade(testProductId);

      expect(spyRequestSubscription).toHaveBeenCalledTimes(1);
      expect(spySetIsLoadingUpgrade).toHaveBeenCalledTimes(2);
      expect(spySetIsLoadingUpgrade).toHaveBeenLastCalledWith(false);
      expect(spyRequestSubscription).toHaveBeenCalledWith(testProductId, '', '');
      expect(spyShowErrorAlert).toHaveBeenCalledTimes(0); // The error is handled in SubscriptionHandlerContainer

    });

    it('handleOnPressUpgrade() should prevent the user from upgrading if the user is on iOS but has an Google Play subscription active', async () => {
      const Platform = require('react-native').Platform;
      Platform.OS = 'ios';

      const props = {
        ...defaultProps,
        activeInAppSubscription: mockInAppSubscriptionGoogle
      }

      wrapper.update(<UpgradeContainerComponent {...props} />)

      const testInstance = wrapper.root.instance;

      const spyShowErrorAlert = jest.spyOn(testInstance, 'showErrorAlert').mockReturnValueOnce('');

      const testProductId = SUBSCRIPTION_PRODUCT_ID_PREMIUM;

      const spyRequestSubscription = jest.spyOn(testInstance, 'requestSubscription');

      // Test an upgrade to a higher subscription level
      await testInstance.handleOnPressUpgrade(testProductId);

      expect(spyRequestSubscription).toHaveBeenCalledTimes(0);
      expect(spyShowErrorAlert).toHaveBeenCalledTimes(1);
      expect(spyShowErrorAlert).toHaveBeenCalledWith(ALERT_TITLE_ERROR, ALERT_SUBSCRIPTION_UPGRADE_PLATFORM_ANDROID);

    });

    it('handleOnPressUpgrade() should prevent the user from upgrading if the user is on Android but has an Apple App Store subscription active', async () => {
      const Platform = require('react-native').Platform;
      Platform.OS = 'android';

      const props = {
        ...defaultProps,
        activeInAppSubscription: mockInAppSubscriptionApple
      }

      wrapper.update(<UpgradeContainerComponent {...props} />)

      const testInstance = wrapper.root.instance;

      const spyShowErrorAlert = jest.spyOn(testInstance, 'showErrorAlert').mockReturnValueOnce('');

      const testProductId = SUBSCRIPTION_PRODUCT_ID_PREMIUM;

      const spyRequestSubscription = jest.spyOn(testInstance, 'requestSubscription');

      // Test an upgrade to a higher subscription level
      await testInstance.handleOnPressUpgrade(testProductId);

      expect(spyRequestSubscription).toHaveBeenCalledTimes(0);
      expect(spyShowErrorAlert).toHaveBeenCalledTimes(1);
      expect(spyShowErrorAlert).toHaveBeenCalledWith(ALERT_TITLE_ERROR, ALERT_SUBSCRIPTION_UPGRADE_PLATFORM_IOS);

    });

    it('getLatestPurchase() should return the latest purchase from the array', () => {
      const testInstance = wrapper.root.instance;

      expect(testInstance.getLatestPurchase(mockApplePurchases)).toMatchObject(mockApplePurchases[0]);
    })

    it('isDowngradeFreeSubscription() should return true/false', () => {
      const props = {
        ...defaultProps,
        activeSubscriptionProductId: SUBSCRIPTION_PRODUCT_ID_FREE,
        subscriptions: mockSubscriptions
      }

      wrapper.update(<UpgradeContainerComponent {...props} />)
      const testInstance = wrapper.root.instance;

      expect(testInstance.isDowngradeFreeSubscription(SUBSCRIPTION_PRODUCT_ID_FREE)).toBe(false)
      expect(testInstance.isDowngradeFreeSubscription(SUBSCRIPTION_PRODUCT_ID_PREMIUM)).toBe(false)
      expect(testInstance.isDowngradeFreeSubscription('com.aardwegmedia.playpost.subscriptions.plus')).toBe(false)
    })

    it('isDowngradePaidSubscription() should return true/false', () => {
      const props = {
        ...defaultProps,
        activeSubscriptionProductId: 'com.aardwegmedia.playpost.subscriptions.plus',
        subscriptions: mockSubscriptions
      }

      wrapper.update(<UpgradeContainerComponent {...props} />)
      const testInstance = wrapper.root.instance;

      expect(testInstance.isDowngradePaidSubscription(SUBSCRIPTION_PRODUCT_ID_FREE)).toBe(false)
      expect(testInstance.isDowngradePaidSubscription(SUBSCRIPTION_PRODUCT_ID_PREMIUM)).toBe(false)
    })

    it('handleOnPressRestore() should correctly handle when a user has previous purchases', async () => {
      const testInstance = wrapper.root.instance;

      const spyGetAvailablePurchases = jest.spyOn(testInstance, 'getAvailablePurchases').mockReturnValueOnce(mockApplePurchases)
      const spyGetLatestPurchase = jest.spyOn(testInstance, 'getLatestPurchase').mockReturnValueOnce(mockApplePurchases[0]);
      const spyShowErrorAlert = jest.spyOn(testInstance, 'showErrorAlert');
      const spySetIsLoadingRestore = jest.spyOn(testInstance.props, 'setIsLoadingRestore');
      const spyGetUser = jest.spyOn(testInstance.props, 'getUser');
      // const spyValidateSubscriptionReceipt = jest.spyOn(testInstance.props, 'validateSubscriptionReceipt');


      // Simulate a click on "Restore previous purchase"
      await testInstance.handleOnPressRestore();

      expect(spySetIsLoadingRestore).toHaveBeenCalledTimes(2);
      expect(spySetIsLoadingRestore).toHaveBeenNthCalledWith(1, true);
      expect(spySetIsLoadingRestore).toHaveBeenNthCalledWith(2, false);

      expect(spyGetAvailablePurchases).toHaveBeenCalledTimes(1);
      expect(spyGetAvailablePurchases).toHaveReturnedWith(mockApplePurchases)

      expect(spyShowErrorAlert).toHaveBeenCalledTimes(0);

      expect(spyGetUser).toHaveBeenCalledTimes(1);

      expect(spyGetLatestPurchase).toHaveBeenCalledTimes(1);
      expect(spyGetLatestPurchase).toHaveReturnedWith(mockApplePurchases[0]);

      // expect(spyValidateSubscriptionReceipt).toHaveBeenCalledTimes(1);
      // expect(spyValidateSubscriptionReceipt).toHaveBeenCalledWith(mockApplePurchases[0].productId, mockApplePurchases[0].transactionReceipt, 'ios');
    });

    it('handleOnPressRestore() should correctly handle when a user has no previous purchases', async () => {
      const testInstance = wrapper.root.instance;

      const spyGetAvailablePurchases = jest.spyOn(testInstance, 'getAvailablePurchases').mockReturnValueOnce([]);
      const spyShowErrorAlert = jest.spyOn(testInstance, 'showErrorAlert');
      const spySetIsLoadingRestore = jest.spyOn(testInstance.props, 'setIsLoadingRestore');

      // Simulate a click on "Restore previous purchase"
      await testInstance.handleOnPressRestore();

      expect(spySetIsLoadingRestore).toHaveBeenCalledTimes(2);
      expect(spySetIsLoadingRestore).toHaveBeenLastCalledWith(false);

      expect(spyGetAvailablePurchases).toHaveBeenCalledTimes(1);
      expect(spyGetAvailablePurchases).toHaveReturnedWith([])

      expect(spyShowErrorAlert).toHaveBeenCalledTimes(1);
      expect(spyShowErrorAlert).toHaveBeenCalledWith('Nothing to restore', `We could not find any previous purchase to restore. If you think this is incorrect, please contact our support.`);

    });

    it('handleOnPressRestore() should show an error alert when an error throws inside', async () => {
      const testInstance = wrapper.root.instance;

      jest.spyOn(testInstance, 'getAvailablePurchases').mockRejectedValueOnce(new Error('Some error!'));
      const spyShowErrorAlert = jest.spyOn(testInstance, 'showErrorAlert');
      const spySetIsLoadingRestore = jest.spyOn(testInstance.props, 'setIsLoadingRestore');

      // Simulate a click on "Restore previous purchase"
      await testInstance.handleOnPressRestore();

      expect(spySetIsLoadingRestore).toHaveBeenCalledTimes(2);
      expect(spySetIsLoadingRestore).toHaveBeenLastCalledWith(false);

      expect(spyShowErrorAlert).toHaveBeenCalledTimes(1);
      expect(spyShowErrorAlert).toHaveBeenCalledWith('Restore purchase error', `Some error!`);

    });

    it('handleOnPressRestore() should show an error alert when the active subscription is from the Google Play Store, but the platform is iOS', async () => {
      const Platform = require('react-native').Platform;
      Platform.OS = 'ios';

      const props = {
        ...defaultProps,
        activeInAppSubscription: mockInAppSubscriptionGoogle
      }

      wrapper.update(<UpgradeContainerComponent {...props} />)

      const testInstance = wrapper.root.instance;

      const spyShowErrorAlert = jest.spyOn(testInstance, 'showErrorAlert').mockReturnValueOnce('');

      // Simulate a click on "Restore previous purchase"
      await testInstance.handleOnPressRestore();

      expect(spyShowErrorAlert).toHaveBeenCalledTimes(1);
      expect(spyShowErrorAlert).toHaveBeenCalledWith(ALERT_TITLE_ERROR, ALERT_SUBSCRIPTION_RESTORE_PLATFORM_IOS);

    });

    it('handleOnPressRestore() should show an error alert when the active subscription is from the Apple App Store, but the platform is Android', async () => {
      const Platform = require('react-native').Platform;
      Platform.OS = 'android';

      const props = {
        ...defaultProps,
        activeInAppSubscription: mockInAppSubscriptionApple
      }

      wrapper.update(<UpgradeContainerComponent {...props} />)

      const testInstance = wrapper.root.instance;

      const spyShowErrorAlert = jest.spyOn(testInstance, 'showErrorAlert').mockReturnValueOnce('');

      // Simulate a click on "Restore previous purchase"
      await testInstance.handleOnPressRestore();

      expect(spyShowErrorAlert).toHaveBeenCalledTimes(1);
      expect(spyShowErrorAlert).toHaveBeenCalledWith(ALERT_TITLE_ERROR, ALERT_SUBSCRIPTION_RESTORE_PLATFORM_ANDROID);

    });
  });
});
