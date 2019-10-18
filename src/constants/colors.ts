const tintColor = '#0066FF'; // newer blue since 23-09-2019
const tintColorLight = '#D9E9FD';
const tintColorDark = '#004A87';
const black = '#040404';
const grayDarkest = '#141414';
const grayDarker = '#666666';
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

const gray950 = '#040404';
const gray900 = '#111111';
const gray800 = '#222222';
const gray750 = '#2B2B2B';
const gray700 = '#333333';
const gray600 = '#444444';
const gray500 = '#555555';
const gray400 = '#666666';
const gray300 = '#777777';
const gray200 = '#888888';
const gray100 = '#999999';

// const gray50 = 'rgba(0, 0, 0, 0.05)';

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
  gray950,
  gray900,
  gray800,
  gray750,
  gray700,
  gray600,
  gray500,
  gray400,
  gray300,
  gray200,
  gray100,
  // gray50,

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
