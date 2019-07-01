import React from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';

import { RootState } from '../reducers';

import { getLanguages } from '../reducers/voices';

import { selectLanguagesWithActiveVoices } from '../selectors/voices';
import { selectUserSelectedVoices } from '../selectors/user';
import { ListItemLanguage } from '../components/ListItemLanguage';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';

interface IProps extends NavigationInjectedProps {}

type Props = IProps & StateProps & DispatchProps;

export class LanguagesSelectComponent extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.getLanguages();
  }

  keyExtractor = (item: Api.Language, index: number) => index.toString();

  handleOnListItemPress = (item: Api.Language) => this.props.navigation.navigate('SettingsVoices', { languageName: item.name });

  getDefaultVoice = (language: Api.Language) => {
    return language.voices && language.voices.find(voice => !!voice.isLanguageDefault);
  }

  getVoiceSubtitle = (item: Api.Language) => {
    const { userSelectedVoices } = this.props;

    const userSelectedVoice = userSelectedVoices.find(voice => voice.language.id === item.id);
    const defaultVoice = this.getDefaultVoice(item);

    const voice = userSelectedVoice || defaultVoice;

    if (!voice) return '';

    const defaultLabel = voice.isLanguageDefault ? '(Default) ' : '';
    const genderLabel = voice.gender === 'MALE' ? 'Male' : 'Female';
    const label = voice.label ? voice.label : '';

    return `${defaultLabel}${label} (${voice.countryCode}) (${genderLabel})`;
  }

  renderItem = ({ item }: { item: Api.Language }) => {
    const subtitle = this.getVoiceSubtitle(item);
    const totalVoices = item.voices && item.voices.length ? item.voices.length : 0;

    return <ListItemLanguage onPress={this.handleOnListItemPress} language={item} totalVoices={totalVoices} subtitle={subtitle} />;
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

export const LanguagesSelectContainer = withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LanguagesSelectComponent)
);
