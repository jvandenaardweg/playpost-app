import React from 'react';
import { Animated, View, Modal } from 'react-native';
import ShareExtension from 'react-native-share-extension';

import { ShareModal } from '../../components/ShareModal';
import { ErrorModal } from '../../components/ErrorModal';

import styles from './styles';

interface State {
  isOpen: boolean;
  isLoading: boolean;
  type: string | null;
  url: string | null;
  opacityAnim: Animated.Value;
  errorMessage: string | null;
  errorAction: string | null;
}

interface Props {
  animationDuration?: number;
}

export class ShareOverlay extends React.PureComponent<Props, State> {
  state = {
    isOpen: true,
    isLoading: true,
    type: null,
    url: null,
    opacityAnim: new Animated.Value(0),
    errorMessage: null,
    errorAction: null
  };

  static defaultProps = {
    animationDuration: 200
  };

  async componentDidMount() {
    try {
      const { opacityAnim } = this.state;

      // Start fade in animation of the overlay
      Animated.timing(
        opacityAnim,
        {
          toValue: 1,
          duration: 300,
        }
      ).start();

      // Wait for the extension data
      const { type, value } = await ShareExtension.data();
      const url = value;

      // Update the state so our modal can pick up the URL
      return this.setState({ type, url });

    } catch (err) {
      const errorMessage = (err.message) ? err.message : 'An unknown error happened. Please try again.';
      return this.setState({ errorMessage });
    } finally {
      return this.setState({ isLoading: false });
    }
  }

  closeOverlay = () => {
    const { opacityAnim } = this.state;
    const { animationDuration } = this.props;

    this.setState({ isOpen: false }, () => {
      // Use a simple timeout so the animation is done nicely
      setTimeout(
        () => {
          Animated.timing(
            opacityAnim,
            {
              toValue: 0,
              duration: animationDuration,
            }
          ).start(() => {
            // Close the share extension after our animation
            ShareExtension.close();
          });
        },
        animationDuration
      );
    });
  }

  openUrl = async (url: string) => {
    try {
      // const supported = await Linking.canOpenURL(url);

      // if (!supported) return console.log(`Can't handle url: ${url}`);

      return ShareExtension.openURL(url);
    } catch (err) {
      const errorMessage = (err.message) ? err.message : 'An unknown error happened while opening the app. Please try again.';
      return this.setState({ errorMessage });
    }
  }

  handleOnPressSave = () => this.closeOverlay();

  handleOnPressClose = () =>  this.closeOverlay();

  handleOnModalDissmiss = () => this.closeOverlay();

  handleOnPressAction = (url: string) => this.openUrl(url);

  renderErrorMessageModal() {
    const { errorMessage, errorAction } = this.state;
    if (!errorMessage) return;

    return (<ErrorModal message={errorMessage} action={errorAction} onPressAction={this.handleOnPressAction} />);
  }

  renderShareModal() {
    const { type, url, errorMessage } = this.state;
    if (errorMessage) return;

    return (<ShareModal type={type} url={url} onPressSave={this.handleOnPressSave} onPressClose={this.handleOnPressClose} />);
  }

  renderModal() {
    const { isLoading, isOpen } = this.state;

    if (!isLoading) {
      return (
        <Modal
          animationType="slide"
          presentationStyle="overFullScreen"
          supportedOrientations={['portrait', 'landscape']}
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
  }

  render() {
    const { opacityAnim } = this.state;

    return (
      <Animated.View style={[styles.container, { opacity: opacityAnim }]}>
        {this.renderModal()}
      </Animated.View>
    );
  }
}
