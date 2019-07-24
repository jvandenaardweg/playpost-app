import React from 'react';
// import { render, RenderAPI, fireEvent } from 'react-native-testing-library';
import renderer from 'react-test-renderer';

import { UpgradeContainerComponent } from '../UpgradeContainer';

jest.mock('appcenter-analytics');
jest.mock('react-native-iap');

import mockApplePurchases from '../../../tests/__mocks__/apple-purchases';
import mockSubscriptions from '../../../tests/__mocks__/subscriptions';

const validateSubscriptionReceiptHandler = jest.fn();
const getUserHandler = jest.fn();
const navigateHandler = jest.fn();
const navigationGetParamHandler = jest.fn();
const navigationGoBackHandler = jest.fn();

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

    it('should correctly handle handleOnPressUpgrade() on an downgrade to free', () => {
      const testProductId = 'free';
      const testInstance = wrapper.root.instance;

      const spySubscriptionAlert = jest.spyOn(testInstance, 'showManageSubscriptionAlert');

      // User is not downgrading from a paid subscription
      testInstance.isDowngradePaidSubscription = jest.fn().mockReturnValue(false)

      // User is downgrading to a free subscription
      testInstance.isDowngradeFreeSubscription = jest.fn().mockReturnValue(true)

      testInstance.handleOnPressUpgrade(testProductId);

      expect(spySubscriptionAlert).toHaveBeenCalledTimes(1);
      expect(spySubscriptionAlert).toHaveBeenCalledWith(
        'Downgrade to Free?',
        'To downgrade to Free you need to cancel your current subscription. Cancelling a subscription can only be done through iTunes.\n\n Press \"Manage Subscriptions\" below to manage your subscriptions.');
    });

    it('should correctly handle handleOnPressUpgrade() on an downgrade from a higher subscription', () => {
      const testProductId = 'com.aardwegmedia.playpost.premium';
      const testInstance = wrapper.root.instance;

      const spySubscriptionAlert = jest.spyOn(testInstance, 'showManageSubscriptionAlert');

      // User is downgrading from a paid subscription to free
      testInstance.isDowngradePaidSubscription = jest.fn().mockReturnValue(true)

      // User is not downgrading to a free subscription
      testInstance.isDowngradeFreeSubscription = jest.fn().mockReturnValue(false)

      testInstance.handleOnPressUpgrade(testProductId);

      expect(spySubscriptionAlert).toHaveBeenCalledTimes(1);
      expect(spySubscriptionAlert).toHaveBeenCalledWith(
        'Downgrading Subscription?',
        'Downgrading a subscription can only be done through iTunes.\n\n Press "Manage Subscriptions" below to manage your subscriptions.');
    });

    it('should correctly handle handleOnPressUpgrade() on an upgrade', () => {
      const testProductId = 'com.aardwegmedia.playpost.premium';

      const testInstance = wrapper.root.instance;

      const spySubscriptionAlert = jest.spyOn(testInstance, 'showManageSubscriptionAlert');
      const spyBuySubscription = jest.spyOn(testInstance, 'buySubscription');

      // User is not downgrading from a paid subscription
      testInstance.isDowngradePaidSubscription = jest.fn().mockReturnValue(false)

      // User is not downgrading to a free subscription
      testInstance.isDowngradeFreeSubscription = jest.fn().mockReturnValue(false)

      // Test an upgrade to a higher subscription level
      testInstance.handleOnPressUpgrade(testProductId);

      expect(spySubscriptionAlert).toHaveBeenCalledTimes(0);
      expect(spyBuySubscription).toHaveBeenCalledTimes(1);
      expect(spyBuySubscription).toHaveBeenCalledWith(testProductId);
      expect(testInstance.state.isLoadingBuySubscription).toBe(true);
      expect(testInstance.state.selectedProductId).toBe(testProductId);

    });

    it('getLatestPurchase() should return the latest purchase from the array', () => {
      const testInstance = wrapper.root.instance;

      expect(testInstance.getLatestPurchase(mockApplePurchases)).toMatchObject(mockApplePurchases[1]);
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

    it('should correctly handle handleOnPressRestore()', async () => {
      const testInstance = wrapper.root.instance;

      testInstance.getAvailablePurchases = jest.fn().mockResolvedValue(mockApplePurchases)
      testInstance.getLatestPurchase = jest.fn().mockReturnValue(mockApplePurchases[1])
      // testInstance.validateSubscriptionReceipt = jest.fn().mockResolvedValue('');

      const spyGetAvailablePurchases = jest.spyOn(testInstance, 'getAvailablePurchases');
      // const spyGetLatestPurchase = jest.spyOn(testInstance, 'getLatestPurchase');
      // const spyValidateSubscriptionReceipt = jest.spyOn(testInstance.props, 'validateSubscriptionReceipt');

      // Simulate a click on "Restore previous purchase"
      testInstance.handleOnPressRestore();

      expect(testInstance.state.isLoadingRestorePurchases).toBe(true);
      expect(spyGetAvailablePurchases).toHaveBeenCalledTimes(1);

      // Mock getLatestPurchase
      // testInstance.getLatestPurchase(mockApplePurchases)

      // expect(testInstance.getLatestPurchase).toHaveBeenCalledTimes(1);
      // expect(spyGetLatestPurchase).toHaveBeenCalledWith(mockApplePurchases);

      // testInstance.getLatestPurchase(mockApplePurchases)

      // await testInstance.props.validateSubscriptionReceipt();
      // expect(spyValidateSubscriptionReceipt).toHaveBeenCalledTimes(1);
      // expect(testInstance.getLatestPurchase).toHaveBeenCalledTimes(1);
      // expect(spyBuySubscription).toHaveBeenCalledWith(testProductId);
      // expect(testInstance.state.isLoadingRestorePurchases).toBe(true);
      // expect(testInstance.state.selectedProductId).toBe(testProductId);

    });
  });
});
