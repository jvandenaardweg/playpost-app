import React from 'react';
import { View, TextInput, KeyboardAvoidingView } from 'react-native';
import { Button } from 'react-native-elements';
import styles from './styles';

interface Props {
  onChangeText(field: string, text: string): void;
  onPressUpdateEmail(): void;
  email: string;
  isLoading: boolean;
  isSuccess: boolean;
}

export const UpdateEmailForm: React.FC<Props> = React.memo(({ onChangeText, onPressUpdateEmail, email, isLoading, isSuccess }) => (
  <KeyboardAvoidingView testID="UpdateEmailForm" style={styles.container} behavior="padding" keyboardVerticalOffset={100} enabled>
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
));
