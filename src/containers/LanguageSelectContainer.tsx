import React from 'react';
import isEqual from 'react-fast-compare';
import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';

import { RootState } from '../reducers';

import { getUser } from '../reducers/user';
import { getLanguages } from '../reducers/voices';

import * as languageUtils from '../utils/language';

import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { CustomSectionList, IListItem } from '../components/CustomSectionList';
import colors from '../constants/colors';
import { selectUserHasUsedFreeIntroduction, selectUserIsSubscribed, selectUserSelectedVoices } from '../selectors/user';
import { selectLanguagesWithActiveVoices } from '../selectors/voices';

type Props = NavigationInjectedProps & StateProps & DispatchProps;

export class LanguagesSelectComponent extends React.Component<Props> {
  componentDidMount(): void {
    InteractionManager.runAfterInteractions(() => {
      this.props.getLanguages();
      this.props.getUser()
    });
  }

  shouldComponentUpdate(nextProps: Props): boolean {
    // Only re-render if props change
    return !isEqual(this.props, nextProps)
  }

  keyExtractor = (language: Api.Language, index: number) => index.toString();

  handleOnListItemPress = (language: Api.Language) => this.props.navigation.navigate('SettingsVoices', { languageName: language.name });

  getSelectedVoiceSubtitle = (language: Api.Language) => {
    const selectedVoice = languageUtils.getSelectedVoiceForLanguage(language, this.props.userHasUsedFreeIntroduction, this.props.isSubscribed, this.props.userSelectedVoices);

    if (!selectedVoice) { return ''; }

    const genderLabel = selectedVoice.gender === 'MALE' ? 'Male' : 'Female';
    const label = selectedVoice.label ? selectedVoice.label : '';

    return `${label} (${selectedVoice.countryCode}) (${genderLabel})`;
  }

  getTotalVoices = (language: Api.Language): number => {
    return language.voices && language.voices.length ? language.voices.length : 0;
  }

  getSectionListItems = (languages: Api.Language[]): IListItem[] => {
    return languages.map((language, index) => {
      return {
        key: language.id,
        subtitle: this.getSelectedVoiceSubtitle(language),
        title: language.name,
        icon: 'globe',
        iconColor: colors.green,
        onPress: () => this.handleOnListItemPress(language),
        value: this.getTotalVoices(language),
        chevron: true
      }
    })
  }

  render() {
    const { languagesWithActiveVoices } = this.props;

    // The first in the array is probably the user his language
    const userLanguage = languagesWithActiveVoices.slice(0, 1);

    // The rest are the languages, with the user his language
    const restLanguages = languagesWithActiveVoices.slice(1, languagesWithActiveVoices.length);

    const sectionListData = [
      {
        key: 'language-user',
        title: 'Lanuage user',
        data: this.getSectionListItems(userLanguage),
      },
      {
        key: 'language',
        title: 'Lanuage',
        data: this.getSectionListItems(restLanguages)
      }
    ];

    return <CustomSectionList sectionListData={sectionListData} />;
  }
}

interface DispatchProps {
  readonly getLanguages: typeof getLanguages;
  readonly getUser: typeof getUser;
}

interface StateProps {
  readonly languagesWithActiveVoices: ReturnType<typeof selectLanguagesWithActiveVoices>;
  readonly userSelectedVoices: ReturnType<typeof selectUserSelectedVoices>;
  readonly isSubscribed: ReturnType<typeof selectUserIsSubscribed>;
  readonly userHasUsedFreeIntroduction: ReturnType<typeof selectUserHasUsedFreeIntroduction>;
}

const mapStateToProps = (state: RootState) => ({
  languagesWithActiveVoices: selectLanguagesWithActiveVoices(state),
  userSelectedVoices: selectUserSelectedVoices(state),
  isSubscribed: selectUserIsSubscribed(state),
  userHasUsedFreeIntroduction: selectUserHasUsedFreeIntroduction(state)
});

const mapDispatchToProps = {
  getLanguages,
  getUser
};

export const LanguagesSelectContainer = withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LanguagesSelectComponent)
);
