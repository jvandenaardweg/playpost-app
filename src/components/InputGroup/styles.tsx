import { StyleSheet } from 'react-native';

import spacing from '../../constants/spacing';
import textInput from '../../constants/text-input';

export default StyleSheet.create({
  container: {
    marginBottom: spacing.medium
  },
  textInput,
  rightElementContainer: {
    position: 'absolute',
    bottom: 0,
    right: spacing.nano,
    backgroundColor: textInput.backgroundColor,
    zIndex: 1,
    height: textInput.height,
    width: textInput.height,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
