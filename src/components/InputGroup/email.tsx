import React from 'react'
import { TextInput, TextInputProps } from 'react-native'

import textInput from '../../constants/text-input';
import { InputGroup } from './index';

export interface Props extends TextInputProps {
  textInputRef?: React.RefObject<TextInput>
}

export const InputGroupEmail: React.FC<Props> = React.memo(({ textInputRef, ...rest }) => {
  return (
    <InputGroup label="E-mail address">
      <TextInput
        ref={textInputRef}
        autoCapitalize="none"
        textContentType="username"
        keyboardType="email-address"
        placeholder="john.appleseed@playpost.app"
        style={textInput}
        clearButtonMode="always"
        blurOnSubmit={false}
        {...rest}
      />
    </InputGroup>
  )
})
