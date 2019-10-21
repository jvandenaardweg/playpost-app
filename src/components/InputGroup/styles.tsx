import { StyleSheet } from 'react-native';

import spacing from '../../constants/spacing';
import textInput from '../../constants/text-input';
import { UserTheme } from '../../reducers/user';

export default (theme: UserTheme) => StyleSheet.create({
  container: {
    marginBottom: spacing.medium
  },
  textInput: textInput(theme),
  rightElementContainer: {
    position: 'absolute',
    bottom: 0,
    right: spacing.nano,
    backgroundColor: textInput(theme).backgroundColor,
    zIndex: 1,
    height: textInput(theme).height,
    width: textInput(theme).height,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
