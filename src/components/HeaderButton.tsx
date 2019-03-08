import * as React from 'React';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface Props {
  icon: string
  onPress(): void
}

export class HeaderButton extends React.PureComponent<Props> {
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
