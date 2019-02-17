import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export class HeaderButton extends React.PureComponent {
  render() {
    const { icon, onPress } = this.props;

    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <Icon
          name={icon}
          size={26}
          color="white"
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 6
  }
});
