import React, { Component } from 'react'
import ShareExtension from 'react-native-share-extension'

import {
  Text,
  View,
  TouchableOpacity,
  Modal
} from 'react-native'

export default class Share extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      isOpen: true,
      type: '',
      value: ''
    }
  }

  async componentDidMount() {
    try {
      const { type, value } = await ShareExtension.data()
      this.setState({
        type,
        value
      })
    } catch(e) {
      console.log('errrr', e)
    }
  }

  onClose = () => ShareExtension.close()

  closing = () => this.setState({ isOpen: false });

  render() {
    return (
      <Modal animationType="slide" presentationStyle="formSheet" transparent={false} visible={this.state.isOpen}>
        <View style={{ backgroundColor:'deeppink', alignItems: 'center', justifyContent:'center', flex: 1 }}>
          <View style={{ borderColor: 'green', borderWidth: 1, backgroundColor: 'white', height: 200, width: 300 }}>
            <TouchableOpacity onPress={this.closing}>
              <Text>Close</Text>
              <Text>type: { this.state.type }</Text>
              <Text>value: { this.state.value }</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}
