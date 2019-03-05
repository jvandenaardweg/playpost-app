import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import AppIntroSlider from 'react-native-app-intro-slider';

const slides = [
  {
    key: 'somethun',
    title: 'Listen to articles',
    text:
      'Listen to articles when you got no time to read, but do got time to listen. Let the app read the articles to you.',
    icon: 'ios-images',
    colors: ['#63E2FF', '#B066FE'],
  },
  {
    key: 'somethun1',
    title: 'Make the listening experience your own',
    text:
      'Choose between a variaty of High Quality life-like voices with different accents like American English, British English or Australian English.',
    icon: 'ios-options',
    colors: ['#A3A1FF', '#3A3897'],
  },
  {
    key: 'somethun2',
    title: 'Easily save from every app',
    text: 'A share icon is added in every app on your phone so you can easily add new articles. Just click the Share icon and add [App name].',
    icon: 'ios-beer',
    colors: ['#29ABE2', '#4F00BC'],
  },
];

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#037DE2',
    padding: 14,
    paddingTop: 0,
    paddingBottom: '27%'
  },
  image: {
    width: 320,
    height: 320,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
    fontFamily: 'Merriweather-Regular'
  },
});

export class OnboardingScreen extends React.PureComponent {
  static navigationOptions = {
    title: 'Introduction',
    header: null
  };

  renderItem = props => <OnboardingSlide {...props} navigation={this.props.navigation} />;

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#037DE2' }}>
        <AppIntroSlider
          testID="OnboardingScreen-slider"
          slides={slides}
          renderItem={this.renderItem}
          hidePrevButton
          hideSkipButton
          hideNextButton
          hideDoneButton
        />
        <View style={{ marginBottom: 22, paddingLeft: 14, paddingRight: 14 }}>
          <Button title="Create account" onPress={() => this.props.navigation.navigate('Signup')} buttonStyle={{ backgroundColor: 'white', marginBottom: 4 }} titleStyle={{ color: 'black' }} />
          <Button title="I already have an account" type="clear" onPress={() => this.props.navigation.navigate('Login')} titleStyle={{ color: 'white', fontWeight: 'normal' }} />
        </View>
      </View>
    );
  }
}

const OnboardingSlide = (props) => (
  <View
    style={[
      styles.mainContent,
      {
        paddingTop: props.topSpacer,
        // paddingBottom: props.bottomSpacer,
        width: props.width,
        height: props.height,
      },
    ]}
  >
    {/* <Ionicons
      style={{ backgroundColor: 'transparent' }}
      name={props.icon}
      size={200}
      color="white"
    /> */}
    <View>
      <Text testID="OnboardingScreen-title" style={styles.title}>{props.title}</Text>
      <Text testID="OnboardingScreen-text" style={styles.text}>{props.text}</Text>
    </View>
  </View>
);
