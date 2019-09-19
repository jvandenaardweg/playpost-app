import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';

export default StyleSheet.create({
  container: { },
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
    color: colors.white
  },
  thumbStyle: {
    width: 18,
    height: 18,
    borderRadius: 18,
    // borderWidth: 4,
    // borderColor: colors.black,
    backgroundColor: colors.white
  },
  trackStyle: {
    height: 2,
    borderRadius: 2
  }
});
