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
  }
});
