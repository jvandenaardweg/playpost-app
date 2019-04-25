import {
  StyleSheet
} from 'react-native';
import colors from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
  },
  previewButton: {
    borderWidth: 1,
    borderRadius: 30,
    height: 30,
    width: 30,
    borderColor: colors.grayLight,
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white
  },
  previewButtonIcon: {
    position: 'relative',
    right: -2,
    color: colors.grayDark
  }
});
