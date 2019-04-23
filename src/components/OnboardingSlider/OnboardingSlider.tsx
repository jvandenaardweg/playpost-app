import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import AppIntroSlider from 'react-native-app-intro-slider';
import { withNavigation, NavigationScreenProp, NavigationRoute } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';

import styles from './styles';
import Icon from 'react-native-vector-icons/Feather';

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
      key: 'slide0',
      title: 'Instant podcasts of every article',
      text: 'Turn every article on the web into audio using industry leading high quality voices. So you can listen to it just like Podcasts and Audiobooks.',
      image: require('../../assets/images/logo-1024.png'),
    },
    {
      key: 'slide1',
      title: 'Listen on the go',
      text: 'Listen to articles during your daily commute to work, or when doing other tasks. Just put in your earphones and press play.',
    },
    {
      key: 'slide2',
      title: 'High quality voices',
      text: 'Industry leading high quality voices are used to automatically transform text into speech.\n\nChoose between a variety of high quality male and female voices with accents like American, British or Australian English.',
    },
    {
      key: 'slide3',
      title: 'Create your own playlist',
      text: 'A share button is added in every app on your phone to share articles to your playlist.\n\nJust open your article and press share.',
    },
    {
      key: 'slide4',
      title: 'Advanced speech optimization',
      text: 'The article’s text is optimized to be spoken to you. Correct pauses and emphasis are added for easy listening.',
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
          showPrevButton
          renderNextButton={() => <Icon name="arrow-right" color="white" size={24} />}
          renderPrevButton={() => <Icon name="arrow-left" color="white" size={24} />}
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
