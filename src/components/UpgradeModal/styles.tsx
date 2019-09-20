import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import layout from '../../constants/layout';
import spacing from '../../constants/spacing';
import { textPresets } from '../Text';

export default StyleSheet.create({
  modal: {
    alignItems: 'center'
  },
  container: {
    backgroundColor: colors.white,
    padding: spacing.medium,
    borderRadius: layout.borderRadius.medium,
    maxWidth: 450
  },
  title: {
    marginTop: spacing.tiny,
    marginBottom: spacing.default,
    textAlign: 'center',
    color: colors.black
  },
  paragraph: {
    marginBottom: spacing.large,
    textAlign: 'center',
    color: colors.black
  },
  footer: {
    marginTop: spacing.tiny
  },
  cancelTitle: {
    color: colors.grayDark,
    ...textPresets['subheadEmphasized']
  }
});
