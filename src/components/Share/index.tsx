import React from 'react';
import { Animated, View, Modal } from 'react-native';
import ShareExtension from 'react-native-share-extension';

import { ShareModal } from '../../components/ShareModal';
import { ErrorModal } from '../../components/ErrorModal';

interface State {
  isOpen: boolean;
  isLoading: boolean;
  type: string;
  value: string;
  opacityAnim: Animated.Value;
  errorMessage: string;
  errorAction: string;
}

export class Share extends React.PureComponent<State> {
  state = {
    isOpen: true,
    isLoading: true,
    type: '',
    value: '',
    opacityAnim: new Animated.Value(0),
    errorMessage: '',
    errorAction: ''
  };

  async componentDidMount() {
    try {
      const { opacityAnim } = this.state;

      // Start fade in animation
      Animated.timing(
        opacityAnim,
        {
          toValue: 1,
          duration: 300,
        }
      ).start();

      // Wait for the extension data
      const { type, value } = await ShareExtension.data();

      return this.setState({ type, value, isLoading: false });

    } catch (e) {
      /* eslint-disable no-alert */
      // alert('An error occurred. Please try again.');
      /* eslint-disable no-console */
      this.setState({ isLoading: false });
      return console.log('errrr', e);
    }
  }

  onClose = () => ShareExtension.close();

  closing = () => {
    const { opacityAnim } = this.state;
    const animationDuration = 200;

    this.setState({ isOpen: false });

    // Use a simple timeout so the animation is done nicely
    setTimeout(
      () => {
        Animated.timing(
          opacityAnim,
          {
            toValue: 0,
            duration: animationDuration,
          }
        ).start();
      },
      animationDuration
    );
  }

  openUrl = async (url: string) => {
    try {
      // const supported = await Linking.canOpenURL(url);

      // if (!supported) return console.log(`Can't handle url: ${url}`);

      return ShareExtension.openURL(url);
    } catch (err) {
      return console.error('An error occurred while opening the url', err);
    }
  }

  renderErrorMessage() {
    const { errorMessage, errorAction } = this.state;
    if (!errorMessage) return;

    return (<ErrorModal message={errorMessage} action={errorAction} onPressAction={this.openUrl} />);
  }

  renderShareModal() {
    const { type, value, errorMessage } = this.state;
    if (errorMessage) return;

    return (<ShareModal type={type} url={value} onPressSave={this.closing} onPressClose={this.closing} />);
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
          onDismiss={this.onClose}
        >
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24
          }}
          >
            {this.renderErrorMessage()}
            {this.renderShareModal()}
          </View>
        </Modal>
      );
    }
  }

  render() {
    const { opacityAnim } = this.state;

    return (
      <Animated.View style={{
        flex: 1,
        opacity: opacityAnim,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)'
      }}
      >
        {this.renderModal()}
      </Animated.View>
    );
  }
}
