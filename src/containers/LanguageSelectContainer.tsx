import React from 'react';
import { connect } from 'react-redux';

import { RootState } from '../reducers';

import { getLanguages } from '../reducers/voices';

import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { CustomSectionList } from '../components/CustomSectionList';
import colors from '../constants/colors';
import { selectUserSelectedVoices } from '../selectors/user';
import { selectLanguagesWithActiveVoices } from '../selectors/voices';

type Props = NavigationInjectedProps & StateProps & DispatchProps;

export class LanguagesSelectComponent extends React.PureComponent<Props> {
  public componentDidMount(): void {
    this.props.getLanguages();
  }

  public keyExtractor = (item: Api.Language, index: number) => index.toString();

  public handleOnListItemPress = (item: Api.Language) => this.props.navigation.navigate('SettingsVoices', { languageName: item.name });

  public getDefaultVoice = (language: Api.Language) => {
    return language.voices && language.voices.find(voice => !!voice.isLanguageDefault);
  }

  public getVoiceSubtitle = (item: Api.Language) => {
    const { userSelectedVoices } = this.props;

    const foundUserSelectedVoice = userSelectedVoices.find(userSelectedVoice => userSelectedVoice.language.id === item.id);
    const defaultVoice = this.getDefaultVoice(item);

    const voice = foundUserSelectedVoice || defaultVoice;

    if (!voice) { return ''; }

    const genderLabel = voice.gender === 'MALE' ? 'Male' : 'Female';
    const label = voice.label ? voice.label : '';

    return `${label} (${voice.countryCode}) (${genderLabel})`;
  }

  public render(): JSX.Element {
    const { languagesWithActiveVoices } = this.props;

    const sectionListData = [
      {
        title: 'Lanuage',
        data: languagesWithActiveVoices.map((language, index) => {
          const totalVoices = language.voices && language.voices.length ? language.voices.length : 0;
          const subtitle = this.getVoiceSubtitle(language);

          return {
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
