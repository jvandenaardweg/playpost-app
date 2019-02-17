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
      const { type, value } = await ShareExtension.data();

      Animated.timing(
        this.state.opacityAnim,
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
      alert('An error occurred. Please try again.');
      console.log('errrr', e);
    }
  }

  onClose = () => ShareExtension.close()

  closing = () => {
    this.setState({ isOpen: false });
    Animated.timing(
      this.state.opacityAnim,
      {
        toValue: 0,
        duration: 200,
      }
    ).start();
  }

  render() {
    const { opacityAnim } = this.state;

    return (
      <Animated.View style={{
        flex: 1, opacity: opacityAnim, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)'
      }}
      >
        <Modal animationType="slide" presentationStyle="overFullScreen" transparent visible={this.state.isOpen} onDismiss={this.onClose}>
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
                  { this.state.type }
                </Text>
                <Text>
value:
                  { this.state.value }
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
