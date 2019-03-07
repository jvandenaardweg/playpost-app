import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import AppIntroSlider from 'react-native-app-intro-slider';
import { withNavigation } from 'react-navigation';

import styles from './styles';

const slides = [
  {
    key: 'slide1',
    title: 'Listen to articles',
    text: 'Listen to articles when you got no time to read, but do got time to listen. Let the app read the articles to you.',
  },
  {
    key: 'slide2',
    title: 'Make the listening experience your own',
    text: 'Choose between a variaty of High Quality life-like voices with different accents like American English, British English or Australian English.',
  },
  {
    key: 'slide3',
    title: 'Easily save from every app',
    text: 'A share icon is added in every app on your phone so you can easily add new articles. Just click the Share icon and add [App name].',
  },
];

class OnboardingSliderComponent extends React.PureComponent {
  static displayName = 'OnboardingSlider'

  renderItem = props => <OnboardingSlide {...props} navigation={this.props.navigation} />;

  render() {
    return (
      <View style={styles.container}>
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
        width: props.width,
        height: props.height,
      },
    ]}
  >
    <View>
      <Text testID="OnboardingScreen-title" style={styles.title}>{props.title}</Text>
      <Text testID="OnboardingScreen-text" style={styles.text}>{props.text}</Text>
    </View>
  </View>
);

export const OnboardingSlider = withNavigation(OnboardingSliderComponent);
