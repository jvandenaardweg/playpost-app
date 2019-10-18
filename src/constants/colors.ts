// black
const pureBlack = '#000000';
const black = '#040404';

// white
const white = '#ffffff';

// blues
const tintColor = '#0066FF'; // newer blue since 23-09-2019
const tintColorLight = '#D9E9FD';
const tintColorDark = '#004A87';
const blue = tintColor;

// red
const redLight = '#FF4F54';
const red = '#E9110B';
const redDark = '#b52424';

// orange
const orange = '#ffc107';
const orangeDark = '#ffc107';

// green
const green = '#03A87C';

// grays
const gray950 = '#040404';
const gray900 = '#141414';
const gray800 = '#222222';
const gray750 = '#2B2B2B';
const gray700 = '#333333';
const gray600 = '#444444';
const gray500 = '#555555';
const gray400 = '#666666';
const gray300 = '#777777';
const gray200 = '#888888';
const gray100 = '#999999';

// TODO: try to fit these in the gray scale on top
const gray = '#C5C5C5';
const grayLight = '#e5e5e5';
const grayLightest = '#EEEEEE';

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

  tintColor,
  tintColorLight,
  tintColorDark,
  black,
  pureBlack,
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
  borderDefault: grayLight,
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
