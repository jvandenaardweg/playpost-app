import {
  StyleSheet
} from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  container: {

  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingBottom: spacing.default,
    paddingTop: spacing.default,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderDefault
  },
  filterLabel: {
    fontWeight: fonts.fontWeight.semibold,
    marginRight: spacing.default,
    width: 55,
    marginLeft: spacing.default
  },
  scrollView: {
    flexDirection: 'row', alignItems: 'center'
  },
  filterOption: {
    marginRight: 6
  }
});
