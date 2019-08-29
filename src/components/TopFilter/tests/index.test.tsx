import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { TopFilter } from '../index';

const onSelectHandler = jest.fn()
const defaultProps = {
  filters: [
    {
      label: 'Country',
      options: ['All', 'EN', 'NL', 'DE'],
      selectedOption: 'All',
      onSelect: onSelectHandler
    }
  ]
}

describe('TopFilter', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeEach(() => {
      const props = {
        ...defaultProps
      }
      wrapper = render(<TopFilter {...props} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render the correct filter label', () => {
      expect(wrapper.getByTestId('TopFilter-Text-label').props.children).toBe(defaultProps.filters[0].label);
    });

    it('should render the correct amount of filter options', () => {
      expect(wrapper.queryAllByTestId('TopFilter-View-ButtonTiny-container')).toHaveLength(defaultProps.filters[0].options.length);
    });
  });
});
