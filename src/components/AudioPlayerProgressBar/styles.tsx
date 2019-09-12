import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';

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
    color: colors.white,
    fontSize: fonts.fontSize.small,
    fontWeight: fonts.fontWeight.medium
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
