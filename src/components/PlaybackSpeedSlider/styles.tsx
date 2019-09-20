import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import spacing from '../../constants/spacing';

const controlButtonWidth = 30;
const containerHeight = 48;

export default StyleSheet.create({
  container: {
    backgroundColor: colors.tintColor,
    height: containerHeight,
    borderRadius: containerHeight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: spacing.default,
    paddingRight: spacing.default
  },
  labelContainer: {
    position: 'absolute',
    top: -40,
    backgroundColor: colors.tintColor,
    paddingTop: spacing.micro,
    paddingBottom: spacing.micro,
    paddingLeft: spacing.small,
    paddingRight: spacing.small,
    borderRadius: 50
  },
  labelText: {
    color: colors.white
  },
  controlsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  controlButton: {
    backgroundColor: colors.tintColorDark,
    width: controlButtonWidth,
    height: controlButtonWidth,
    borderRadius: controlButtonWidth,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sliderContainer: {
    flexGrow: 1,
    marginLeft: spacing.default,
    marginRight: spacing.default
  },
  sliderThumbStyle: {
    backgroundColor: colors.white
  },
  sliderTrackStyle: {
    height: 3
  }
});
