import React, { useEffect, useRef } from 'react';
import { SafeAreaView, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Button, Image } from 'react-native-elements';
import SplashScreen from 'react-native-splash-screen';
import { NavigationRoute, NavigationScreenProp, withNavigation } from 'react-navigation';
import { Text } from '../Text';

import { TouchableOpacity } from 'react-native-gesture-handler';
import NavigationService from '../../navigation/NavigationService';
import styles from './styles';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

interface OnboardingSlideProps {
  item: {
    key: string;
    image: NodeRequire;
    title: string;
    text: string;
  };
  index: number;
  goToSlide(slideIndex: number): void;
}

const OnboardingSliderComponent: React.FC<Props> = React.memo(() => {
  const appIntroSliderRef = useRef<typeof AppIntroSlider>(null);

  const slides: Array<OnboardingSlideProps['item']> = [
    {
      key: 'slide0',
      image: require('../../assets/images/onboarding/voice-message.png'),
      title: 'Instant podcasts of every article',
      text: 'Playpost transforms every article on the web into audio using industry-leading high-quality voices. So you can listen to it just like Podcasts and Audiobooks.'
    },
    {
      key: 'slide1',
      image: require('../../assets/images/onboarding/share.png'),
      title: 'Easily save articles from every app',
      text: 'A share button is added to every app on your phone. So you can share articles from one app, to your Playpost playlist and listen to them instantly.',
    },
    {
      key: 'slide2',
      image: require('../../assets/images/onboarding/language.png'),
      title: '240+ naturally sounding voices in 28 languages',
      text: 'The most advanced text to speech synthesis solutions to speak text to you and sound natural and pleasant to listen to. Personalize the experience by.',
    },
    {
      key: 'last',
      image: require('../../assets/images/onboarding/devices.png'),
      title: 'Your playlist on every device with one account',
      text: 'Create your account and start creating your playlist. Save articles from your computer using our browser extensions.',
    }
  ];

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const goToSlide = (slideIndex: number) => appIntroSliderRef.current.goToSlide(slideIndex)

  function renderItem(props: OnboardingSlideProps) {
    return <OnboardingSlide {...props} goToSlide={goToSlide} />;
  }

  return (
    <View style={styles.container} testID="onboarding-screen">
      <View style={styles.sliderContainer}>
        <SafeAreaView style={styles.loginButtonContainer}>
          <Button
            title="Login"
            type="clear"
            testID="onboarding-button-login"
            titleStyle={styles.loginButtonTitleStyle}
            onPress={() => NavigationService.navigate('login')}
          />
        </SafeAreaView>
        <View style={{ flex: 1, paddingBottom: 35 }}>
          <View style={styles.skipButtonContainer}>
            <TouchableOpacity testID="onboarding-button-skip" onPress={() => appIntroSliderRef.current.goToSlide(slides.length - 1)}>
              <Text style={styles.skipButtonTitleStyle} preset="footnoteEmphasized">Skip</Text>
            </TouchableOpacity>
          </View>
          <AppIntroSlider
            ref={appIntroSliderRef}
            testID="onboarding-slider"
            slides={slides}
            renderItem={renderItem}
            showSkipButton={false}
            showNextButton={false}
            showPrevButton={false}
            showDoneButton={false}
            dotStyle={styles.appIntroSliderDotStyle}
            activeDotStyle={styles.appIntroSliderActiveDotStyle}
            paginationStyle={styles.appIntroSliderPaginationStyle}
          />
        </View>
      </View>
      <View style={styles.backgroundContainer}>
        <View style={styles.topContainer}>
          <Image
            source={require('../../assets/images/icon-pattern.png')}
            resizeMode="cover"
            containerStyle={styles.topContainerImage}
          />
        </View>
        <View style={styles.bottomContainer}>
          {/* placeholder */}
        </View>
      </View>
    </View>
  );
});

const OnboardingSlide: React.FC<OnboardingSlideProps> = React.memo(({
  item,
  index,
  goToSlide
}) => (
  <View style={styles.slideContainer} key={index}>
    <View style={styles.slideImageContainer}>
      <Image source={item.image} resizeMode="contain" containerStyle={styles.slideImage} />
    </View>
    <View style={styles.slideContentContainer}>
      <View style={styles.slideContentBody}>
        <Text testID="onboarding-slider-item-title" style={styles.title} preset="title2Emphasized">{item.title}</Text>
        <Text testID="onboarding-slider-item-text" style={styles.text} preset="lead">{item.text}</Text>
        {(item.key === 'last') && (
          <View style={styles.slideContentBodyFooter}>
            <Text testID="onboarding-slider-item-text" style={[styles.text, styles.textHighlight]} preset="lead" onPress={() => NavigationService.navigate('login')}>Login with existing account</Text>
          </View>
        )}
      </View>
      <View style={styles.slideContentFooter}>
        {(item.key === 'last') && (
          <Button testID="onboarding-button-signup" title="Create account" onPress={() => NavigationService.navigate('Signup')} />
        )}

        {(item.key !== 'last') && (
          <Button testID="onboarding-button-signup" title="Continue" onPress={() => goToSlide(index + 1)} />
        )}
      </View>
    </View>
  </View>
));

export const OnboardingSlider = withNavigation(OnboardingSliderComponent);
