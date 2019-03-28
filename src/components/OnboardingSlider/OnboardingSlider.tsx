import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import AppIntroSlider from 'react-native-app-intro-slider';
import { withNavigation, NavigationScreenProp, NavigationRoute } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';

import styles from './styles';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

interface OnboardingSlideProps {
  topSpacer: number;
  width: number;
  height: number;
  title: string;
  text: string;
}

class OnboardingSliderComponent extends React.PureComponent<Props> {

  slides = [
    {
      key: 'slide1',
      title: 'Listen to articles',
      text: 'Just listen to articles when you got no time to read. Let the app read the articles to you.\n\nArticles from the web are converted to spoken words using a pleasant voice.',
    },
    {
      key: 'slide2',
      title: 'Make the listening experience your own',
      text: 'Choose between a variaty of High Quality life-like voices with different accents like American English, British English or Australian English.\n\nAvailable using a subscription.',
    },
    {
      key: 'slide3',
      title: 'Easily save from every app',
      text: 'A share icon is added in every app on your phone so you can easily add new articles.\n\nJust click the share icon to add an article to your playlist.',
    },
  ];

  componentDidMount() {
    SplashScreen.hide();
  }

  renderItem = (props: OnboardingSlideProps) => <OnboardingSlide {...props} />;

  render() {
    return (
      <View style={styles.container}>
        <AppIntroSlider
          testID="OnboardingScreen-slider"
          slides={this.slides}
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

const OnboardingSlide = (props: OnboardingSlideProps) => (
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
