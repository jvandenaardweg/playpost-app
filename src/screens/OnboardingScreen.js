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
    showButtons: false
  },
  {
    key: 'somethun1',
    title: 'Make the listening experience your own',
    text:
      'Choose between a variaty of High Quality life-like voices with different accents like American English, British English or Australian English.',
    icon: 'ios-options',
    colors: ['#A3A1FF', '#3A3897'],
    showButtons: false
  },
  {
    key: 'somethun2',
    title: 'Easily save from every app',
    text: 'A share icon is added in every app on your phone so you can easily add new articles. Just click the Share icon and add [App name].',
    icon: 'ios-beer',
    colors: ['#29ABE2', '#4F00BC'],
    showButtons: true
  },
];

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#037DE2',
    padding: 14
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
    lineHeight: 24
  },
  title: {
    fontSize: 28,
    lineHeight: 28,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600'
  },
});

export class OnboardingScreen extends React.PureComponent {
  static navigationOptions = {
    title: 'Onboarding',
    header: null
  };

  renderItem = props => <OnboardingSlide {...props} navigation={this.props.navigation} />;

  render() {
    return (
      <AppIntroSlider
        slides={slides}
        renderItem={this.renderItem}
        showPrevButton
        hideSkipButton
        showNextButton
        hideDoneButton
      />
    );
  }
}

const OnboardingSlide = (props) => (
  <View
    style={[
      styles.mainContent,
      {
        paddingTop: props.topSpacer,
        paddingBottom: props.bottomSpacer,
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
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.text}>{props.text}</Text>

      {props.showButtons && (
        <View>
          <Button title="Signup" onPress={() => props.navigation.navigate('Signup')} />
          <Button title="Login" onPress={() => props.navigation.navigate('Login')} />
        </View>
      )}
    </View>
  </View>
);
