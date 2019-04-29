import {
  StyleSheet
} from 'react-native';
import colors from '../../constants/colors';

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
    // flex: 1,
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
    fontWeight: '500'
  },
  listItemSubtitle: {
    color: colors.paragraphGrayed,
    fontSize: 14
  },
  listItemBadge: {
    paddingLeft: 2, paddingRight: 2
  },
  listItemBadgeText: {
    color: 'white', fontWeight: '400'
  }

});
