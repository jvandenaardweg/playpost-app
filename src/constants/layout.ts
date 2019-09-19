import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  borderRadius: {
    large: 10,
    medium: 8,
    small: 6,
    tiny: 4
  }
};
