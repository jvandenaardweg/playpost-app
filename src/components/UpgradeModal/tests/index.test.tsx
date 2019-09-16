import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';
import { Props, UpgradeModal } from '../index';

const onPressCancelHandler = jest.fn();
const onPressUpgradeHandler = jest.fn();

const defaultProps: Props = {
  isActive: false,
  isEligibleForTrial: false,
  isSubscribed: false,
  trialUrgencyDate: 'Tuesday, September 17th',
  totalAvailableVoices: 240,
  onPressCancel: onPressCancelHandler,
  onPressUpgrade: onPressUpgradeHandler
}

describe('UpgradeModal', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      const props = {
        ...defaultProps
      }
      wrapper = render(<UpgradeModal {...props} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });

  describe('interacting', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      const props = {
        ...defaultProps
      }
      wrapper = render(<UpgradeModal {...props} />);
    });

    it('should render the correct content when user is eligible for a trial', () => {
      const props = {
        ...defaultProps,
        isActive: true,
        isEligibleForTrial: true,
        isSubscribed: false
      }
      wrapper.update(<UpgradeModal {...props} />);

      // expect(wrapper.getByTestId('UpgradeModal-Text-trial').props.children).toMatchObject(['Continue listening, start your free trial before ', 'Tuesday, September 17th', '.']);
      expect(wrapper.queryByTestId('UpgradeModal-Button-upgrade')).toBeTruthy();
      expect(wrapper.getByTestId('UpgradeModal-Button-upgrade').props.title).toBe('Start free trial');
    });

    it('should render the correct content when user is not subscribed and also not eligible for a trial', () => {
      const props = {
        ...defaultProps,
        isActive: true,
        isEligibleForTrial: false,
        isSubscribed: false,
      }
      wrapper.update(<UpgradeModal {...props} />);

      // expect(wrapper.queryByTestId('UpgradeModal-Text-trial')).toBeFalsy();
      expect(wrapper.getByTestId('UpgradeModal-Button-upgrade')).toBeTruthy();
      expect(wrapper.getByTestId('UpgradeModal-Button-upgrade').props.title).toBe('Continue listening');
      expect(wrapper.getByTestId('UpgradeModal-Text-not-isSubscribed')).toBeTruthy();
      expect(wrapper.getByTestId('UpgradeModal-Text-not-isSubscribed').props.children).toBe(`You have used your free minutes for this month. Upgrade now to continue listening using this voice or one of the 240 other high-quality voices. Pick and choose the voice you like!\n\nWhen not upgrading, you will be set to use our lowest quality voices for the next month.`);
    });

    it('should render the correct content when user is already subscribed but should upgrade to a higher plan', () => {
      const props = {
        ...defaultProps,
        isActive: true,
        isEligibleForTrial: false,
        isSubscribed: true,
      }
      wrapper.update(<UpgradeModal {...props} />);

      // expect(wrapper.queryByTestId('UpgradeModal-Text-trial')).toBeFalsy();
      expect(wrapper.getByTestId('UpgradeModal-Button-upgrade')).toBeTruthy();
      expect(wrapper.getByTestId('UpgradeModal-Button-upgrade').props.title).toBe('Continue listening');
      expect(wrapper.queryByTestId('UpgradeModal-Text-not-isSubscribed')).toBeFalsy();
      expect(wrapper.getByTestId('UpgradeModal-Text-isSubscribed').props.children).toBe('You have used your last remaining audio minutes for your subscription this month.\n\nYou can continue listening by upgrading to a higher subscription plan.');
    });
  });
});
