import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { CustomSectionList } from '../index';

describe('CustomSectionList', () => {
  describe('basic rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(
        <CustomSectionList
          sectionListData={[
            {
              key: 'test',
              title: 'test',
              data: [
                {
                  key: 'item-title',
                  title: 'Item title'
                }
              ]
            }
          ]}
        />
      );
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
