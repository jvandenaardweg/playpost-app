import React from 'react'
import { Button, ScrollView, StyleSheet, Text, FlatList, View, TouchableOpacity } from 'react-native'
import { ListHeader } from '../../components/ListHeader'
import { HeaderButton } from '../../components/HeaderButton'
import { ProjectCard } from '../../components/ProjectCard'

export default class ProjectsIndexScreen extends React.Component {
  static navigationOptions = {
    title: 'Projects',
    headerStyle: {
      backgroundColor: '#0260ee'
    },
    headerRight: (
      <HeaderButton icon={'sliders-h'} onPress={this.handleOnPressFilter} />
    )
  };

  state = {
    isRefreshing: false,
    listItems: [{key: 'a'}, {key: 'b'}, {key: 'c'}, {key: 'd'}, {key: 'e'}, {key: 'f'}]
  }

  handleOnPressFilter = () => {
    alert('filter!')
  }

  handleOnRefresh = () => {
    this.setState({ isRefreshing: true }, this.getData)
  }

  getData = () => {
    const { listItems } = this.state

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
        this.setState({
          isRefreshing: false,
          listItems: listItems.reverse()
        })
      }, 3000)
    })
  }

  render() {
    const { isRefreshing, listItems } = this.state

    return (
      <View>
        <ListHeader
          title="Projects"
          subtitle="2 projects that fit your skills and agenda" />
        <FlatList
          style={styles.listContainer}
          refreshing={isRefreshing}
          onRefresh={this.handleOnRefresh}
          data={listItems}
          renderItem={({item}) =>
            <ProjectCard onPress={() => this.props.navigation.navigate('ProjectsDetail')} />
          }
          // <ListItem title={item.key} onPress={() => this.props.navigation.navigate('ProjectsDetail')}></ListItem>}
        />
      </View>

    );
  }
}

const ListItem = (props) => (
  <TouchableOpacity style={styles.listItem} onPress={props.onPress}>
    <Text>{props.title}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F4'
  },
  listContainer: {
    backgroundColor: '#E7E8ED',
    padding: 6
  }
});
