import React, { useContext } from 'react'
import { TextInput, TextInputProps } from 'react-native'

import textInput, { placeholderTextcolor } from '../../constants/text-input';
import { UserThemeContext } from '../../contexts/UserThemeProvider';
import { InputGroup } from './index';

export interface Props extends TextInputProps {
  label?: string;
  textInputRef?: React.RefObject<TextInput>
}

export const InputGroupEmail: React.FC<Props> = React.memo(({ label, textInputRef, ...rest }) => {
  const { theme } = useContext(UserThemeContext);

  return (
    <InputGroup label={label ? label : 'E-mail address'}>
      <TextInput
        ref={textInputRef}
        autoCapitalize="none"
        textContentType="username"
        keyboardType="email-address"
        placeholder="john.appleseed@playpost.app"
        style={textInput(theme)}
        clearButtonMode="always"
        blurOnSubmit={false}
        placeholderTextColor={placeholderTextcolor(theme)}
        {...rest}
      />
    </InputGroup>
  )
})
