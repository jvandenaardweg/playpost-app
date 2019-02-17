import React from 'react';
import { Animated, View, Modal } from 'react-native';
import ShareExtension from 'react-native-share-extension';
import { ShareModal } from '@/components/ShareModal';

export default class Share extends React.Component {
  state = {
    isOpen: true,
    type: null,
    value: null,
    opacityAnim: new Animated.Value(0)
  }

  async componentDidMount() {
    try {
      const { opacityAnim } = this.state;

      // Wait for the extension data
      const { type, value } = await ShareExtension.data();

      // Start fade in animation
      Animated.timing(
        opacityAnim,
        {
          toValue: 1,
          duration: 300,
        }
      ).start();

      this.setState({ type, value });
    } catch (e) {
      /* eslint-disable no-alert */
      // alert('An error occurred. Please try again.');
      /* eslint-disable no-console */
      console.log('errrr', e);
    }
  }

  onClose = () => ShareExtension.close()

  closing = () => {
    const { opacityAnim } = this.state;

    this.setState({ isOpen: false });

    Animated.timing(
      opacityAnim,
      {
        toValue: 0,
        duration: 200,
      }
    ).start();
  }

  render() {
    const {
      opacityAnim, isOpen, value, type
    } = this.state;

    return (
      <Animated.View style={{
        flex: 1,
        opacity: opacityAnim,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)'
      }}
      >
        <Modal
          animationType="slide"
          presentationStyle="overFullScreen"
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
            {type && value && (
              <ShareModal
                type={type}
                url={value}
                onPressSave={this.closing}
                onPressCancel={this.closing}
              />
            )}
          </View>
        </Modal>
      </Animated.View>
    );
  }
}
