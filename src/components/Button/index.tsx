import React, { useContext } from 'react';
import { Button } from 'react-native-elements';
import { UserThemeContext } from '../../contexts/UserThemeProvider';

export const ButtonFC: React.FC = React.memo((props) => {
  const { theme } = useContext(UserThemeContext);

  return (
    <Button buttonStyle={styles(theme).button} title={props.actionButtonLabel} onPress={props.actionButtonOnPress} testID="empty-state-button" />
  )
})
