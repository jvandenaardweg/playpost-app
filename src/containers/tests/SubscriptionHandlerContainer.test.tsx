import React from 'react';
import { SubscriptionPurchase } from 'react-native-iap';
import renderer from 'react-test-renderer';

import Text from '../../components/Text';
import { Props, SubscriptionHandlerContainerComponent } from '../SubscriptionHandlerContainer';

jest.mock('../../navigation/NavigationService');

jest.useFakeTimers();

import subscriptionValidationResultActiveMock from '../../../tests/__mocks__/subscription-validation-result-active';
import subscriptionValidationResultExpiredMock from '../../../tests/__mocks__/subscription-validation-result-expired';
import userMock from '../../../tests/__mocks__/user-active-subscription';

import userInAppSubscriptionGoogle from '../../../tests/__mocks__/in-app-subscription-google';

import Modal from 'react-native-modal';
import { SUBSCRIPTION_PRODUCT_ID_PREMIUM } from '../../constants/in-app-purchase';
import NavigationService from '../../navigation/NavigationService';

const validateSubscriptionReceiptHandler = jest.fn();
const getUserHandler = jest.fn();
const setIsLoadingUpgradeHandler = jest.fn();
const setIsLoadingRestoreHandler = jest.fn();
const setIsActiveUpgradeModalHandler = jest.fn();
const navigateHandler = jest.fn();
const navigationGetParamHandler = jest.fn();
const navigationGoBackHandler = jest.fn();
const setLocalPurchaseHistoryHandler = jest.fn();

const defaultProps: Props = {
  subscriptionsError: '',
  validationResult: null,
  isSubscribed: false,
  activeInAppSubscription: null,
  userDetails: userMock,
  isLoadingUpgrade: false,
  isLoadingRestore: false,
  isLoggedIn: true,
  userIsEligibleForTrial: false,
  isActiveUpgradeModal: false,
  totalAvailableVoices: 240,

  validateSubscriptionReceipt: validateSubscriptionReceiptHandler,
  getUser: getUserHandler,
  setIsLoadingUpgrade: setIsLoadingUpgradeHandler,
  setIsLoadingRestore: setIsLoadingRestoreHandler,
  setIsActiveUpgradeModal: setIsActiveUpgradeModalHandler,
  setLocalPurchaseHistory: setLocalPurchaseHistoryHandler,

  navigation: {
    navigate: navigateHandler,
    getParam: navigationGetParamHandler,
    goBack: navigationGoBackHandler,
  } as any
};

describe('SubscriptionHandlerContainer', () => {

  describe('rendering', () => {
    let wrapper: renderer.ReactTestRenderer;

    beforeEach(() => {

      const props: Props = {
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
      const props: Props = {
        ...defaultProps
      }

      wrapper = renderer.create(<SubscriptionHandlerContainerComponent {...props}><Text>Container test</Text></SubscriptionHandlerContainerComponent>);
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should run syncUserInAppSubscriptionWithAPI when interval time passes', () => {
      const testInstance: SubscriptionHandlerContainerComponent = wrapper.root.instance;

      testInstance.syncUserInAppSubscriptionWithAPI = jest.fn();

      expect(testInstance.validateSubscriptionInterval).toBeDefined();

      // Mock
      jest.runOnlyPendingTimers();

      expect(testInstance.syncUserInAppSubscriptionWithAPI).toHaveBeenCalledTimes(1);

    });

    it('should correctly run syncUserInAppSubscriptionWithAPI when the user his subscription is expired locally', async () => {
      const props: Props = {
        ...defaultProps,
        isSubscribed: true,
        activeInAppSubscription: userInAppSubscriptionGoogle
      }

      wrapper.update(<SubscriptionHandlerContainerComponent {...props}><Text>Container test</Text></SubscriptionHandlerContainerComponent>)
      const testInstance: SubscriptionHandlerContainerComponent = wrapper.root.instance;

      testInstance.context.isConnected = true;

      // const spyValidateSubscriptionReceipt = jest.spyOn(testInstance.props, 'validateSubscriptionReceipt');
      const spyGetUser = jest.spyOn(testInstance.props, 'getUser');

      await testInstance.syncUserInAppSubscriptionWithAPI();

      // expect(spyValidateSubscriptionReceipt).toHaveBeenCalledTimes(1);
      // expect(spyValidateSubscriptionReceipt).toHaveBeenCalledWith(activeSubscriptionProductId, '[REDACTED]', 'ios');
      expect(spyGetUser).toHaveBeenCalledTimes(1);
    });

    it('should not run syncUserInAppSubscriptionWithAPI when the user his subscription is not expired locally', async () => {
      // Set expires date to tomorrow
      const expiresAt = new Date().setDate(new Date().getDate() + 1);

      const props: Props = {
        ...defaultProps,
        isSubscribed: true,
        validationResult: {
          ...subscriptionValidationResultActiveMock,
          expiresAt
        } as any
      }

      wrapper.update(<SubscriptionHandlerContainerComponent {...props}><Text>Container test</Text></SubscriptionHandlerContainerComponent>)
      const testInstance: SubscriptionHandlerContainerComponent = wrapper.root.instance;

      testInstance.context.isConnected = true;

      await testInstance.syncUserInAppSubscriptionWithAPI();

      expect(testInstance.props.validateSubscriptionReceipt).toHaveBeenCalledTimes(0);
      expect(testInstance.props.getUser).toHaveBeenCalledTimes(0);
    });

    it('should not run syncUserInAppSubscriptionWithAPI when the user is not subscribed', async () => {
      const props: Props = {
        ...defaultProps,
        activeInAppSubscription: userInAppSubscriptionGoogle,
        isSubscribed: false
      }

      wrapper.update(<SubscriptionHandlerContainerComponent {...props}><Text>Container test</Text></SubscriptionHandlerContainerComponent>)
      const testInstance: SubscriptionHandlerContainerComponent = wrapper.root.instance;

      testInstance.context.isConnected = true;

      await testInstance.syncUserInAppSubscriptionWithAPI();

      expect(testInstance.props.validateSubscriptionReceipt).toHaveBeenCalledTimes(0);
      expect(testInstance.props.getUser).toHaveBeenCalledTimes(0);
    });

    it('should not run handlePurchaseUpdateListener when a user is not logged in', async () => {
      const productId = SUBSCRIPTION_PRODUCT_ID_PREMIUM;
      const transactionReceipt = '[REDACTED]';
      const transactionId = '150000534161208';
      const transactionDate = 1566204171000;
      const mockPurchase = { productId, transactionReceipt, transactionId, transactionDate }

      const props: Props = {
        ...defaultProps,
        userDetails: null,
        isLoggedIn: false
      }

      wrapper.update(<SubscriptionHandlerContainerComponent {...props}><Text>Container test</Text></SubscriptionHandlerContainerComponent>)
      const testInstance: SubscriptionHandlerContainerComponent = wrapper.root.instance;

      testInstance.context.isConnected = true;

      const spyValidateSubscriptionReceipt = jest.spyOn(testInstance.props, 'validateSubscriptionReceipt');
      const spyFinishTransaction = jest.spyOn(testInstance, 'finishTransaction');
      const spyShowErrorAlert = jest.spyOn(testInstance, 'showErrorAlert');
      const spySetIsLoadingUpgrade = jest.spyOn(testInstance.props, 'setIsLoadingUpgrade');

      // Run the handler with mock data to simulate a purchase
      await testInstance.handlePurchaseUpdateListener(mockPurchase as SubscriptionPurchase)

      expect(spySetIsLoadingUpgrade).toHaveBeenCalledTimes(0);
      expect(spyShowErrorAlert).toHaveBeenCalledTimes(0);
      expect(spyValidateSubscriptionReceipt).toHaveBeenCalledTimes(0);
      expect(spyFinishTransaction).toHaveBeenCalledTimes(0);
    });

    it('should not run handlePurchaseErrorListener when a user is not logged in', async () => {
      const props: Props = {
        ...defaultProps,
        userDetails: null,
        isLoggedIn: false
      }

      wrapper.update(<SubscriptionHandlerContainerComponent {...props}><Text>Container test</Text></SubscriptionHandlerContainerComponent>)
      const testInstance: SubscriptionHandlerContainerComponent = wrapper.root.instance;

      testInstance.context.isConnected = true;

      const spyShowErrorAlert = jest.spyOn(testInstance, 'showErrorAlert');
      const spySetIsLoadingUpgrade = jest.spyOn(testInstance.props, 'setIsLoadingUpgrade');

      // Run the handler with mock data to simulate a purchase
      await testInstance.handlePurchaseErrorListener({})

      expect(spySetIsLoadingUpgrade).toHaveBeenCalledTimes(0);
      expect(spyShowErrorAlert).toHaveBeenCalledTimes(0);
    });

    it('should correctly finish a transaction using handlePurchaseUpdateListener', async () => {
      const productId = SUBSCRIPTION_PRODUCT_ID_PREMIUM;
      const transactionReceipt = '[REDACTED]';
      const transactionId = '150000534161208';
      const transactionDate = 1566204171000;
      const mockPurchase = { productId, transactionReceipt, transactionId, transactionDate }

      const props: Props = {
        ...defaultProps,
        isSubscribed: false
      }

      wrapper.update(<SubscriptionHandlerContainerComponent {...props}><Text>Container test</Text></SubscriptionHandlerContainerComponent>)
      const testInstance: SubscriptionHandlerContainerComponent = wrapper.root.instance;

      testInstance.context.isConnected = true;

      const spyValidateSubscriptionReceipt = jest.spyOn(testInstance.props, 'validateSubscriptionReceipt');
      const spyFinishTransaction = jest.spyOn(testInstance, 'finishTransaction').mockResolvedValueOnce();
      const spyShowErrorAlert = jest.spyOn(testInstance, 'showErrorAlert');
      const spySetIsLoadingUpgrade = jest.spyOn(testInstance.props, 'setIsLoadingUpgrade');

      // Run the handler with mock data to simulate a purchase
      await testInstance.handlePurchaseUpdateListener(mockPurchase as SubscriptionPurchase)

      expect(spySetIsLoadingUpgrade).toHaveBeenCalledTimes(2);
      expect(spySetIsLoadingUpgrade).toHaveBeenNthCalledWith(1, true);
      expect(spySetIsLoadingUpgrade).toHaveBeenNthCalledWith(2, false); // in finally

      expect(spyShowErrorAlert).toHaveBeenCalledTimes(0);

      expect(spyValidateSubscriptionReceipt).toHaveBeenCalledTimes(1);
      expect(spyValidateSubscriptionReceipt).toHaveBeenCalledWith(productId, transactionReceipt, 'ios');

      expect(spyFinishTransaction).toHaveBeenCalledTimes(1);
      expect(spyFinishTransaction).toHaveBeenCalledWith(mockPurchase);
    });

    it('should correctly handle an error inside handlePurchaseUpdateListener when productId is empty', async () => {
      const productId = '';
      const transactionReceipt = '[REDACTED]';
      const transactionId = '150000534161208';
      const transactionDate = 1566204171000;
      const mockPurchase = { productId, transactionReceipt, transactionId, transactionDate }

      const props: Props = {
        ...defaultProps,
        isSubscribed: false
      }

      wrapper.update(<SubscriptionHandlerContainerComponent {...props}><Text>Container test</Text></SubscriptionHandlerContainerComponent>)
      const testInstance: SubscriptionHandlerContainerComponent = wrapper.root.instance;

      testInstance.context.isConnected = true;

      const spyShowErrorAlert = jest.spyOn(testInstance, 'showErrorAlert')

      // Run the handler with mock data to simulate a purchase
      await testInstance.handlePurchaseUpdateListener(mockPurchase as SubscriptionPurchase)

      expect(testInstance.props.setIsLoadingUpgrade).toHaveBeenCalledTimes(1);
      expect(testInstance.props.setIsLoadingUpgrade).toHaveBeenCalledWith(false);

      expect(spyShowErrorAlert).toHaveBeenCalledTimes(1);
      expect(spyShowErrorAlert).toHaveBeenCalledWith('Purchase failed', 'No productId present in purchase.');
    });

    it('should correctly handle an error by handlePurchaseErrorListener', async () => {
      const debugMessage = 'Some debug message to show!';
      const mockError = { debugMessage }

      const props: Props = {
        ...defaultProps,
        isSubscribed: false
      }

      wrapper.update(<SubscriptionHandlerContainerComponent {...props}><Text>Container test</Text></SubscriptionHandlerContainerComponent>)
      const testInstance: SubscriptionHandlerContainerComponent = wrapper.root.instance;

      testInstance.context.isConnected = true;

      const spyShowErrorAlert = jest.spyOn(testInstance, 'showErrorAlert')

      // Run the handler with mock data to simulate a purchase
      await testInstance.handlePurchaseErrorListener(mockError)

      expect(testInstance.props.setIsLoadingUpgrade).toHaveBeenCalledTimes(1);
      expect(testInstance.props.setIsLoadingUpgrade).toHaveBeenCalledWith(false);

      expect(spyShowErrorAlert).toHaveBeenCalledTimes(1);
    });

    it('should not run showErrorAlert when a user cancelled an upgrade on Android', async () => {
      const debugMessage = 'Some debug message to show!';
      const mockError = { debugMessage, code: 'E_USER_CANCELLED' }

      const props: Props = {
        ...defaultProps,
        isSubscribed: true
      }

      wrapper.update(<SubscriptionHandlerContainerComponent {...props}><Text>Container test</Text></SubscriptionHandlerContainerComponent>)
      const testInstance: SubscriptionHandlerContainerComponent = wrapper.root.instance;

      testInstance.context.isConnected = true;

      const spyShowErrorAlert = jest.spyOn(testInstance, 'showErrorAlert')

      // Run the handler with mock data to simulate a purchase
      await testInstance.handlePurchaseErrorListener(mockError)

      expect(testInstance.props.setIsLoadingUpgrade).toHaveBeenCalledTimes(1);
      expect(testInstance.props.setIsLoadingUpgrade).toHaveBeenCalledWith(false);

      expect(spyShowErrorAlert).toHaveBeenCalledTimes(0);
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

      const testInstance: SubscriptionHandlerContainerComponent = wrapper.root.instance;
      const spyHandleSubscriptionStatusExpired = jest.spyOn(testInstance, 'handleSubscriptionStatusExpired')

      wrapper.update(<SubscriptionHandlerContainerComponent {...propsUnSubscribed}><Text>Container test</Text></SubscriptionHandlerContainerComponent>);

      expect(spyHandleSubscriptionStatusExpired).toHaveBeenCalledTimes(1);
    });

    it('should correctly handle an restore purchase error message in componentDidUpdate when a user has no active subscriptions anymore', async () => {
      const isSubscribed = defaultProps.isSubscribed;

      const props: Props = {
        ...defaultProps,
        isLoadingRestore: false,
        validationResult: '' as any
      }

      const propsExpired = {
        ...defaultProps,
        isLoadingRestore: true,
        validationResult: subscriptionValidationResultExpiredMock
      }

      wrapper.update(<SubscriptionHandlerContainerComponent {...props}><Text>Container test</Text></SubscriptionHandlerContainerComponent>);

      const testInstance: SubscriptionHandlerContainerComponent = wrapper.root.instance;
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

    it('handleOnPressModalCancel() should correctly close the upgrade modal', async () => {
      const props: Props = {
        ...defaultProps
      }

      wrapper.update(<SubscriptionHandlerContainerComponent {...props}><Text>Container test</Text></SubscriptionHandlerContainerComponent>);

      const testInstance: SubscriptionHandlerContainerComponent = wrapper.root.instance;
      const spySetIsActiveUpgradeModal = jest.spyOn(testInstance.props, 'setIsActiveUpgradeModal');

      await testInstance.handleOnPressModalCancel()

      expect(spySetIsActiveUpgradeModal).toHaveBeenCalledTimes(1);
      expect(spySetIsActiveUpgradeModal).toHaveBeenCalledWith(false);

    });

    it('handleOnPressModalUpgrade() should correctly close the upgrade modal', async () => {
      const props: Props = {
        ...defaultProps
      }

      wrapper.update(<SubscriptionHandlerContainerComponent {...props}><Text>Container test</Text></SubscriptionHandlerContainerComponent>);

      const testInstance: SubscriptionHandlerContainerComponent = wrapper.root.instance;
      const spySetIsActiveUpgradeModal = jest.spyOn(testInstance.props, 'setIsActiveUpgradeModal');

      await testInstance.handleOnPressModalUpgrade()

      expect(spySetIsActiveUpgradeModal).toHaveBeenCalledTimes(1);
      expect(spySetIsActiveUpgradeModal).toHaveBeenCalledWith(false);

    });

    it('handleOnPressModalUpgrade() should correctly return the subscription to be centered', async () => {
      const props: Props = {
        ...defaultProps,
        isSubscribed: false,
        activeInAppSubscription: null
      }

      wrapper.update(<SubscriptionHandlerContainerComponent {...props}><Text>Container test</Text></SubscriptionHandlerContainerComponent>);

      const testInstance: SubscriptionHandlerContainerComponent = wrapper.root.instance;

      expect(await testInstance.handleOnPressModalUpgrade()).toBe(SUBSCRIPTION_PRODUCT_ID_PREMIUM);

    });

    it('handleOnPressModalUpgrade() should correctly navigate to the upgrade screen', async () => {
      const props: Props = {
        ...defaultProps,
        isSubscribed: false,
        activeInAppSubscription: null
      }

      wrapper.update(<SubscriptionHandlerContainerComponent {...props}><Text>Container test</Text></SubscriptionHandlerContainerComponent>);

      const testInstance: SubscriptionHandlerContainerComponent = wrapper.root.instance;
      const spyNavigationServiceNavigate = jest.spyOn(NavigationService, 'navigate');

      await testInstance.handleOnPressModalUpgrade();

      expect(spyNavigationServiceNavigate).toHaveBeenCalledTimes(1);
      expect(spyNavigationServiceNavigate).toHaveBeenCalledWith('Upgrade', { centeredSubscriptionProductId: SUBSCRIPTION_PRODUCT_ID_PREMIUM });

    });

    it('should not render UpgradeModal when isActiveUpgradeModal is false', async () => {
      const props: Props = {
        ...defaultProps,
        isActiveUpgradeModal: false
      }

      wrapper.update(<SubscriptionHandlerContainerComponent {...props}><Text>Container test</Text></SubscriptionHandlerContainerComponent>);

      // UpgradeModal uses Modal, so we just check for that
      expect(wrapper.root.findAllByType(Modal)[0].props.isVisible).toBe(false);

    });

    it('should render UpgradeModal when isActiveUpgradeModal is true', async () => {
      const props: Props = {
        ...defaultProps,
        isActiveUpgradeModal: true
      }

      wrapper.update(<SubscriptionHandlerContainerComponent {...props}><Text>Container test</Text></SubscriptionHandlerContainerComponent>);

      // UpgradeModal uses Modal, so we just check for that
      expect(wrapper.root.findAllByType(Modal)[0].props.isVisible).toBe(true);

    });

    // TODO: create test
    // it('should correctly handle an error inside finishTransaction', () => {

    // })
  });
});
