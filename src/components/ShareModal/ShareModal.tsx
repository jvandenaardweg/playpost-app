import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';

import { Article } from '../../components/Article';
import styles from './styles';

interface State {
  isLoading: boolean
  title: string
  description: string
  sourceName: string
}

interface Props {
  url: string
  type: string
  onPressCancel(): void
  onPressSave(): void
}

export class ShareModal extends React.PureComponent<Props, State> {
  state = {
    isLoading: true,
    title: '',
    description: '',
    sourceName: ''
  }

  async componentDidMount() {
    const { url } = this.props;
    await this.fetchArticle(url);
  }

  fetchArticle = async (url: string) => {
    /* eslint-disable no-console */
    console.log('fetch article using url: ', url);

    setTimeout(() => {
      this.setState({
        title: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dictum odio in dignissim venenatis. Ut viverra sit amet ex vel hendrerit. Curabitur sed felis justo.',
        sourceName: 'medium.com',
        isLoading: false
      });
    }, 2000);
  }

  renderArticle = () => {
    const { isLoading, title, description, sourceName } = this.state;

    if (isLoading || (!title && !description)) return null;

    return (
      <Article
        title={title}
        description={description}
        sourceName={sourceName}
      />
    );
  }

  renderActivityIndicator = () => {
    const { isLoading } = this.state;

    if (!isLoading) return null;

    return (
      <ActivityIndicator />
    );
  }

  render() {
    const {
      url,
      type,
      onPressCancel,
      onPressSave
    } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.articleContainer}>
            {this.renderActivityIndicator()}
            {this.renderArticle()}
          </View>
          <View style={styles.footer}>
            <View><Text>{type} / {url}</Text></View>
            <View style={styles.footerRow}>
              <View style={styles.footerCancel}>
                <Button title="Cancel" onPress={onPressCancel} type="outline" />
              </View>
              <View style={styles.footerSave}>
                <Button title="Save" onPress={onPressSave} />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
