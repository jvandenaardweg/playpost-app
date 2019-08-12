import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';

import { SubscriptionHandlerContainerComponent } from '../SubscriptionHandlerContainer';

jest.mock('appcenter-analytics');
jest.mock('react-native-iap');
jest.mock('../../navigation/NavigationService');

jest.useFakeTimers();

import subscriptionValidationResultActiveMock from '../../../tests/__mocks__/subscription-validation-result-active';
import subscriptionValidationResultExpiredMock from '../../../tests/__mocks__/subscription-validation-result-expired';
import userMock from '../../../tests/__mocks__/user';

const validateSubscriptionReceiptHandler = jest.fn();
const getUserHandler = jest.fn();
const setIsLoadingUpgradeHandler = jest.fn();
const setIsLoadingRestoreHandler = jest.fn();
const navigateHandler = jest.fn();
const navigationGetParamHandler = jest.fn();
const navigationGoBackHandler = jest.fn();

const defaultProps: any = {
  subscriptionsError: '',
  validationResult: null,
  isSubscribed: false,
  activeSubscriptionProductId: 'free',
  userDetails: null,
  userHasSubscribedBefore: false,
  isLoadingUpgrade: false,
  isLoadingRestore: false,
  authenticationStatus: 'LOGGED_IN',
  validateSubscriptionReceipt: validateSubscriptionReceiptHandler,
  getUser: getUserHandler,
  setIsLoadingUpgrade: setIsLoadingUpgradeHandler,
  setIsLoadingRestore: setIsLoadingRestoreHandler,
  navigation: {
    navigate: navigateHandler,
    getParam: navigationGetParamHandler,
    goBack: navigationGoBackHandler,
  },
};

describe('SubscriptionHandlerContainer', () => {

  describe('rendering', () => {
    let wrapper: renderer.ReactTestRenderer;

    beforeEach(() => {

      const props = {
        ...defaultProps
      }

      wrapper = renderer.create(<SubscriptionHandlerContainerComponent {...props}><Text>Container test</Text></SubscriptionHandlerContainerComponent>);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });

  describe('interacting', () => {
    let wrapper: renderer.ReactTestRenderer;

    beforeEach(() => {
      const props = {
        ...defaultProps
      }

      wrapper = renderer.create(<SubscriptionHandlerContainerComponent {...props}><Text>Container test</Text></SubscriptionHandlerContainerComponent>);
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should run validateActiveSubscriptionAtInterval when interval time passes', () => {
      const testInstance = wrapper.root.instance;

      testInstance.validateActiveSubscriptionAtInterval = jest.fn();

      expect(testInstance.validateSubscriptionInterval).toBeDefined();

      // Mock
      jest.runOnlyPendingTimers();

      expect(testInstance.validateActiveSubscriptionAtInterval).toHaveBeenCalledTimes(1);

    });

    it('should correctly run validateActiveSubscriptionAtInterval when the user his subscription is expired locally', async () => {
      const activeSubscriptionProductId = 'com.aardwegmedia.playpost.premium';

      const props = {
        ...defaultProps,
        activeSubscriptionProductId,
        isSubscribed: true,
        validationResult: subscriptionValidationResultExpiredMock
      }

      wrapper.update(<SubscriptionHandlerContainerComponent {...props}><Text>Container test</Text></SubscriptionHandlerContainerComponent>)
      const testInstance = wrapper.root.instance;

      testInstance.context.isConnected = true;

      const spyValidateSubscriptionReceipt = jest.spyOn(testInstance.props, 'validateSubscriptionReceipt').mockResolvedValueOnce(subscriptionValidationResultExpiredMock);
      const spyGetUser = jest.spyOn(testInstance.props, 'getUser').mockResolvedValueOnce(userMock);

      await testInstance.validateActiveSubscriptionAtInterval();

      expect(spyValidateSubscriptionReceipt).toHaveBeenCalledTimes(1);
      expect(spyValidateSubscriptionReceipt).toHaveBeenCalledWith(activeSubscriptionProductId, '[REDACTED]');
      expect(spyGetUser).toHaveBeenCalledTimes(1);
    });

    it('should not run validateActiveSubscriptionAtInterval when the user his subscription is not expired locally', async () => {
      const activeSubscriptionProductId = 'com.aardwegmedia.playpost.premium';

      // Set expires date to tomorrow
      const expiresAt = new Date().setDate(new Date().getDate() + 1);

      const props = {
        ...defaultProps,
        activeSubscriptionProductId,
        isSubscribed: true,
        validationResult: {
          ...subscriptionValidationResultActiveMock,
          expiresAt
        }
      }

      wrapper.update(<SubscriptionHandlerContainerComponent {...props}><Text>Container test</Text></SubscriptionHandlerContainerComponent>)
      const testInstance = wrapper.root.instance;

      testInstance.context.isConnected = true;

      await testInstance.validateActiveSubscriptionAtInterval();

      expect(testInstance.props.validateSubscriptionReceipt).toHaveBeenCalledTimes(0);
      expect(testInstance.props.getUser).toHaveBeenCalledTimes(0);
    });

    it('should not run validateActiveSubscriptionAtInterval when the user is not subscribed', async () => {
      const activeSubscriptionProductId = 'free';

      const props = {
        ...defaultProps,
        activeSubscriptionProductId,
        isSubscribed: false
      }

      wrapper.update(<SubscriptionHandlerContainerComponent {...props}><Text>Container test</Text></SubscriptionHandlerContainerComponent>)
      const testInstance = wrapper.root.instance;

      testInstance.context.isConnected = true;

      await testInstance.validateActiveSubscriptionAtInterval();

      expect(testInstance.props.validateSubscriptionReceipt).toHaveBeenCalledTimes(0);
      expect(testInstance.props.getUser).toHaveBeenCalledTimes(0);
    });

    it('should correctly finish a transaction using handlePurchaseUpdateListener', async () => {
      const productId = 'com.aardwegmedia.playpost.premium';
      const transactionReceipt = '[REDACTED]';
      const transactionId = '150000534161208';
      const mockPurchase = { productId, transactionReceipt, transactionId }

      const props = {
        ...defaultProps,
        isSubscribed: false
      }

      wrapper.update(<SubscriptionHandlerContainerComponent {...props}><Text>Container test</Text></SubscriptionHandlerContainerComponent>)
      const testInstance = wrapper.root.instance;

      testInstance.context.isConnected = true;

      const spyValidateSubscriptionReceipt = jest.spyOn(testInstance.props, 'validateSubscriptionReceipt').mockResolvedValueOnce(subscriptionValidationResultActiveMock);
      const spyFinishTransaction = jest.spyOn(testInstance, 'finishTransaction').mockResolvedValueOnce(true);
      const spyShowErrorAlert = jest.spyOn(testInstance, 'showErrorAlert')

      // Run the handler with mock data to simulate a purchase
      await testInstance.handlePurchaseUpdateListener(mockPurchase)

      expect(testInstance.props.setIsLoadingUpgrade).toHaveBeenCalledTimes(2);
      expect(testInstance.props.setIsLoadingUpgrade).toHaveBeenNthCalledWith(1, true);
      expect(testInstance.props.setIsLoadingUpgrade).toHaveBeenNthCalledWith(2, false); // in finally

      expect(spyShowErrorAlert).toHaveBeenCalledTimes(0);

      expect(spyValidateSubscriptionReceipt).toHaveBeenCalledTimes(1);
      expect(spyValidateSubscriptionReceipt).toHaveBeenCalledWith(productId, transactionReceipt);

      expect(spyFinishTransaction).toHaveBeenCalledTimes(1);
      expect(spyFinishTransaction).toHaveBeenCalledWith(transactionId);
    });

    it('should correctly handle an error inside handlePurchaseUpdateListener when productId is empty', async () => {
      const productId = '';
      const transactionReceipt = '[REDACTED]';
      const transactionId = '150000534161208';
      const mockPurchase = { productId, transactionReceipt, transactionId }

      const props = {
        ...defaultProps,
        isSubscribed: false
      }

      wrapper.update(<SubscriptionHandlerContainerComponent {...props}><Text>Container test</Text></SubscriptionHandlerContainerComponent>)
      const testInstance = wrapper.root.instance;

      testInstance.context.isConnected = true;

      const spyShowErrorAlert = jest.spyOn(testInstance, 'showErrorAlert')

      // Run the handler with mock data to simulate a purchase
      await testInstance.handlePurchaseUpdateListener(mockPurchase)

      expect(testInstance.props.setIsLoadingUpgrade).toHaveBeenCalledTimes(1);
      expect(testInstance.props.setIsLoadingUpgrade).toHaveBeenCalledWith(false);

      expect(spyShowErrorAlert).toHaveBeenCalledTimes(1);
      expect(spyShowErrorAlert).toHaveBeenCalledWith('Purchase failed', 'No productId present in purchase.');
    });

    it('should correctly handle an error inside handlePurchaseUpdateListener when transactionId is empty', async () => {
      const productId = 'com.aardwegmedia.playpost.premium';
      const transactionReceipt = '[REDACTED]';
      const transactionId = '';
      const mockPurchase = { productId, transactionReceipt, transactionId }

      const props = {
        ...defaultProps,
        isSubscribed: false
      }

      wrapper.update(<SubscriptionHandlerContainerComponent {...props}><Text>Container test</Text></SubscriptionHandlerContainerComponent>)
      const testInstance = wrapper.root.instance;

      testInstance.context.isConnected = true;

      const spyShowErrorAlert = jest.spyOn(testInstance, 'showErrorAlert')

      // Run the handler with mock data to simulate a purchase
      await testInstance.handlePurchaseUpdateListener(mockPurchase)

      expect(testInstance.props.setIsLoadingUpgrade).toHaveBeenCalledTimes(1);
      expect(testInstance.props.setIsLoadingUpgrade).toHaveBeenCalledWith(false);

      expect(spyShowErrorAlert).toHaveBeenCalledTimes(1);
      expect(spyShowErrorAlert).toHaveBeenCalledWith('Purchase failed', 'No transactionId present in purchase.');
    });

    it('should correctly handle an error by handlePurchaseErrorListener', async () => {
      const debugMessage = 'Some debug message to show!';
      const mockError = { debugMessage }

      const props = {
        ...defaultProps,
        isSubscribed: false
      }

      wrapper.update(<SubscriptionHandlerContainerComponent {...props}><Text>Container test</Text></SubscriptionHandlerContainerComponent>)
      const testInstance = wrapper.root.instance;

      testInstance.context.isConnected = true;

      const spyShowErrorAlert = jest.spyOn(testInstance, 'showErrorAlert')

      // Run the handler with mock data to simulate a purchase
      await testInstance.handlePurchaseErrorListener(mockError)

      expect(testInstance.props.setIsLoadingUpgrade).toHaveBeenCalledTimes(1);
      expect(testInstance.props.setIsLoadingUpgrade).toHaveBeenCalledWith(false);

      expect(spyShowErrorAlert).toHaveBeenCalledTimes(1);
    });

    it('should correctly handle an expire message in componentDidUpdate when a user is not subscribed anymore', async () => {
      const propsSubscribed = {
        ...defaultProps,
        isSubscribed: true
      }

      const propsUnSubscribed = {
        ...defaultProps,
        isSubscribed: false
      }

      wrapper.update(<SubscriptionHandlerContainerComponent {...propsSubscribed}><Text>Container test</Text></SubscriptionHandlerContainerComponent>);

      const testInstance = wrapper.root.instance;
      const spyHandleSubscriptionStatusExpired = jest.spyOn(testInstance, 'handleSubscriptionStatusExpired')

      wrapper.update(<SubscriptionHandlerContainerComponent {...propsUnSubscribed}><Text>Container test</Text></SubscriptionHandlerContainerComponent>);

      expect(spyHandleSubscriptionStatusExpired).toHaveBeenCalledTimes(1);
    });

    it('should correctly handle an restore purchase error message in componentDidUpdate when a user has no active subscriptions anymore', async () => {
      const isSubscribed = defaultProps.isSubscribed;

      const propsDefault = {
        ...defaultProps,
        isLoadingRestore: false,
        validationResult: ''
      }

      const propsExpired = {
        ...defaultProps,
        isLoadingRestore: true,
        validationResult: subscriptionValidationResultExpiredMock
      }

      wrapper.update(<SubscriptionHandlerContainerComponent {...propsDefault}><Text>Container test</Text></SubscriptionHandlerContainerComponent>);

      const testInstance = wrapper.root.instance;
      const spyHandleRestoreSubscriptionStatus = jest.spyOn(testInstance, 'handleRestoreSubscriptionStatus');
      const spyShowErrorAlert = jest.spyOn(testInstance, 'showErrorAlert');

      wrapper.update(<SubscriptionHandlerContainerComponent {...propsExpired}><Text>Container test</Text></SubscriptionHandlerContainerComponent>);

      expect(spyHandleRestoreSubscriptionStatus).toHaveBeenCalledTimes(1);
      expect(spyHandleRestoreSubscriptionStatus).toHaveBeenCalledWith(subscriptionValidationResultExpiredMock, isSubscribed);

      expect(testInstance.props.setIsLoadingRestore).toHaveBeenCalledTimes(1);
      expect(testInstance.props.setIsLoadingRestore).toHaveBeenCalledWith(false);

      expect(spyShowErrorAlert).toHaveBeenCalledTimes(1);
      expect(spyShowErrorAlert).toHaveBeenCalledWith('Subscription is expired', expect.anything());
    });
  });
});