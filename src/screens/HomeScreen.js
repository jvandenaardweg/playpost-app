import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  StyleSheet,
  Text,
  View,
  WebView,
  TextInput,
  Modal,
  TouchableOpacity
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5'


export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Home',
      headerRight: (
        <TouchableOpacity
          onPress={navigation.getParam('showModal')}
          style={{width: 40, height: 40, marginRight: 6, alignItems: 'center', justifyContent: 'center'}}
        >
          <Icon
            name='cog'
            size={22}
          />
        </TouchableOpacity>
      )
    }
  };

  state = {
    webviewUrl: "https://medium.com/me/list/queue",
    showModal: false,
    text: null,
    isLoading: false,
    bookmarks: []
  }

  componentDidMount() {
    this._bootstrapAsync()
    this.props.navigation.setParams({ showModal: this.handleOnModalShowPress });
  }

  _bootstrapAsync = async () => {
    // const userToken = await AsyncStorage.getItem('userToken');

    // console.log('userToken', userToken)
  };

  async getLinkedInUserProfile (accessToken) {
    const bearer = `Bearer ${accessToken}`
    const result = await fetch('https://api.linkedin.com/v1/people/~?format=json', {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Authorization': bearer,
        'x-li-format': 'json',
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
  }

  handleOnLoadEnd = (event) => {
    console.log('on load end', event)
  }

  handleOnMessage = (data) => {
    console.log('onmessage', data)

    if (!data) return;

    const bookmarks = data.split('[SPLIT]').map((bookmark) => JSON.parse(bookmark))

    if (bookmarks && bookmarks.length) {
      this.setState({bookmarks})
    }

  }

  handleOnButtonPress = (event) => {
    this.setState({webviewUrl: this.state.text})
  }

  handleOnModalShowPress = (event) => {
    this.setState({showModal: true})
  }

  handleOnModalClosePress = (event) => {
    this.setState({showModal: false})
  }

  render() {
    const { webviewUrl, showModal } = this.state;

    const jsCode = `
    (function() {
      var originalPostMessage = window.postMessage;
    
      var patchedPostMessage = function(message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer);
      };
    
      patchedPostMessage.toString = function() { 
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
      };

      window.postMessage = patchedPostMessage;

        var bookmarks = [];
        const bookmarkNodes = document.querySelectorAll('.streamItem--readingListPostItem.js-streamItem');

        if (bookmarkNodes && bookmarkNodes.length) {
          bookmarkNodes.forEach((node) => {
            const description = node.querySelector('p');
            const authorName = node.querySelector('[data-user-id]');
            const publicationName = node.querySelector('[data-action="show-collection-card"]');
  
            const bookmark = {
              link: node.querySelector('section > div > div > a').getAttribute('href'),
              title: node.querySelector('h3').textContent,
              description: (description) ? description.textContent : null,
              authorName: (authorName) ? authorName.textContent : null,
              publicationName: (publicationName) ? publicationName.textContent : null
            };
  
            // Make it a string so we can use it in our postMessage
            const stringifiedBookmark = JSON.stringify(bookmark);
  
            bookmarks.push(stringifiedBookmark);
          });
  
          const stringifiedBookmarks = bookmarks.join('[SPLIT]');
  
          window.postMessage(stringifiedBookmarks)
        }
    })();
    `;

    console.log('render', this.state)
    return (
      <View style={styles.container}>
        <Text style={styles.status}>Hoi!</Text>
        {this.state.bookmarks && this.state.bookmarks.map((bookmark, index) => (
          <Text key={index}>{bookmark.title}</Text>
        ))}
        <Button onPress={(this.handleOnButtonPress)} title="Test" />
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
        />

        <Modal
          animationType="slide"
          transparent={false}
          visible={showModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{marginTop: 40, flex: 1}}>
          <Button onPress={(this.handleOnModalClosePress)} title="Close Webview" />
            <WebView
              // style={{overflow: 'hidden'}}
              ref={ref => (this.webview = ref)}
              useWebkit={true}
              javaScriptEnabled={true}
              source={{ uri: webviewUrl }}
              // onLoadProgress={e => console.log(e.nativeEvent.progress)}
              // onLoadEnd={this.handleOnLoadEnd}
              onMessage={(event) => this.handleOnMessage(event.nativeEvent.data)}
              injectedJavaScript={jsCode}
            />
          </View>
        </Modal>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  status: {
    marginTop: 50,
    textAlign: 'center'
  },
  // webview: {
  //   marginTop: 100,
  //   marginLeft: 15,
  //   marginRight: 15,
  //   borderRadius: 10
  // },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 14
  },
  headline: {
    fontSize: 16,
    marginBottom: 24
  },
  container: {
    // flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
    alignItems: 'center'
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
    textAlign: 'center'
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  }
});
