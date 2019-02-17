import React from 'react';
import {
  Animated, Text, View, TouchableOpacity, Modal
} from 'react-native';
import ShareExtension from 'react-native-share-extension';

export default class Share extends React.Component {
  state = {
    isOpen: true,
    type: '',
    value: '',
    opacityAnim: new Animated.Value(0)
  }

  async componentDidMount() {
    try {
      const { opacityAnim } = this.state;
      const { type, value } = await ShareExtension.data();

      Animated.timing(
        opacityAnim,
        {
          toValue: 1,
          duration: 300,
        }
      ).start();

      this.setState({
        type,
        value
      });
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
      opacityAnim, isOpen, type, value
    } = this.state;

    return (
      <Animated.View style={{
        flex: 1, opacity: opacityAnim, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)'
      }}
      >
        <Modal animationType="slide" presentationStyle="overFullScreen" transparent visible={isOpen} onDismiss={this.onClose}>
          <View style={{
            flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24
          }}
          >
            <View style={{
              backgroundColor: 'white', width: '100%', height: 200, padding: 14, borderRadius: 10
            }}
            >

              <View>Article sh</View>

              <TouchableOpacity onPress={this.closing}>
                <Text>
                  type:
                  { type }
                </Text>
                <Text>
                  value:
                  { value }
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={this.closing}>
                <Text>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={this.closing}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Animated.View>
    );
  }
}
