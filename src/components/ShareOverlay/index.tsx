import React from 'react';
import { Animated, View, Modal } from 'react-native';
import ShareExtension from 'react-native-share-extension';

import { ErrorModal } from '../../components/ErrorModal';
import { ShareModalContainer } from '../../containers/ShareModalContainer';

import styles from './styles';

type DocumentData = {
  url: string;
  html: string;
  title: string;
};

interface State {
  isOpen: boolean;
  isLoading: boolean;
  type: string | undefined;
  url: string | undefined;
  documentHtml: string | undefined;
  errorMessage: string;
  warningMessage: string;
  errorAction: string;
}

interface Props {
  animationDuration?: number;
}

export class ShareOverlay extends React.PureComponent<Props, State> {
  state = {
    isOpen: true,
    isLoading: true,
    type: '',
    url: '',
    documentHtml: '',
    errorMessage: '',
    warningMessage: '',
    errorAction: ''
  };

  static defaultProps = {
    animationDuration: 200
  };

  opacityAnim = new Animated.Value(0);

  componentDidMount() {
    this.setup();
  }

  setup = async () => {
    try {
      // Start fade in animation of the overlay
      Animated.timing(this.opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();

      // Wait for the extension data
      const { type, value }: { type: string; value: string } = await ShareExtension.data();

      let documentHtml: string = '';
      let url: string = '';

      // If we have text/json, we probably have the documentHtml and url
      if (type === 'text/json') {
        const documentData = JSON.parse(value) as DocumentData;

        if (documentData.html) documentHtml = documentData.html;
        if (documentData.url) url = documentData.url;
      } else {
        // It could be possible some app shares the URL with text, like: "This is an example article https://link.com/12312"
        // In that case, we want to get: https://link.com/12312
        const urlMatchesInText = value.match(/\bhttps?:\/\/\S+/gi);
        const urlFromText = urlMatchesInText && urlMatchesInText.length ? urlMatchesInText[0] : '';

        url = urlFromText || value;
      }

      console.log('Using to share:', url, documentHtml);

      // Update the state so our modal can pick up the URL
      return this.setState({ type, url, documentHtml, errorMessage: '' });
    } catch (err) {
      const errorMessage = err.message ? err.message : 'An unknown error happened. Please try again.';
      return this.setState({ errorMessage });
    } finally {
      return this.setState({ isLoading: false });
    }
  }

  closeOverlay = () => {
    const { animationDuration } = this.props;

    this.setState({ isOpen: false }, () => {
      // Use a simple timeout so the animation is done nicely
      setTimeout(() => {
        Animated.timing(this.opacityAnim, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true
        }).start(() => {
          // Close the share extension after our animation
          ShareExtension.close();
        });
      }, animationDuration);
    });
  }

  openUrlInMainApp = async (url: string) => {
    try {
      return ShareExtension.openURL(url);
    } catch (err) {
      const errorMessage = err.message ? err.message : 'An unknown error happened while opening the app. Please try again.';
      return this.setState({ errorMessage });
    }
  }

  handleOnPressSave = () => this.closeOverlay();

  handleOnPressClose = () => this.closeOverlay();

  handleOnModalDissmiss = () => this.closeOverlay();

  handleOnPressAction = (url: string) => this.openUrlInMainApp(url);

  renderErrorMessageModal() {
    const { errorMessage, errorAction } = this.state;
    if (!errorMessage) return;

    return <ErrorModal message={errorMessage} action={errorAction} onPressAction={this.handleOnPressAction} />;
  }

  renderShareModal() {
    const { url, errorMessage, documentHtml } = this.state;
    if (errorMessage) return;

    return <ShareModalContainer url={url} documentHtml={documentHtml} onPressSave={this.handleOnPressSave} onPressClose={this.handleOnPressClose} />;
  }

  renderModal() {
    const { isLoading, isOpen } = this.state;

    if (isLoading) return null;

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
