import {
  StyleSheet
} from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';

export default StyleSheet.create({
  listItemContainer: {
    borderColor: colors.borderDefault
  },
  listItemTitle: {
    fontSize: fonts.fontSize.title,
    fontWeight: fonts.fontWeight.medium
  },
  listItemSubtitle: {
    color: colors.paragraphGrayed,
    fontSize: fonts.fontSize.small,
    marginTop: 4
  },
  listItemBadge: {
    paddingLeft: 2, paddingRight: 2
  },
  listItemBadgeText: {
    color: 'white',
    fontWeight: '400'
  }
});
