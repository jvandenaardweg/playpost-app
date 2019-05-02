import { StyleSheet } from 'react-native';
import colors from '../../../constants/colors';

export default StyleSheet.create({
  playButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonCircle: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 64,
    width: 64,
    height: 64
  },
  controlPlay: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
