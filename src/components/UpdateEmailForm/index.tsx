import React from 'react';
import { KeyboardAvoidingView, Platform, TextInput, View } from 'react-native';
import { Button } from 'react-native-elements';
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
        <TextInput
          testID="UpdateEmailForm-TextInput-email"
          placeholder="Your new e-mail address"
          autoCapitalize="none"
          value={email}
          onChangeText={text => onChangeText('email', text)}
          onSubmitEditing={() => onPressUpdateEmail()}
          textContentType="emailAddress"
          style={styles.textField}
          editable={!isLoading}
          returnKeyType="done"
          clearButtonMode="always"
          blurOnSubmit={false}
        />

        <View>
          <Button
            testID="UpdateEmailForm-Button-update"
            title={isSuccess ? 'Update success!' : 'Update e-mail address'}
            loading={isLoading}
            onPress={onPressUpdateEmail}
            disabled={isLoading || isSuccess}
            buttonStyle={isSuccess ? styles.buttonStyleSuccess : styles.buttonStyle}
            titleStyle={isSuccess ? styles.buttonTitleStyleSuccess : {}}
            activeOpacity={1}
            disabledStyle={isSuccess ? styles.buttonStyleSuccess : styles.buttonStyle}
            disabledTitleStyle={isSuccess ? styles.buttonTitleStyleSuccess : styles.buttonStyle}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  )
});
