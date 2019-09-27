import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    top: -56,
    height: 50,
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  wrapper: {
    backgroundColor: colors.tintColor,
    borderRadius: 100,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingLeft: spacing.default,
    paddingRight: spacing.default
  },
  activityIndicator: {
    marginRight: spacing.tiny
  },
  label: {
    color: colors.white
  }
});
