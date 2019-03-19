import {
  StyleSheet
} from 'react-native';

import colors from '../../constants/colors';

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
    alignItems: 'center',
    // backgroundColor: 'green'
  },
  title: {
    textAlign: 'center',
    // fontFamily: 'Merriweather-Regular',
    fontSize: 22,
    fontWeight: '600',
    color: colors.titleDefault,
    marginBottom: 20
  },
  description: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    color: colors.paragraphGrayed,
    paddingRight: 18,
    paddingLeft: 18,
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
