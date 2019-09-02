// Font sizes: https://learnui.design/blog/ios-font-size-guidelines.html
// https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/typography/
import { Platform } from 'react-native';


export default {
  fontSize: {
    headline: 30,
    titleLarge: 21,
    titleMedium: 18,
    title: 17, // page titles, modal
    paragraph: 17, // paragraph text, links
    body: 15,
    small: 13,
    tiny: 12,
    button: 17
  },
  fontWeight: {
    normal: 'normal' as 'normal',
    thin: '100' as '100',
    light: '300' as '300',
    regular: '400' as '400',
    medium: '500' as '500',
    semibold: Platform.OS === 'ios' ? '600' as '600' : '500' as '500', // Android's Robot has no semibold, so we fallback to bold
    bold: '700' as '700',
    heavy: Platform.OS === 'ios' ? '800' as '800' : '700' as '700', // Android's Robot has no heavy, so we fallback to bold
    black: Platform.OS === 'ios' ? '800' as '800' : '900' as '900', // Apple's SF has no black, so we fallback to heavy
  }
};
