import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import spacing from '../../constants/spacing';
import { textPresets } from '../Text';

const bottomContainerHeight = 350;
const slideImageSize = 120;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.tintColor
  },
  backgroundContainer: {
    flex: 1,
    backgroundColor: colors.tintColor,
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%'
  },
  topContainer: {
    height: '100%'
  },
  topContainerImage: {
    width: '100%',
    height: '100%',
    opacity: 0.12
  },
  sliderContainer: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    zIndex: 1
  },
  loginButtonContainer: {
    position: 'absolute',
    // marginTop: spacing.large,
    right: spacing.medium,
    zIndex: 2
  },
  loginButtonTitleStyle: {
    color: colors.white
  },
  skipButtonContainer: {
    position: 'absolute',
    width: 40,
    right: spacing.large,
    textAlign: 'right',
    bottom: 35,
    height: 30,
    // alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    // overflow: 'hidden',
    // backgroundColor: 'red'
  },
  skipButtonTitleStyle: {
    textAlign: 'right',
     color: colors.gray
  },
  skipButton: {
    marginRight: spacing.small,
    bottom: spacing.tiny * -1
  },
  bottomContainer: {
    position: 'absolute',
    backgroundColor: colors.white,
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    bottom: 0,
    left: 0,
    width: '100%',
    height: bottomContainerHeight,
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%'
  },
  slideImageContainer: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50
  },
  appIntroSliderDotStyle: {
    backgroundColor: colors.grayLight
  },
  appIntroSliderActiveDotStyle: {
    backgroundColor: colors.black
  },
  appIntroSliderPaginationStyle: {
    height: 30,
    position: 'absolute',
    bottom: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  slideImage: {
    width: slideImageSize,
    height: slideImageSize,
    marginBottom: spacing.large
  },
  slideContentContainer: {
    padding: spacing.large,
    paddingBottom: spacing.large * 2,
    height: 315,
    width: '100%'
  },
  slideContentBody: {
    height: 170
  },
  slideContentBodyFooter: {
    marginTop: spacing.small
  },
  slideContentFooter: {
    marginTop: spacing.large * 1.5
  },
  text: {
    color: colors.textLead,
    opacity: 0.9,
    backgroundColor: 'transparent',
    textAlign: 'center'
  },
  textHighlight: {
    color: colors.black,
    textDecorationLine: 'underline'
  },
  title: {
    color: colors.black,
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: spacing.default,
    paddingHorizontal: spacing.default
  },
  footerContainer: {
    marginBottom: 22
  }
});
