import React from 'react';
import { Animated, Modal, View } from 'react-native';
import ShareExtension from 'react-native-share-extension';

import { ErrorModal } from '../../components/ErrorModal';
import { ShareModalContainer } from '../../containers/ShareModalContainer';

import styles from './styles';

interface ShareData { type: ShareExtensionType; value: ShareExtensionValue }

interface DocumentData {
  url: string;
  html: string;
  title: string;
}

type ShareExtensionDocumentHtml = string | undefined;
type ShareExtensionUrl = string | undefined;
type ShareExtensionType = string | undefined;
type ShareExtensionValue = string | undefined;

interface State {
  isOpen: boolean;
  isLoading: boolean;
  type: ShareExtensionType;
  url: ShareExtensionUrl;
  documentHtml: ShareExtensionDocumentHtml;
  errorMessage: string;
  warningMessage: string;
}

interface Props {
  animationDuration?: number;
}

export class ShareOverlay extends React.PureComponent<Props, State> {

  static defaultProps = {
    animationDuration: 200
  };

  state = {
    isOpen: true,
    isLoading: true,
    type: '',
    url: '',
    documentHtml: undefined,
    errorMessage: '',
    warningMessage: ''
  };

  opacityAnim = new Animated.Value(0);

  componentDidMount(): void {
    this.setup();
  }

  animateIn = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      Animated.timing(this.opacityAnim, {
        toValue: 1,
        duration: this.props.animationDuration,
        useNativeDriver: true
      }).start(() => resolve());
    })
  }

  animateOut = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      Animated.timing(this.opacityAnim, {
        toValue: 0,
        duration: this.props.animationDuration,
        useNativeDriver: true
      }).start(() => resolve());
    })
  }

  getShareData = (): Promise<ShareData> => {
    return new Promise(async (resolve, reject) => {
      const shareData: ShareData = await ShareExtension.data();
      resolve(shareData);
    })
  }

  setup = async () => {
    try {
      // First, wait for the animation IN to be finished
      // It seems on Android we need this delay on order for the ShareExtension data to come in. So don't remove that delay.
      await this.animateIn();

      const { type, value }: { type: ShareExtensionType; value: ShareExtensionValue } = await this.getShareData();

      let documentHtml: ShareExtensionDocumentHtml;
      let url: ShareExtensionUrl;

      if (!value) { throw new Error('Did not receive anything to share to Playpost. Please try again.'); }

      // If we have text/json, we probably have the documentHtml and url
      if (type === 'text/json') {
        const documentData = JSON.parse(value) as DocumentData;

        if (documentData.html) { documentHtml = documentData.html; }
        if (documentData.url) { url = documentData.url; }
      } else {
        // It could be possible some app shares the URL with text, like: "This is an example article https://link.com/12312"
        // In that case, we want to get: https://link.com/12312
        const urlMatchesInText = value.match(/\bhttps?:\/\/\S+/gi);
        const urlFromText = urlMatchesInText && urlMatchesInText.length ? urlMatchesInText[0] : '';

        url = urlFromText || value;
      }

      // Update the state so our modal can pick up the URL
      this.setState({ type, url, documentHtml, errorMessage: '' });
    } catch (err) {
      const errorMessage = err.message ? err.message : 'An unknown error happened. Please try again.';
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

  render(): JSX.Element {
    return <Animated.View style={[styles.container, { opacity: this.opacityAnim }]}>{this.renderModal()}</Animated.View>;
  }
}
