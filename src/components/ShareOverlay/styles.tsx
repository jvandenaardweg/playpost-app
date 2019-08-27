import { Platform, StyleSheet } from 'react-native';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Platform.OS === 'ios' ? 'rgba(0,0,0,0.7)' : 'transparent' // Android has it's own background color which is good enough
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.large
  }
});
