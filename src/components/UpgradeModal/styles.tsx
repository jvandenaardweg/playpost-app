import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import layout from '../../constants/layout';
import spacing from '../../constants/spacing';
import { UserTheme } from '../../reducers/user';
import { textPresets } from '../Text';

export default (theme: UserTheme) => StyleSheet.create({
  modal: {
    alignItems: 'center'
  },
  container: {
    backgroundColor: (theme === UserTheme.dark) ? colors.gray700 : colors.white,
    padding: spacing.medium,
    borderRadius: layout.borderRadius.medium,
    maxWidth: 450
  },
  title: {
    marginTop: spacing.tiny,
    marginBottom: spacing.default,
    textAlign: 'center',
    color: (theme === UserTheme.dark) ? colors.white : colors.black
  },
  paragraph: {
    marginBottom: spacing.large,
    textAlign: 'center',
    color: (theme === UserTheme.dark) ?  colors.white : colors.black
  },
  footer: {
    marginTop: spacing.tiny
  },
  cancelTitle: {
    color: (theme === UserTheme.dark) ? colors.white : colors.gray100,
    ...textPresets['subheadEmphasized']
  }
});
