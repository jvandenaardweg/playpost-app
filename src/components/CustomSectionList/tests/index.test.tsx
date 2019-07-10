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
              title: 'test',
              data: [
                {
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
