import React from 'react';
import { TextInput } from 'react-native';
import { render, RenderAPI } from 'react-native-testing-library';

import { Text } from '../../Text';
import { InputGroup, Props } from '../index';

const defaultProps: Props = {
  label: 'E-mail address',
  children: <TextInput />,
 }

describe('InputGroup', () => {
  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeEach(() => {
      const props = {
        ...defaultProps
      }
      wrapper = render(<InputGroup {...props} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render correctly render the correct label', () => {
      expect(wrapper.getByTestId('InputGroup-Text-label').props.children).toBe('E-mail address');
    });

    it('should not render the RightElement when not given', () => {
      expect(wrapper.queryByTestId('InputGroup-RightElement')).toBeFalsy();
    });

    it('should render the RightElement when given', () => {
      const props = {
        ...defaultProps,
        children: <TextInput />,
        RightElement: <Text testID="InputGroup-RightElement">Some element</Text>
      }

      wrapper.update(<InputGroup {...props} />);

      expect(wrapper.queryByTestId('InputGroup-RightElement')).toBeTruthy();
    });
  });
});
