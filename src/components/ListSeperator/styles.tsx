import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  seperator: {
    backgroundColor: colors.articleBackground,
    paddingLeft: spacing.default,
    paddingRight: spacing.default
  },
  seperatorLine: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.grayLight,
  }
});
