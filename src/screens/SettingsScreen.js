import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Platform,
  RefreshControl,
  Switch,
  TouchableHighlight,
  Picker
} from 'react-native';
import { SettingsScreen as SettingsScreenComponent } from 'react-native-settings-screen';

{ /* <Picker
          selectedValue={this.state.language}
          style={{alignSelf: 'flex-end'}}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({language: itemValue})
          }>
          <Picker.Item label="English (US)" value="en-US" />
          <Picker.Item label="English (UK)" value="en-UK" />
        </Picker> */ }
export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings'
  };

  state = {
    language: 'en-US'
  }

  handleOnPressRow = (event) => {
    alert('Changing this setting becomes available in later versions.');
  }

  settingsData = [
    {
      type: 'SECTION',
      header: 'Voice'.toUpperCase(),
      footer:
        'Changing the voice settings becomes available in later versions.',
      rows: [
        {
          title: 'Language',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
              English
            </Text>
          ),
          onPress: this.handleOnPressRow
        },
        {
          title: 'Accent',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
              American
            </Text>
          ),
          onPress: this.handleOnPressRow
        },
        {
          title: 'Gender',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
              Male
            </Text>
          ),
          onPress: this.handleOnPressRow
        },
        {
          title: 'Speed',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
              Normal
            </Text>
          ),
          onPress: this.handleOnPressRow
        }
      ],
    },
    {
      type: 'SECTION',
      header: 'Audio'.toUpperCase(),
      footer:
        'Changing the audio settings becomes available in later versions.',
      rows: [
        {
          title: 'Quality',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
              Normal
            </Text>
          ),
          onPress: this.handleOnPressRow
        },
        {
          title: 'Auto play next article',
          renderAccessory: () => <Switch value onValueChange={() => {}} />,
          onPress: this.handleOnPressRow
        },
        {
          title: 'Auto archive played articles',
          renderAccessory: () => <Switch value onValueChange={() => {}} />,
          onPress: this.handleOnPressRow
        },
        {
          title: 'Auto scroll text',
          renderAccessory: () => <Switch value onValueChange={() => {}} />,
          onPress: this.handleOnPressRow
        }
      ],
    },
    {
      type: 'SECTION',
      header: 'Advanced'.toUpperCase(),
      footer:
        'Changing the advanced settings becomes available in later versions.',
      rows: [
        {
          title: 'Default browser',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
              Safari
            </Text>
          ),
          onPress: this.handleOnPressRow
        },
        {
          title: 'Clear cache',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
              50.5MB
            </Text>
          ),
          onPress: this.handleOnPressRow
        },
      ],
    },
    {
      type: 'CUSTOM_VIEW',
      render: () => (
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 18,
            color: '#999',
            marginBottom: 40,
            marginTop: -30,
          }}
        >
          v1.2.3
        </Text>
      ),
    },
  ]

  render() {
    return (
      <SettingsScreenComponent data={this.settingsData} style={{ paddingTop: 14 }} />
    );
  }
}
