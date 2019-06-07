import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';

export default StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flexDirection: 'row'
  },
  progress: {
    height: '100%'
  },
  containerInteractive: {
    marginBottom: 8
  },
  sliderContainer: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  progressTimeContainer: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  timeText: {
    color: colors.white,
    fontSize: fonts.fontSize.small
  },
  thumbStyle: {
    width: 24,
    height: 24,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: colors.black,
    backgroundColor: colors.white
  },
  trackStyle: {
    height: 2,
    borderRadius: 2
  }
});
