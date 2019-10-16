import { StyleSheet } from 'react-native';
import { UserTheme } from '../../reducers/user';

export default (theme?: UserTheme) => StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    zIndex: 0
  },
  progress: {
    height: '100%',
    backgroundColor: theme === UserTheme.dark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.15)'
  }
});
