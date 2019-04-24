import {
  StyleSheet
} from 'react-native';

import colors from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 4
  },
  paragraph: {
    color: colors.paragraphGrayed,
    lineHeight: 22,
    fontSize: 14
  },
  feature: {
    marginBottom: 16
  },
  footer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: colors.grayLightest,
  },
  footerText: {
    fontSize: 12,
    lineHeight: 18,
    opacity: 0.5
  },
  textHighlight: {
    color: colors.black,
    opacity: 1
  },
  subscribeContainer: {

  }
});
