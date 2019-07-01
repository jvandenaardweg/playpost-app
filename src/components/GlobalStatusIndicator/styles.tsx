import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    top: -54,
    height: 50,
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  wrapper: {
    width: 260,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    borderRadius: 100,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  label: {
    color: colors.white,
    fontSize: fonts.fontSize.body,
    marginLeft: 8,
    fontWeight: fonts.fontWeight.medium
  }
});
