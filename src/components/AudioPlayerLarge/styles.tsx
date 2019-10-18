import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import spacing from '../../constants/spacing';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.black
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  openCloseControl: {
    alignItems: 'flex-end',
    marginTop: spacing.default,
    marginBottom: spacing.default,
    paddingRight: spacing.large,
    paddingLeft: spacing.large
  },
  bottomContainer: {
    paddingLeft: spacing.large,
    paddingRight: spacing.large
  },
  controlsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  titleContainer: {
    paddingTop: spacing.large,
    paddingLeft: spacing.large,
    paddingRight: spacing.large
  },
  scrollableContainer: {
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: '#1f1f1f',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    borderTopWidth: 1,
    borderTopColor: '#333333',
    marginTop: 0,
    marginBottom: spacing.large,
    overflow: 'hidden'
  },
  scrollableContent: {
    padding: spacing.large,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: spacing.large,
  },
  progressBarRow: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    marginBottom: spacing.default
  },
  controlContainer: {
    width: 48
  },
  footer: {
    paddingTop: spacing.default,
    paddingLeft: spacing.large,
    paddingRight: spacing.large,
    height: 60
  },
  footerAnimatedView: {
    flexGrow: 1,
    width: '100%'
  },
  buttonControl: {
    backgroundColor: colors.gray400,
    height: 32,
    paddingLeft: spacing.medium,
    paddingRight: spacing.medium,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.small,
    marginLeft: spacing.micro,
    marginRight: spacing.micro
  },
  buttonControlText: {
    color: colors.white
  }
});
