import React from 'react';
import { fireEvent, render, RenderAPI } from 'react-native-testing-library';

import { getUpgradeButtonTitle, getUpgradeMessage, Usage } from '../index';

import userMock from '../../../../tests/__mocks__/user';
import { SUBSCRIPTION_PRODUCT_ID_FREE, SUBSCRIPTION_PRODUCT_ID_PREMIUM } from '../../../constants/in-app-purchase';

const onPressUpgradeHandler = jest.fn();

const defaultProps: any = {
  user: userMock,
  activeSubscriptionProductId: SUBSCRIPTION_PRODUCT_ID_FREE,
  onPressUpgrade: onPressUpgradeHandler,
  userHasSubscribedBefore: false
}

describe('Usage', () => {
  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeEach(() => {
      const props = {
        ...defaultProps
      }

      wrapper = render(<Usage {...props} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render the used minutes correctly', () => {
      expect(wrapper.getByTestId('Usage-Text-minutes-used').props.children).toBe('of 30 minutes used');
    });

    it('should render the used percentage correctly', () => {
      expect(wrapper.getByTestId('Usage-Text-percentage').props.children).toBe('0%');
    });

    it('should render the progress width correctly', () => {
      expect(wrapper.getByTestId('Usage-View-progress').props.style[1].width).toBe('0%');
    });

    it('should render the progress width correctly when usage is above 100%', () => {
      const props = {
        ...defaultProps,
        user: {
          ...userMock,
          used: {
            audiofiles: {
              currentMonthInSeconds: 999999
            }
          },
          available: {
            audiofiles: {
              currentMonthInSeconds: 0
            }
          },
          limits: {
            audiofiles: {
              limitSecondsPerMonth: 1800,
              limitSecondsPerArticle: 1800
            }
          }
        }
      }

      wrapper.update(<Usage {...props} />);

      expect(wrapper.getByTestId('Usage-View-progress').props.style[1].width).toBe('100%');
      expect(wrapper.getByTestId('Usage-Text-percentage').props.children).toBe('100%');
    });

    it('should render an upgrade button when on a free subscription', () => {
      expect(wrapper.queryByTestId('Usage-Button-upgrade')).toBeTruthy();
    });

    it('should render an upgrade button when on a premium subscription', () => {
      const props = {
        ...defaultProps,
        activeSubscriptionProductId: SUBSCRIPTION_PRODUCT_ID_PREMIUM
      }

      wrapper.update(<Usage {...props} />);

      expect(wrapper.queryByTestId('Usage-Button-upgrade')).toBeTruthy();
    });

    it('should render the correct button title', () => {
      expect(wrapper.getByTestId('Usage-Button-upgrade').props.title).toBe('Start free Premium or Plus trial');
    });

    it('should render the correct upgrade message', () => {
      expect(wrapper.getByTestId('Usage-Text-upgrade-message').props.children).toBe('Upgrade for more minutes and Premium quality voices.');
    });

    it('should not render an upgrade button when on a plus subscription', () => {
      const props = {
        ...defaultProps,
        activeSubscriptionProductId: 'com.aardwegmedia.subscriptions.plus'
      }

      wrapper.update(<Usage {...props} />)

      expect(wrapper.queryByTestId('Usage-Button-upgrade')).toBeFalsy();
    });
  });

  describe('interacting', () => {
    let wrapper: RenderAPI;

    beforeEach(() => {
      const props = {
        ...defaultProps
      }

      wrapper = render(<Usage {...props} />);
    });

    it('should fire onPressUpgrade when pressing the upgrade button', () => {
      fireEvent.press(wrapper.getByTestId('Usage-Button-upgrade'));
      expect(onPressUpgradeHandler).toHaveBeenCalledTimes(1);
      expect(onPressUpgradeHandler).toHaveBeenCalledWith(SUBSCRIPTION_PRODUCT_ID_PREMIUM);
    });

    it('getUpgradeMessage should return the correct upgrade message when on a premium subscription', () => {
      expect(getUpgradeMessage(SUBSCRIPTION_PRODUCT_ID_PREMIUM)).toBe('Upgrade for nearly unlimited minutes.');
    });

    it('getUpgradeMessage should return the correct upgrade message when on a free subscription', () => {
      expect(getUpgradeMessage(SUBSCRIPTION_PRODUCT_ID_FREE)).toBe('Upgrade for more minutes and Premium quality voices.');
    });

    it('getUpgradeMessage should return the correct upgrade message when on a plus subscription', () => {
      expect(getUpgradeMessage('com.aardwegmedia.playpost.subscriptions.plus')).toBe('');
    });

    it('getUpgradeButtonTitle should return the correct upgrade button title when on a free subscription when a user has subscribed before', () => {
      expect(getUpgradeButtonTitle(SUBSCRIPTION_PRODUCT_ID_FREE, true)).toBe('Upgrade to Premium or Plus');
    });

    it('getUpgradeButtonTitle should return the correct upgrade button title when on a free subscription when a user has not subscribed before', () => {
      expect(getUpgradeButtonTitle(SUBSCRIPTION_PRODUCT_ID_FREE, false)).toBe('Start free Premium or Plus trial');
    });

    it('getUpgradeButtonTitle should return the correct upgrade button title when on a premium subscription when a user has subscribed before', () => {
      expect(getUpgradeButtonTitle(SUBSCRIPTION_PRODUCT_ID_PREMIUM, true)).toBe('Upgrade to Plus');
    });

    it('getUpgradeButtonTitle should return the correct upgrade button title when on a premium subscription when a user has not subscribed before', () => {
      expect(getUpgradeButtonTitle(SUBSCRIPTION_PRODUCT_ID_PREMIUM, false)).toBe('Upgrade to Plus');
    });

    it('getUpgradeButtonTitle should return the correct upgrade button title when on a plus subscription when a user has subscribed before', () => {
      expect(getUpgradeButtonTitle('com.aardwegmedia.playpost.subscriptions.plus', true)).toBe('');
    });

    it('getUpgradeButtonTitle should return the correct upgrade button title when on a plus subscription when a user has not subscribed before', () => {
      expect(getUpgradeButtonTitle('com.aardwegmedia.playpost.subscriptions.plus', false)).toBe('');
    });

  });
});
