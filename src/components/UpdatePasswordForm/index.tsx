import React, { useContext } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { Button } from '../Button';
import { UserThemeContext } from '../../contexts/UserThemeProvider';
import { InputGroupPassword } from '../InputGroup/password';
import styles from './styles';

export interface Props {
  password: string;
  isLoading: boolean;
  isSuccess: boolean;
  onChangeText(field: string, text: string): void;
  onPressUpdatePassword(): void;
}

export const UpdatePasswordForm: React.FC<Props> = React.memo((props) => {
  const { theme } = useContext(UserThemeContext);

  // Android and iOS both interact with this prop differently.
  // Android may behave better when given no behavior prop at all, whereas iOS is the opposite.
  // https://facebook.github.io/react-native/docs/keyboardavoidingview#behavior
  const behaviorOption = Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <KeyboardAvoidingView testID="UpdatePasswordForm" style={styles(theme).container} behavior={behaviorOption} keyboardVerticalOffset={60} enabled>
      <View style={styles(theme).form}>

        <InputGroupPassword
          label="Your new password"
          testID="UpdatePasswordForm-TextInput-password"
          placeholder="Your new super secret password"
          value={props.password}
          onChangeText={(text: string) => props.onChangeText('password', text)}
          onSubmitEditing={() => props.onPressUpdatePassword()}
          editable={!props.isLoading}
          returnKeyType="done"
          autoFocus
        />

        <View>
          <Button
            testID="UpdatePasswordForm-Button-update"
            title={props.isSuccess ? 'New password saved!' : 'Save new password'}
            loading={props.isLoading}
            onPress={props.onPressUpdatePassword}
            disabled={props.isLoading || props.isSuccess}
            activeOpacity={1}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
});
