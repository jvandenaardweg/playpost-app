const tintColor = '#0066FF'; // newer blue since 23-09-2019
const tintColorLight = '#D9E9FD';
const tintColorDark = '#004A87';
const black = '#000000';
const grayDarkest = '#121212';
const grayDarker = '#555555';
const grayDark = '#AAAAAA';
const gray = '#C5C5C5';
const grayLight = '#e5e5e5';
const grayLightest = '#EEEEEE';
const appBackground = '#EEEEEE';
const white = '#ffffff';
const blue = tintColor;
const redLight = '#FF4F54';
const red = '#E9110B';
const redDark = '#b52424';
const orange = '#ffc107';
const orangeDark = '#ffc107';
const green = '#03A87C';

/*
dark theme:

black: #f4f4f4 // not pure white

grayDarkest: #222222
grayDarker: #444444
grayDark: #666666

gryLight: #222222
grayLightest: #111111

appBackground: #000000

white: #000000
gray: #979797

app background: #111111
article background: #111111

nav background: #212121

*/

export default {
  tintColor,
  tintColorLight,
  tintColorDark,
  black,
  grayDarkest,
  grayDarker,
  grayDark,
  gray,
  grayLight,
  grayLightest,
  white,
  blue,
  redLight,
  red,
  redDark,
  orange,
  orangeDark,
  green,

  appBackground,

  // Navigation
  tabIconDefault: gray,
  tabIconSelected: black,
  tabBar: white,
  tabBarBackgroundColor: white,
  tabBarBorderColor: grayLight,
  navigationBackgroundColor: white,
  navigationBorderColor: grayLight,

  // Article
  articleBackground: white,
  favorite: redLight,
  titleDefault: black,
  paragraphDefault: grayDarkest,
  paragraphGrayed: grayDarkest,
  borderDefault: grayLight,
  textLead: grayDarker,
  controlButtonDefault: white,
  controlButtonActive: tintColor,

  listItemBackground: white,

  errorBackground: red,
  errorText: white,
  warningBackground: orange,
  warningText: orangeDark,
  noticeBackground: tintColor,
  noticeText: white
};
