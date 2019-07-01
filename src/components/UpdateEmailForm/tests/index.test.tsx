import React from 'react';
import { render, RenderAPI, fireEvent } from 'react-native-testing-library';

import { UpdateEmailForm } from '../index';

describe('UpdateEmailForm', () => {
  describe('rendering', () => {
    let wrapper: RenderAPI;
    const onChangeTextHandler = jest.fn();
    const onPressUpdateEmailHandler = jest.fn();

    beforeEach(() => {
      wrapper = render(
        <UpdateEmailForm onChangeText={onChangeTextHandler} onPressUpdateEmail={onPressUpdateEmailHandler} email="" isLoading={false} isSuccess={false} />
      );
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });

  describe('interacting', () => {
    let wrapper: RenderAPI;
    const onChangeTextHandler = jest.fn();
    const onPressUpdateEmailHandler = jest.fn();

    beforeEach(() => {
      wrapper = render(
        <UpdateEmailForm onChangeText={onChangeTextHandler} onPressUpdateEmail={onPressUpdateEmailHandler} email="" isLoading={false} isSuccess={false} />
      );
    });

    it('should fire onChangeText when filling in the reset token TextInput', () => {
      const exampleEmail = 'jordyvandenaardweg@gmail.com';
      const emailTextInput = wrapper.getByTestId('UpdateEmailForm-TextInput-email');

      fireEvent.changeText(emailTextInput, exampleEmail);
      expect(onChangeTextHandler).toHaveBeenCalledWith('email', exampleEmail);
    });

    it('should disable the buttons if isLoading is true', () => {
      wrapper.update(
        <UpdateEmailForm onChangeText={onChangeTextHandler} onPressUpdateEmail={onPressUpdateEmailHandler} email="" isLoading={true} isSuccess={false} />
      );

      expect(wrapper.getByTestId('UpdateEmailForm-Button-update').props.disabled).toBe(true);
    });

    it('should disable the buttons if isSuccess is true', () => {
      wrapper.update(
        <UpdateEmailForm onChangeText={onChangeTextHandler} onPressUpdateEmail={onPressUpdateEmailHandler} email="" isLoading={true} isSuccess={true} />
      );

      expect(wrapper.getByTestId('UpdateEmailForm-Button-update').props.disabled).toBe(true);
    });
  });
});
