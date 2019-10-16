import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import spacing from '../../constants/spacing';
import { UserTheme } from '../../reducers/user';

export default (theme?: UserTheme) => StyleSheet.create({
  wrapper: {
    height: 55
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme === UserTheme.dark ? '#1E1E1E' : colors.black,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#444444',
    paddingLeft: spacing.default,
    paddingRight: spacing.default,
    paddingTop: 8,
    paddingBottom: 8,
    height: 55,
  },
  leftIcon: {
    width: 20,
    height: 34,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.medium
  },
  rightIcon: {
    width: 20,
    height: 34,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.default,
    marginRight: spacing.nano
  },
  emptyText: {
    color: colors.white
  },
  trackInfoButton: {
    flex: 1
  },
  trackInfo: { },
  trackInfoTitle: {
    color: colors.white,
    marginBottom: 2
  },
  trackInfoArtist: {
    color: colors.grayDark,
  },
  controls: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  playButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -6
  },
  controlPlay: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  progressBarContainer: {
    height: '100%',
    width: '100%',
    position: 'absolute'
  }
});
