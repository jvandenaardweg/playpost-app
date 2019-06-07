import React from 'react';
import { FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';

import colors from '../../constants/colors';

import { RootState } from '../../reducers';

import { getLanguages } from '../../reducers/voices';

import { selectLanguagesWithActiveVoices } from '../../selectors/voices';
import { selectUserSelectedVoices } from '../../selectors/user';

import * as Icon from '../../components/Icon';

import styles from './styles';

type IProps = {
  onSelectLanguage(languageName: string): void;
};

type Props = IProps & StateProps & DispatchProps;

export class LanguagesSelectComponent extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.getLanguages();
  }

  keyExtractor = (item: Api.Language, index: number) => index.toString();

  handleOnListItemPress = (item: Api.Language) => this.props.onSelectLanguage(item.name);

  getDefaultVoice = (language: Api.Language) => {
    return language.voices && language.voices.find(voice => !!voice.isLanguageDefault);
  }

  getVoiceSubtitle = (item: Api.Language) => {
    const { userSelectedVoices } = this.props;

    const userSelectedVoice = userSelectedVoices.find(voice => voice.language.id === item.id);
    const defaultVoice = this.getDefaultVoice(item);

    const voice = userSelectedVoice || defaultVoice;

    if (!voice) return '';

    const defaultLabel = (voice.isLanguageDefault) ? '(Default) ' : '';
    const genderLabel = (voice.gender === 'MALE') ? 'Male' : 'Female';

    return `${defaultLabel}${voice.label} (${voice.countryCode}) (${genderLabel})`;
  }

  renderRightElement = () => {
    return <Icon.FontAwesome5 name="chevron-right" size={16} solid color={colors.gray} />;
  }

  renderItem = ({ item }: { item: Api.Language}) => {
    const totalVoices = item.voices && item.voices.length;
    const title = `${item.name}`;
    const subtitle = this.getVoiceSubtitle(item);

    return (
      <ListItem
        bottomDivider
        onPress={() => this.handleOnListItemPress(item)}
        title={title}
        subtitle={subtitle}
        containerStyle={styles.listItemContainer}
        badge={{ value: totalVoices, badgeStyle: { width: 26, height: 20 } }}
        titleStyle={styles.listItemTitle}
        subtitleStyle={styles.listItemSubtitle}
        rightElement={this.renderRightElement()}
      />
    );
  }

  render() {
    return (
      <FlatList
        keyExtractor={this.keyExtractor}
        data={this.props.languagesWithActiveVoices}
        renderItem={this.renderItem}
        extraData={this.props} // So it re-renders when our props change
        removeClippedSubviews // unmount components that are off of the window
      />
    );
  }
}

interface DispatchProps {
  readonly getLanguages: typeof getLanguages;
}

interface StateProps {
  readonly languagesWithActiveVoices: ReturnType<typeof selectLanguagesWithActiveVoices>;
  readonly userSelectedVoices: ReturnType<typeof selectUserSelectedVoices>;
}

const mapStateToProps = (state: RootState) => ({
  languagesWithActiveVoices: selectLanguagesWithActiveVoices(state),
  userSelectedVoices: selectUserSelectedVoices(state)
});

const mapDispatchToProps = {
  getLanguages
};

export const LanguagesSelect = connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguagesSelectComponent);
