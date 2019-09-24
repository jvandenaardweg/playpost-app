import React, { useState } from 'react'
import { TextInput, TextInputProps, TouchableOpacity } from 'react-native'

import { mediumHitslop } from '../../constants/buttons';
import textInput from '../../constants/text-input';
import * as Icon from '../Icon';
import { InputGroup } from './index';

export interface Props extends TextInputProps {
  label?: string;
  textInputRef?: React.RefObject<TextInput>
}

export const InputGroupPassword: React.FC<Props> = React.memo(({ label, textInputRef, ...rest }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <InputGroup
      label={label ? label : 'Password'}
      RightElement={
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          hitSlop={mediumHitslop}
          testID="InputGroupPassword-TouchableOpacity-toggle-password-visible"
        >
          <Icon.Feather
            testID="InputGroupPassword-TouchableOpacity-toggle-password-visible-icon"
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            size={20}
            color={'black'}
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>
      }
    >
      <TextInput
        ref={textInputRef}
        placeholder="Your super secret password"
        autoCapitalize="none"
        secureTextEntry={isPasswordVisible ? false : true}
        textContentType={isPasswordVisible ? 'none' : 'password'}
        style={textInput}
        clearButtonMode="always"
        blurOnSubmit={false}
        {...rest}
      />
    </InputGroup>
  )
})
