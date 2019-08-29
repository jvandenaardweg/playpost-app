import React from 'react';
import ShareExtension from 'react-native-share-extension';
// tslint:disable-next-line: no-submodule-imports
import * as ShallowRenderer from 'react-test-renderer/shallow';
import * as KeychainHelper from '../../../utils/keychain';

import { Animated } from 'react-native';
import { ShareOverlay } from '../index';

// jest.useFakeTimers();

jest.mock('Animated', () => {
  const ActualAnimated = require.requireActual('Animated');
  return {
    ...ActualAnimated,
    timing: (value: Animated.Value, config: Animated.TimingAnimationConfig) => {
      return {
        start: (callback: any) => {
          value.setValue(config.toValue as number);
          // tslint:disable-next-line: no-unused-expression
          callback && callback();
        },
      };
    },
  };
});

describe('ShareOverlay', () => {

  describe('rendering', () => {
    let wrapper: any;

    beforeEach(() => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<ShareOverlay />);
      wrapper = renderer.getRenderOutput();
    });

    it('should render correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('interacting', () => {
    let wrapper: any;

    beforeEach(() => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<ShareOverlay />);
      wrapper = renderer.getMountedInstance();
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should correctly process the share data when receiving a URL', async () => {
      const testInstance: ShareOverlay = wrapper;

      // Do not animate in our tests
      const spyRenderModal = jest.spyOn(testInstance, 'renderModal').mockReturnValueOnce(null)
      const spyRenderShareModal = jest.spyOn(testInstance, 'renderShareModal').mockReturnValueOnce(undefined)
      const spyAnimateIn = jest.spyOn(testInstance, 'animateIn').mockResolvedValueOnce()

      // Just assume we are logged in and have a token
      const spyGetToken = jest.spyOn(KeychainHelper, 'getToken').mockResolvedValueOnce('testtoken')

      const spyData = jest.spyOn(ShareExtension, 'data').mockResolvedValueOnce({
        type: 'text/plain',
        value: 'https://www.telegraaf.nl'
      })

      // Should start in loading state
      expect(testInstance.state.isLoading).toBe(true)

      await testInstance.setup()

      expect(spyAnimateIn).toHaveBeenCalledTimes(1);
      expect(spyGetToken).toHaveBeenCalledTimes(1);

      // TODO: check store dispatch

      // Should render the modals
      expect(spyRenderShareModal).toHaveBeenCalledTimes(1);
      expect(spyRenderModal).toHaveBeenCalledTimes(2);

      expect(spyData).toHaveBeenCalledTimes(1);

      expect(testInstance.state.type).toBe('text/plain')
      expect(testInstance.state.url).toBe('https://www.telegraaf.nl')
      expect(testInstance.state.documentHtml).toBe('')
      expect(testInstance.state.isLoading).toBe(false)
      expect(testInstance.state.errorMessage).toBe('')
    });

    it('should correctly process the share data when receiving a URL hidden inside a text', async () => {
      const testInstance: ShareOverlay = wrapper;

      // Do not animate in our tests
      const spyRenderModal = jest.spyOn(testInstance, 'renderModal').mockReturnValueOnce(null)
      const spyRenderShareModal = jest.spyOn(testInstance, 'renderShareModal').mockReturnValueOnce(undefined)
      const spyAnimateIn = jest.spyOn(testInstance, 'animateIn').mockResolvedValueOnce()

      // Just assume we are logged in and have a token
      const spyGetToken = jest.spyOn(KeychainHelper, 'getToken').mockResolvedValueOnce('testtoken')

      const spyData = jest.spyOn(ShareExtension, 'data').mockResolvedValueOnce({
        type: 'text/plain',
        value: 'some text with a https://link.in.it'
      })

      // Should start in loading state
      expect(testInstance.state.isLoading).toBe(true)

      await testInstance.setup()

      expect(spyAnimateIn).toHaveBeenCalledTimes(1);
      expect(spyGetToken).toHaveBeenCalledTimes(1);

      // TODO: check store dispatch

      // Should render the modals
      expect(spyRenderShareModal).toHaveBeenCalledTimes(1);
      expect(spyRenderModal).toHaveBeenCalledTimes(2);

      expect(spyData).toHaveBeenCalledTimes(1);

      expect(testInstance.state.type).toBe('text/plain')
      expect(testInstance.state.url).toBe('https://link.in.it')
      expect(testInstance.state.documentHtml).toBe('')
      expect(testInstance.state.isLoading).toBe(false)
      expect(testInstance.state.errorMessage).toBe('')
    });

    it('should correctly process the share data when receiving a JSON string', async () => {
      const testInstance: ShareOverlay = wrapper;

      // Do not animate in our tests
      const spyRenderModal = jest.spyOn(testInstance, 'renderModal').mockReturnValueOnce(null)
      const spyRenderShareModal = jest.spyOn(testInstance, 'renderShareModal').mockReturnValueOnce(undefined)
      const spyAnimateIn = jest.spyOn(testInstance, 'animateIn').mockResolvedValueOnce()

      // Just assume we are logged in and have a token
      const spyGetToken = jest.spyOn(KeychainHelper, 'getToken').mockResolvedValueOnce('testtoken')

      const spyData = jest.spyOn(ShareExtension, 'data').mockResolvedValueOnce({
        type: 'text/json',
        value: '{ "html": "<html><body><p>test</p></body></html>", "url": "https://some.url.com" }'
      })

      // Should start in loading state
      expect(testInstance.state.isLoading).toBe(true)

      await testInstance.setup()

      expect(spyAnimateIn).toHaveBeenCalledTimes(1);
      expect(spyGetToken).toHaveBeenCalledTimes(1);

      // TODO: check store dispatch

      // Should render the modals
      expect(spyRenderShareModal).toHaveBeenCalledTimes(1);
      expect(spyRenderModal).toHaveBeenCalledTimes(2);

      expect(spyData).toHaveBeenCalledTimes(1);

      expect(testInstance.state.type).toBe('text/json')
      expect(testInstance.state.url).toBe('https://some.url.com')
      expect(testInstance.state.documentHtml).toBe('<html><body><p>test</p></body></html>')
      expect(testInstance.state.isLoading).toBe(false)
      expect(testInstance.state.errorMessage).toBe('')
    });

    it('should render an error message when an error happens during setup()', async () => {
      const testInstance: ShareOverlay = wrapper;

      // Do not animate in our tests
      const spyRenderModal = jest.spyOn(testInstance, 'renderModal').mockReturnValueOnce(null)
      const spyRenderErrorMessageModal = jest.spyOn(testInstance, 'renderErrorMessageModal').mockReturnValueOnce(null)
      const spyAnimateIn = jest.spyOn(testInstance, 'animateIn').mockResolvedValueOnce()

      // Just assume we are logged in and have a token
      const spyGetToken = jest.spyOn(KeychainHelper, 'getToken').mockRejectedValueOnce(new Error('Some test error'))

      // Should start in loading state
      expect(testInstance.state.isLoading).toBe(true)

      await testInstance.setup()

      expect(spyAnimateIn).toHaveBeenCalledTimes(1);
      expect(spyGetToken).toHaveBeenCalledTimes(1);

      // TODO: check store dispatch

      // Should render the modals
      expect(spyRenderModal).toHaveBeenCalledTimes(2);
      expect(spyRenderErrorMessageModal).toHaveBeenCalledTimes(1);

      expect(testInstance.state.type).toBe('')
      expect(testInstance.state.url).toBe('')
      expect(testInstance.state.documentHtml).toBe('')
      expect(testInstance.state.isLoading).toBe(false)
      expect(testInstance.state.errorMessage).toBe('Some test error')
    });

    it('should close the share extension when calling closeOverlay()', async () => {
      const testInstance: ShareOverlay = wrapper;

      // Do not animate in our tests
      const spyAnimateOut = jest.spyOn(testInstance, 'animateOut').mockResolvedValueOnce()

      const spyShareExtensionClose = jest.spyOn(ShareExtension, 'close').mockResolvedValueOnce(null)

      await testInstance.closeOverlay()

      expect(spyAnimateOut).toHaveBeenCalledTimes(1);
      expect(spyShareExtensionClose).toHaveBeenCalledTimes(1);

    });
  });
});
