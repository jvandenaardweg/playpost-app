import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  container: {
    marginRight: spacing.default,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grayLightest,
    borderRadius: 32
  }
});
