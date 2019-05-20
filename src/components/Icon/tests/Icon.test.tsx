import React from 'react';
import { render } from 'react-native-testing-library';

import * as Icon from '../Icon';

describe('Icon', () => {

  describe('rendering', () => {
    it('should render FontAwesome5 icon', () => {
      const icon = render(<Icon.FontAwesome5 name="heart" />);
      expect(icon.toJSON()).toMatchSnapshot();
    });

    it('should render FontAwesome icon', () => {
      const icon = render(<Icon.FontAwesome name="heart" />);
      expect(icon.toJSON()).toMatchSnapshot();
    });

    it('should render Feather icon', () => {
      const icon = render(<Icon.Feather name="heart" />);
      expect(icon.toJSON()).toMatchSnapshot();
    });
  });
});
