import React from 'react';
import { Animated, Modal, View } from 'react-native';
import ShareExtension from 'react-native-share-extension';
import analytics from '@react-native-firebase/analytics';

import { setAuthToken } from '../../reducers/auth';
import { store } from '../../store';
import * as keychain from '../../utils/keychain';

import { ErrorModal } from '../../components/ErrorModal';
import { ShareModalContainer } from '../../containers/ShareModalContainer';

import styles from './styles';

interface ShareData { type: string; value: string }

interface DocumentData {
  url: string;
  html: string;
  title: string;
}

interface State {
  isOpen: boolean;
  isLoading: boolean;
  type: string;
  url: string;
  documentHtml: string;
  errorMessage: string;
  warningMessage: string;
}

export class ShareOverlay extends React.PureComponent<{}, State> {
  state = {
    isOpen: true,
    isLoading: true,
    type: '',
    url: '',
    documentHtml: '',
    errorMessage: '',
    warningMessage: ''
  };

  opacityAnim = new Animated.Value(0);
  animationDuration = 200;

  async componentDidMount() {
    this.setup();
  }

  animateIn = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      Animated.timing(this.opacityAnim, {
        toValue: 1,
        duration: this.animationDuration,
        useNativeDriver: true
      }).start(() => resolve());
    })
  }

  animateOut = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      Animated.timing(this.opacityAnim, {
        toValue: 0,
        duration: this.animationDuration,
        useNativeDriver: true
      }).start(() => resolve());
    })
  }

  setAuthToken = (token: string) => store.dispatch(setAuthToken(token));

  setup = async () => {
    try {
      // First, wait for the animation IN to be finished
      // It seems on Android we need this delay on order for the ShareExtension data to come in. So don't remove that delay.
      await this.animateIn()

      // Run all promises in parallel, which is faster
      const [token, shareData] = await Promise.all([
        await keychain.getToken(),
        await ShareExtension.data()
      ]);

      if (token) {
        // Store the token in Redux, so we can determine if a user is logged in or not
        this.setAuthToken(token);
      }

      const { type, value }: ShareData = shareData;

      let documentHtml = '';
      let url = '';

      if (!value) {
        throw new Error('Did not receive anything to share to Playpost. Please try again.');
      }

      // If we have text/json, we probably have the documentHtml and url
      if (type === 'text/json') {
        const documentData = JSON.parse(value) as DocumentData;

        if (documentData.html) { documentHtml = documentData.html; }
        if (documentData.url) { url = documentData.url; }
      } else {
        // It could be possible some app shares the URL with text, like: "This is an example article https://link.com/12312"
        // In that case, we want to get: https://link.com/12312
        const urlMatchesInText = value.match(/\bhttp(s)?:\/\/\S+/gi);
        const urlFromText = urlMatchesInText && urlMatchesInText.length ? urlMatchesInText[0] : '';

        url = urlFromText || value;
      }

      // Update the state so our modal can pick up the URL
      this.setState({ type, url, documentHtml, errorMessage: '' });
    } catch (err) {
      const errorMessage = err.message ? err.message : 'An unknown error happened. Please try again.';
      await analytics().logEvent('share_error', { errorMessage });
      this.setState({ errorMessage });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  closeOverlay = async () => {
    this.setState({ isOpen: false });

    await this.animateOut();

    ShareExtension.close();
  }

  handleOnPressSave = () => this.closeOverlay();

  handleOnPressClose = () => this.closeOverlay();

  handleOnModalDissmiss = () => this.closeOverlay();

  renderErrorMessageModal(): JSX.Element | null {
    const { errorMessage } = this.state;
    if (!errorMessage) { return null; }

    return <ErrorModal message={errorMessage} onPressClose={this.handleOnPressClose} />;
  }

  renderShareModal(): JSX.Element | undefined {
    const { url, errorMessage, documentHtml } = this.state;
    if (errorMessage) { return; }

    return <ShareModalContainer url={url} documentHtml={documentHtml} onPressSave={this.handleOnPressSave} onPressClose={this.handleOnPressClose} />;
  }

  renderModal(): JSX.Element | null {
    const { isLoading, isOpen } = this.state;

    if (isLoading) { return null; }

    return (
      <Modal
        animationType="slide"
        presentationStyle="overFullScreen"
        supportedOrientations={['portrait', 'landscape']}
        // For this share extension the debugger will tell you:
        // ExceptionsManager.js:82 Modal was presented with 0x2 orientations mask but the application only supports 0x0.Add more interface orientations to your app's Info.plist to fix this.
        // NOTE: This will crash in non-dev mode
        // Fun thing; this will NOT crash. You can ignore that error message
        // It's related to the modal being active in a share extension: https://github.com/facebook/react-native/issues/13951#issuecomment-339395236
        transparent
        visible={isOpen}
        onDismiss={this.handleOnModalDissmiss}
      >
        <View style={styles.modalContainer}>
          {this.renderErrorMessageModal()}
          {this.renderShareModal()}
        </View>
      </Modal>
    );
  }

  render() {
    return <Animated.View style={[styles.container, { opacity: this.opacityAnim }]}>{this.renderModal()}</Animated.View>;
  }
}
