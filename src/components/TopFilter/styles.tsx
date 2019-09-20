import {
  StyleSheet
} from 'react-native';

import colors from '../../constants/colors';
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
    marginRight: spacing.default,
    width: 56,
    marginLeft: spacing.default
  },
  scrollView: {
    flexDirection: 'row', alignItems: 'center'
  },
  filterOption: {
    marginRight: 6
  }
});
