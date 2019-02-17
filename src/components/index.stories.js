import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import HeaderButton from './HeaderButton';

storiesOf('Button', module)
  .add('with text', () => <HeaderButton onClick={action('clicked')}></HeaderButton>)
  .add('with some emoji', () => (
    <HeaderButton onClick={action('clicked')}></HeaderButton>
  ));
