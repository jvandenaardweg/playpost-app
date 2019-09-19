import { StyleSheet } from 'react-native';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  container: {
    height: 28,
    borderRadius: 28
  },
  wrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 28,
    borderRadius: 28,
    paddingLeft: spacing.small,
    paddingRight: spacing.small,
  },
  icon: {
    marginLeft: 6,
    marginRight: -1
  }
});
