import { StyleSheet } from 'react-native';

import colors from '../../../constants/colors';

export default StyleSheet.create({
  container: {
    height: 5,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: colors.white
  },
  progress: {
    backgroundColor: colors.tintColor
  },
  containerInteractive: {
    marginBottom: 34
  },
  sliderContainer: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  progressTimeContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  timeText: {
    color: colors.white,
    opacity: 0.7
  }
});
