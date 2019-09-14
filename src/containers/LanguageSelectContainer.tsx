import React from 'react';
import isEqual from 'react-fast-compare';
import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';

import { RootState } from '../reducers';

import { getLanguages } from '../reducers/voices';

import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { CustomSectionList } from '../components/CustomSectionList';
import colors from '../constants/colors';
import { selectUserIsSubscribed, selectUserSelectedVoices } from '../selectors/user';
import { selectLanguagesWithActiveVoices } from '../selectors/voices';

type Props = NavigationInjectedProps & StateProps & DispatchProps;

export class LanguagesSelectComponent extends React.Component<Props> {
  componentDidMount(): void {
    InteractionManager.runAfterInteractions(() => {
      this.props.getLanguages();
    });
  }

  shouldComponentUpdate(nextProps: Props): boolean {
    // Only re-render if props change
    return !isEqual(this.props, nextProps)
  }

  keyExtractor = (language: Api.Language, index: number) => index.toString();

  handleOnListItemPress = (language: Api.Language) => this.props.navigation.navigate('SettingsVoices', { languageName: language.name });

  getDefaultVoice = (language: Api.Language) => {
    const { isSubscribed } = this.props;

    return language.voices && language.voices.find(voice => {
      if (!isSubscribed) {
        return !!voice.isUnsubscribedLanguageDefault
      }

      return !!voice.isSubscribedLanguageDefault
    });
  }

  getVoiceSubtitle = (language: Api.Language) => {
    const { userSelectedVoices } = this.props;

    const foundUserSelectedVoice = userSelectedVoices.find(userSelectedVoice => userSelectedVoice.language.id === language.id);
    const defaultVoice = this.getDefaultVoice(language);

    const voice = foundUserSelectedVoice || defaultVoice;

    if (!voice) { return ''; }

    const genderLabel = voice.gender === 'MALE' ? 'Male' : 'Female';
    const label = voice.label ? voice.label : '';

    return `${label} (${voice.countryCode}) (${genderLabel})`;
  }

  render() {
    const { languagesWithActiveVoices } = this.props;

    const sectionListData = [
      {
        key: 'language',
        title: 'Lanuage',
        data: languagesWithActiveVoices.map((language, index) => {
          const totalVoices = language.voices && language.voices.length ? language.voices.length : 0;
          const subtitle = this.getVoiceSubtitle(language);

          return {
            key: language.id,
            subtitle,
            title: language.name,
            icon: 'globe',
            iconColor: colors.green,
            onPress: () => this.handleOnListItemPress(language),
            value: totalVoices,
            chevron: true
          };
        })
      }
    ];

    return <CustomSectionList sectionListData={sectionListData} />;
  }
}

interface DispatchProps {
  readonly getLanguages: typeof getLanguages;
}

interface StateProps {
  readonly languagesWithActiveVoices: ReturnType<typeof selectLanguagesWithActiveVoices>;
  readonly userSelectedVoices: ReturnType<typeof selectUserSelectedVoices>;
  readonly isSubscribed: ReturnType<typeof selectUserIsSubscribed>;
}

const mapStateToProps = (state: RootState) => ({
  languagesWithActiveVoices: selectLanguagesWithActiveVoices(state),
  userSelectedVoices: selectUserSelectedVoices(state),
  isSubscribed: selectUserIsSubscribed(state)
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
