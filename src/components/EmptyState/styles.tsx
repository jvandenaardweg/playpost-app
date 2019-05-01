import {
  StyleSheet
} from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.appBackground,
    paddingRight: 12,
    paddingLeft: 12,
  },
  content: {
    alignItems: 'center'
  },
  title: {
    textAlign: 'center',
    fontSize: fonts.fontSize.titleMedium,
    fontWeight: fonts.fontWeight.semibold,
    color: colors.titleDefault,
    marginBottom: 6
  },
  description: {
    textAlign: 'center',
    fontSize: fonts.fontSize.body,
    lineHeight: 24,
    color: colors.paragraphGrayed,
    paddingRight: 24,
    paddingLeft: 24,
    marginBottom: 14
  },
  button: {
    marginTop: 24,
    paddingLeft: 24,
    paddingRight: 24
  },
  icon: {
    marginTop: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.grayLight,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    opacity: 0.8
  }
});
