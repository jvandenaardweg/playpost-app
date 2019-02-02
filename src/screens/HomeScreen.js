import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ProjectCard } from '../components/ProjectCard'

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    linkedInAccessToken: null,
    linkedInAccessTokenExpiresIn: null,
    isLoggedIn: false,
    isLoading: false,
    user: {}
  }

  componentDidMount () {
    this._bootstrapAsync()
  }

  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    console.log('userToken', userToken)

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    // this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  handleOnPressContinue = (event) => {
    console.log('continue')
  }

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

    this.setState({
      user: {
        id: result.id,
        firstName: result.firstName,
        headline: result.headline,
        url: result.siteStandardProfileRequest.url
      },
      isLoggedIn: true,
      isLoading: false
    })
}

  render() {
    const { user: { firstName, headline, id, lastName, url }, isLoggedIn, isLoading } = this.state

    return (
      <View style={styles.container}>

        <View style={styles.getStartedContainer}>

          <Text>Projects from organizations i follow</Text>
          <Text>How many new projects for my skills? (since i was gone?)</Text>
          <Text>Set availability</Text>

          {isLoading && (
            <ActivityIndicator size="large" color="#0000ff" />
          )}

        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
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
