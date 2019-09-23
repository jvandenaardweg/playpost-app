import React from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { Button } from 'react-native-elements';
import { InputGroupEmail } from '../InputGroup/email';
import styles from './styles';

interface Props {
  email: string;
  isLoading: boolean;
  isSuccess: boolean;
  onChangeText(field: string, text: string): void;
  onPressUpdateEmail(): void;
}

export const UpdateEmailForm: React.FC<Props> = React.memo(({ onChangeText, onPressUpdateEmail, email, isLoading, isSuccess }) => {

  // Android and iOS both interact with this prop differently.
  // Android may behave better when given no behavior prop at all, whereas iOS is the opposite.
  // https://facebook.github.io/react-native/docs/keyboardavoidingview#behavior
  const behaviorOption = Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <KeyboardAvoidingView testID="UpdateEmailForm" style={styles.container} behavior={behaviorOption} keyboardVerticalOffset={100} enabled>
      <View style={styles.form}>
        <InputGroupEmail
          testID="UpdateEmailForm-TextInput-email"
          value={email}
          onChangeText={text => onChangeText('email', text)}
          onSubmitEditing={() => onPressUpdateEmail()}
          editable={!isLoading}
          style={styles.textField}
          returnKeyType="done"
          clearButtonMode="always"
          autoFocus
        />

        <View>
          <Button
            testID="UpdateEmailForm-Button-update"
            title={isSuccess ? 'Update success!' : 'Save new e-mail address'}
            loading={isLoading}
            onPress={onPressUpdateEmail}
            disabled={isLoading || isSuccess}
            activeOpacity={1}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  )
});
