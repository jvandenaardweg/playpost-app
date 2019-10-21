import React, { useContext } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { Button } from 'react-native-elements';
import { UserThemeContext } from '../../contexts/UserThemeProvider';
import { InputGroupEmail } from '../InputGroup/email';
import styles from './styles';

interface Props {
  email: string;
  isLoading: boolean;
  isSuccess: boolean;
  onChangeText(field: string, text: string): void;
  onPressUpdateEmail(): void;
}

export const UpdateEmailForm: React.FC<Props> = React.memo((props) => {
  const { theme } = useContext(UserThemeContext);

  // Android and iOS both interact with this prop differently.
  // Android may behave better when given no behavior prop at all, whereas iOS is the opposite.
  // https://facebook.github.io/react-native/docs/keyboardavoidingview#behavior
  const behaviorOption = Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <KeyboardAvoidingView testID="UpdateEmailForm" style={styles(theme).container} behavior={behaviorOption} keyboardVerticalOffset={100} enabled>
      <View style={styles(theme).form}>
        <InputGroupEmail
          testID="UpdateEmailForm-TextInput-email"
          value={props.email}
          onChangeText={text => props.onChangeText('email', text)}
          onSubmitEditing={() => props.onPressUpdateEmail()}
          editable={!props.isLoading}
          style={styles(theme).textField}
          returnKeyType="done"
          clearButtonMode="always"
          autoFocus
        />

        <View>
          <Button
            testID="UpdateEmailForm-Button-update"
            title={props.isSuccess ? 'Update success!' : 'Save new e-mail address'}
            loading={props.isLoading}
            onPress={props.onPressUpdateEmail}
            disabled={props.isLoading || props.isSuccess}
            activeOpacity={1}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  )
});
