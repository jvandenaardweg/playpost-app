import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import AppIntroSlider from 'react-native-app-intro-slider';
import { withNavigation, NavigationScreenProp, NavigationRoute } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';

import styles from './styles';
import * as Icon from '../../components/Icon';

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

const OnboardingSliderComponent: React.FC<Props> = React.memo(({
  navigation
}) => {
  const slides = [
    {
      key: 'slide0',
      title: 'Instant podcasts of every article',
      text: 'Turn every article on the web into audio using industry leading high quality voices. So you can listen to it just like Podcasts and Audiobooks.',
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

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  function renderItem(props: OnboardingSlideProps) {
    return <OnboardingSlide {...props} />;
  }

  return (
    <View style={styles.container} testID="onboarding-screen">
      <AppIntroSlider
        testID="onboarding-slider"
        slides={slides}
        renderItem={renderItem}
        showPrevButton
        renderNextButton={() => <Icon.Feather name="arrow-right" color="white" size={24} />}
        renderPrevButton={() => <Icon.Feather name="arrow-left" color="white" size={24} />}
        renderDoneButton={() => null}
      />
      <View style={styles.footerContainer}>
        <Button testID="onboarding-button-signup" title="Create account" onPress={() => navigation.navigate('Signup')} buttonStyle={styles.signupButtonStyle} titleStyle={styles.signupButtonTitleStyle} />
        <Button testID="onboarding-button-login" title="I already have an account" type="clear" onPress={() => navigation.navigate('Login')} titleStyle={styles.loginButtonTitleStyle} />
      </View>
    </View>
  );
});

const OnboardingSlide: React.FC<OnboardingSlideProps> = React.memo(({
  topSpacer,
  width,
  height,
  title,
  text
}) => (
  <View
    style={[
      styles.mainContent,
      {
        width,
        height,
        paddingTop: topSpacer
      },
    ]}
  >
    <View>
      <Text testID="onboarding-slider-item-title" style={styles.title}>{title}</Text>
      <Text testID="onboarding-slider-item-text" style={styles.text}>{text}</Text>
    </View>
  </View>
));

export const OnboardingSlider = withNavigation(OnboardingSliderComponent);
