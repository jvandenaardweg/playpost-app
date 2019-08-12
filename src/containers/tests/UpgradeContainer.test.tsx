import React from 'react';
// import { render, RenderAPI, fireEvent } from 'react-native-testing-library';
import renderer from 'react-test-renderer';

import { UpgradeContainerComponent } from '../UpgradeContainer';

jest.mock('appcenter-analytics');
jest.mock('react-native-iap');
jest.mock('../../navigation/NavigationService');

import mockApplePurchases from '../../../tests/__mocks__/apple-purchases';
import mockSubscriptions from '../../../tests/__mocks__/subscriptions';
import { ALERT_TITLE_SUBSCRIPTION_UPGRADE_ERROR } from '../../constants/messages';

const validateSubscriptionReceiptHandler = jest.fn();
const getUserHandler = jest.fn();
const navigateHandler = jest.fn();
const navigationGetParamHandler = jest.fn();
const navigationGoBackHandler = jest.fn();
const setIsLoadingUpgradeHandler = jest.fn();
const setIsLoadingRestoreHandler = jest.fn();

const props: any = {
  subscriptionsError: '',
  validationResult: null,
  activeSubscriptionProductId: '',
  userDetails: null,
  totalAvailableVoices: 10,
  validateSubscriptionReceipt: validateSubscriptionReceiptHandler,
  getUser: getUserHandler,
  navigation: {
    navigate: navigateHandler,
    getParam: navigationGetParamHandler,
    goBack: navigationGoBackHandler,
  },
  setIsLoadingUpgrade: setIsLoadingUpgradeHandler,
  setIsLoadingRestore: setIsLoadingRestoreHandler
};

describe('UpgradeContainerComponent', () => {

  describe('rendering', () => {
    let wrapper: renderer.ReactTestRenderer;

    beforeEach(() => {
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
      jest.restoreAllMocks();
    });

    beforeEach(() => {
      wrapper = renderer.create(<UpgradeContainerComponent {...props} />);
    });

    it('should correctly handle handleOnPressUpgrade() on an downgrade to free', async () => {
      const testProductId = 'free';
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

    it('should correctly handle handleOnPressUpgrade() on an downgrade from a higher subscription', async () => {
      const testProductId = 'com.aardwegmedia.playpost.premium';
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

    it('should correctly handle handleOnPressUpgrade() on an upgrade', async () => {
      const testProductId = 'com.aardwegmedia.playpost.premium';

      const testInstance = wrapper.root.instance;

      const spySubscriptionAlert = jest.spyOn(testInstance, 'showManageSubscriptionAlert');
      const spyRequestSubscription = jest.spyOn(testInstance, 'requestSubscription');

      // User is not downgrading from a paid subscription
      testInstance.isDowngradePaidSubscription = jest.fn().mockReturnValue(false)

      // User is not downgrading to a free subscription
      testInstance.isDowngradeFreeSubscription = jest.fn().mockReturnValue(false)

      // Test an upgrade to a higher subscription level
      await testInstance.handleOnPressUpgrade(testProductId);

      expect(spySubscriptionAlert).toHaveBeenCalledTimes(0);
      expect(spyRequestSubscription).toHaveBeenCalledTimes(1);
      expect(setIsLoadingUpgradeHandler).toHaveBeenCalledTimes(1);
      expect(setIsLoadingUpgradeHandler).toHaveBeenCalledWith(true);
      expect(spyRequestSubscription).toHaveBeenCalledWith(testProductId);
      expect(testInstance.state.selectedProductId).toBe(testProductId);

    });

    it('should correctly handle an error inside handleOnPressUpgrade() on an upgrade', async () => {
      const testProductId = 'com.aardwegmedia.playpost.premium';

      const testInstance = wrapper.root.instance;

      const spyRequestSubscription = jest.spyOn(testInstance, 'requestSubscription').mockRejectedValueOnce(new Error('Some error!'));
      const spyShowErrorAlert = jest.spyOn(testInstance, 'showErrorAlert');

      // User is not downgrading from a paid subscription
      testInstance.isDowngradePaidSubscription = jest.fn().mockReturnValue(false)

      // User is not downgrading to a free subscription
      testInstance.isDowngradeFreeSubscription = jest.fn().mockReturnValue(false)

      // Test an upgrade to a higher subscription level
      await testInstance.handleOnPressUpgrade(testProductId);

      expect(spyRequestSubscription).toHaveBeenCalledTimes(1);
      expect(setIsLoadingUpgradeHandler).toHaveBeenCalledTimes(2);
      expect(setIsLoadingUpgradeHandler).toHaveBeenLastCalledWith(false);
      expect(spyRequestSubscription).toHaveBeenCalledWith(testProductId);
      expect(spyShowErrorAlert).toHaveBeenCalledWith(ALERT_TITLE_SUBSCRIPTION_UPGRADE_ERROR, 'Some error!');

    });

    it('getLatestPurchase() should return the latest purchase from the array', () => {
      const testInstance = wrapper.root.instance;

      expect(testInstance.getLatestPurchase(mockApplePurchases)).toMatchObject(mockApplePurchases[0]);
    })

    it('isDowngradeFreeSubscription() should return true/false', () => {
      const mockProps = {
        ...props,
        activeSubscriptionProductId: 'free',
        subscriptions: mockSubscriptions
      }

      wrapper.update(<UpgradeContainerComponent {...mockProps} />)
      const testInstance = wrapper.root.instance;

      expect(testInstance.isDowngradeFreeSubscription('free')).toBe(false)
      expect(testInstance.isDowngradeFreeSubscription('com.aardwegmedia.playpost.premium')).toBe(false)
      expect(testInstance.isDowngradeFreeSubscription('com.aardwegmedia.playpost.subscriptions.plus')).toBe(false)
    })

    it('isDowngradePaidSubscription() should return true/false', () => {
      const mockProps = {
        ...props,
        activeSubscriptionProductId: 'com.aardwegmedia.playpost.subscriptions.plus',
        subscriptions: mockSubscriptions
      }

      wrapper.update(<UpgradeContainerComponent {...mockProps} />)
      const testInstance = wrapper.root.instance;

      expect(testInstance.isDowngradePaidSubscription('free')).toBe(false)
      expect(testInstance.isDowngradePaidSubscription('com.aardwegmedia.playpost.premium')).toBe(false)
    })

    it('should correctly handle handleOnPressRestore() when a user has previous purchases', async () => {
      const testInstance = wrapper.root.instance;

      const spyGetAvailablePurchases = jest.spyOn(testInstance, 'getAvailablePurchases').mockReturnValueOnce(mockApplePurchases)
      const spyGetLatestPurchase = jest.spyOn(testInstance, 'getLatestPurchase').mockReturnValueOnce(mockApplePurchases[0]);
      const spyShowErrorAlert = jest.spyOn(testInstance, 'showErrorAlert');

      // Simulate a click on "Restore previous purchase"
      await testInstance.handleOnPressRestore();

      expect(setIsLoadingRestoreHandler).toHaveBeenCalledTimes(1);
      expect(setIsLoadingRestoreHandler).toHaveBeenCalledWith(true);

      expect(spyGetAvailablePurchases).toHaveBeenCalledTimes(1);
      expect(spyGetAvailablePurchases).toHaveReturnedWith(mockApplePurchases)

      expect(spyShowErrorAlert).toHaveBeenCalledTimes(0);

      expect(spyGetLatestPurchase).toHaveBeenCalledTimes(1);
      expect(spyGetLatestPurchase).toHaveReturnedWith(mockApplePurchases[0]);

      expect(validateSubscriptionReceiptHandler).toHaveBeenCalledTimes(1);
      expect(validateSubscriptionReceiptHandler).toHaveBeenCalledWith(mockApplePurchases[0].productId, mockApplePurchases[0].transactionReceipt);
    });

    it('should correctly handle handleOnPressRestore() when a user has no previous purchases', async () => {
      const testInstance = wrapper.root.instance;

      const spyGetAvailablePurchases = jest.spyOn(testInstance, 'getAvailablePurchases').mockReturnValueOnce([]);
      const spyShowErrorAlert = jest.spyOn(testInstance, 'showErrorAlert');

      // Simulate a click on "Restore previous purchase"
      await testInstance.handleOnPressRestore();

      expect(setIsLoadingRestoreHandler).toHaveBeenCalledTimes(2);
      expect(setIsLoadingRestoreHandler).toHaveBeenLastCalledWith(false);

      expect(spyGetAvailablePurchases).toHaveBeenCalledTimes(1);
      expect(spyGetAvailablePurchases).toHaveReturnedWith([])

      expect(spyShowErrorAlert).toHaveBeenCalledTimes(1);
      expect(spyShowErrorAlert).toHaveBeenCalledWith('Nothing to restore', `We could not find any previous purchase to restore. If you think this is incorrect, please contact our support.`);

    });

    it('should show an error alert when an error throws inside handleOnPressRestore()', async () => {
      const testInstance = wrapper.root.instance;

      jest.spyOn(testInstance, 'getAvailablePurchases').mockRejectedValueOnce(new Error('Some error!'));
      const spyShowErrorAlert = jest.spyOn(testInstance, 'showErrorAlert');

      // Simulate a click on "Restore previous purchase"
      await testInstance.handleOnPressRestore();

      expect(setIsLoadingRestoreHandler).toHaveBeenCalledTimes(2);
      expect(setIsLoadingRestoreHandler).toHaveBeenLastCalledWith(false);

      expect(spyShowErrorAlert).toHaveBeenCalledTimes(1);
      expect(spyShowErrorAlert).toHaveBeenCalledWith('Restore purchase error', `Some error!`);

    });
  });
});
