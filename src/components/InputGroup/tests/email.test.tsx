import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { InputGroupEmail, Props } from '../email';

const defaultProps: Props = { }

describe('InputGroupEmail', () => {
  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeEach(() => {
      const props = {
        ...defaultProps
      }
      wrapper = render(<InputGroupEmail {...props} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render correctly render the correct default label', () => {
      expect(wrapper.getByTestId('InputGroup-Text-label').props.children).toBe('E-mail address');
    });

    it('should render correctly render the correct custom label', () => {
      const props = {
        ...defaultProps,
        label: 'Your new e-mail address'
      }

      wrapper.update(<InputGroupEmail {...props} />);

      expect(wrapper.getByTestId('InputGroup-Text-label').props.children).toBe('Your new e-mail address');
    });
  });
});
