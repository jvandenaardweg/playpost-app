import {
  StyleSheet
} from 'react-native';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
  },
  previewButton: {
    borderWidth: 1,
    borderRadius: 30,
    height: 30,
    width: 30,
    borderColor: colors.grayLight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white
  },
  previewButtonIcon: {
    position: 'relative',
    right: -2,
    color: colors.grayDark
  },
  listItemContainer: {
    borderColor: colors.borderDefault
  },
  listItemTitle: {
    fontSize: fonts.fontSize.title,
    fontWeight: '400'
  },
  listItemSubtitle: {
    color: colors.paragraphGrayed,
    fontSize: fonts.fontSize.small,
    marginTop: 2
  },
  listItemBadge: {
    paddingLeft: 2, paddingRight: 2
  },
  listItemBadgeText: {
    color: 'white',
    fontWeight: '400'
  }

});
