import React from 'react';
import isEqual from 'react-fast-compare';
import { Alert, SectionListData, View } from 'react-native';
import * as TrackPlayer from 'react-native-track-player';
import { connect } from 'react-redux';

import { LOCAL_CACHE_VOICE_PREVIEWS_PATH } from '../constants/files';

import * as cache from '../cache';

import { NetworkContext } from '../contexts/NetworkProvider';
import * as languageUtils from '../utils/language';
import { RootState } from '../reducers';
import { setTrack } from '../reducers/player';
import { getUser, resetSaveSelectedVoiceError, saveSelectedVoice } from '../reducers/user';
import { setDownloadedVoice } from '../reducers/voices';

import { selectPlayerPlaybackState, selectPlayerTrack } from '../selectors/player';
import { selectUserErrorSaveSelectedVoice, selectUserHasUsedFreeIntroduction, selectUserIsEligibleForTrial, selectUserIsSubscribed, selectUserSelectedVoiceByLanguageName, selectUserSelectedVoices } from '../selectors/user';
import { selectCountryOptions, selectDownloadedVoicePreviews, selectGenderOptions, selectLanguagesWithActiveVoicesByLanguageName, selectQualityOptions } from '../selectors/voices';

import { ALERT_GENERIC_INTERNET_REQUIRED, ALERT_SETTINGS_VOICE_CHANGE, ALERT_SETTINGS_VOICE_PREVIEW_UNAVAILABLE, ALERT_TITLE_ERROR, ALERT_TITLE_ERROR_NO_INTERNET, ALERT_TITLE_SUBSCRIPTION_ONLY, ALERT_TITLE_VOICE_CHANGE_REQUEST } from '../constants/messages';

import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { ButtonVoicePreview } from '../components/ButtonVoicePreview';
import { CustomSectionList } from '../components/CustomSectionList';
import { TopFilter } from '../components/TopFilter';
import colors from '../constants/colors';

interface IProps {
  languageName: string;
}

type Props = IProps & NavigationInjectedProps & StateProps & DispatchProps;

interface State {
  isLoadingPreviewVoiceId: string;
  isLoadingSaveSelectedVoiceId: string;
  selectedQuality: string;
  selectedGender: string;
  selectedRegion: string;
}

export class VoiceSelectContainerComponent extends React.Component<Props, State> {
  static contextType = NetworkContext;

  state = {
    isLoadingPreviewVoiceId: '',
    isLoadingSaveSelectedVoiceId: '',
    selectedQuality: 'All',
    selectedGender: 'All',
    selectedRegion: 'All'
  };

  shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
    // Only re-render if props change
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }

  keyExtractor = (item: Api.Voice, index: number) => index.toString();

  handleOnListItemPress = (voice: Api.Voice, isSelected: boolean) => {
    const { isConnected } = this.context;
    const { isSubscribed, userIsEligibleForTrial } = this.props;

    // If it's already selected, do nothing
    if (isSelected) { return; }

    if (!isConnected) {
      return Alert.alert(ALERT_TITLE_ERROR_NO_INTERNET, ALERT_GENERIC_INTERNET_REQUIRED);
    }

    // If it's a premium voice and the user is not subscribed
    // Show a warning
    if (!isSubscribed) {
      const defaultText = 'Changing voices is only available for Premium and Unlimited users.\n\nYou can preview this voice by using the play button on the left.';
      const trialText = 'Changing voices is only available for Premium and Unlimited users. Start a Free trial to experience these voices.\n\nYou can preview this voice by using the play button on the left.';
      const title = (userIsEligibleForTrial) ? 'Start your free trial' : ALERT_TITLE_SUBSCRIPTION_ONLY;
      const description = (userIsEligibleForTrial) ? trialText : defaultText;
      const buttonText = (userIsEligibleForTrial) ? 'Start Free trial' : 'Upgrade';

      return Alert.alert(
        title,
        description,
        [
          {
            text: buttonText,
            style: 'cancel',
            onPress: () => this.props.navigation.navigate('Upgrade')
          },
          {
            text: 'Cancel'
          }
        ]
      );
    }

    // Warn the user, it only applies to new articles
    Alert.alert(ALERT_TITLE_VOICE_CHANGE_REQUEST, ALERT_SETTINGS_VOICE_CHANGE, [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'OK',
        onPress: () => this.handleOnSaveSelectedVoice(voice)
      }
    ]);
  }

  /**
   * Handles the saving of the selected voice to the database
   * Will also properly handle errors by showing an Alert to the user
   */
  handleOnSaveSelectedVoice = async (item: Api.Voice) => {
    return this.setState({ isLoadingSaveSelectedVoiceId: item.id }, async () => {
      try {
        // Save the selected voice for the user
        await this.props.saveSelectedVoice(item.id);

        // Get the updated settings
        await this.props.getUser();
      } finally {
        this.setState({ isLoadingSaveSelectedVoiceId: '' });
      }
    });
  }

  handleOnPreviewPress = async (title: string, label: string, voice: Api.Voice) => {
    const { downloadedVoices } = this.props;
    const isPlaying = this.isVoicePlayingInPlayer(voice.id);

    // If the preview of this voice is playing, pause it
    if (isPlaying) { return TrackPlayer.default.pause(); }

    // Check if the voice is already downloaded
    // If so, we can just play that locally downloaded voice preview
    const foundDownloadedVoice = downloadedVoices.find(downloadedVoice => downloadedVoice.id === voice.id);

    // If we have a downloaded voice preview, just play it
    if (foundDownloadedVoice && foundDownloadedVoice.exampleAudioUrl) {
      const localFilePath = await cache.getLocalFilePath(foundDownloadedVoice.exampleAudioUrl, LOCAL_CACHE_VOICE_PREVIEWS_PATH);
      return this.playVoicePreview(title, localFilePath, label, voice);
    }

    // If we have no voice preview downloaded yet, download it
    if (!foundDownloadedVoice) { return this.fetchVoicePreview(title, label, voice); }
  }

  playVoicePreview = (title: string, localFilePath: string, label: string, voice: Api.Voice) => {
    // Only add the track to the player when it's not in there yet
    if (!this.isVoiceActiveInPlayer(voice.id)) {
      this.props.setTrack(
        {
          title,
          id: voice.id,
          url: localFilePath,
          artist: label,
          album: 'Voice previews'
        },
        ''
      );
    }

    return TrackPlayer.default.play();
  }

  fetchVoicePreview = (title: string, label: string, voice: Api.Voice) => {
    const { isConnected } = this.context;
    const exampleAudioUrl = voice && voice.exampleAudioUrl;

    if (!isConnected) {
      return Alert.alert(ALERT_TITLE_ERROR_NO_INTERNET, ALERT_GENERIC_INTERNET_REQUIRED);
    }

    if (!exampleAudioUrl) {
      return Alert.alert(ALERT_TITLE_ERROR, ALERT_SETTINGS_VOICE_PREVIEW_UNAVAILABLE);
    }

    return this.setState({ isLoadingPreviewVoiceId: voice.id }, async () => {
      try {
        // Download the file and put it in a local cache directory
        const localFilePath = await cache.downloadVoicePreview(exampleAudioUrl);

        // Set it as downloaded in the Redux store
        this.props.setDownloadedVoice(voice);

        // Set the track, resulting in automatic playback
        return this.playVoicePreview(title, localFilePath, label, voice);
      } catch (err) {
        const message = err.message ? err.message : null;
        const alertMessage = message
          ? `An error happened while downloading the voice preview: "${message}".`
          : 'An error happened while downloading the voice preview.';

        Alert.alert(ALERT_TITLE_ERROR, alertMessage, [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Try again',
            onPress: () => this.fetchVoicePreview(title, label, voice)
          }
        ]);
      } finally {
        this.setState({ isLoadingPreviewVoiceId: '' });
      }
    });
  }

  isVoicePlayingInPlayer = (voiceId: string): boolean => {
    const { playbackState } = this.props;
    const isPlaying = playbackState === TrackPlayer.State.Playing && TrackPlayer.State.Playing && this.isVoiceActiveInPlayer(voiceId);
    return !!isPlaying;
  }

  isVoiceActiveInPlayer = (voiceId: string): boolean => {
    const { playerTrack } = this.props;
    return playerTrack && playerTrack.id === voiceId;
  }

  handleSelectQuality = (quality: string) => requestAnimationFrame(() => this.setState({ selectedQuality: quality }));

  handleSelectGender = (gender: string) => requestAnimationFrame(() => this.setState({ selectedGender: gender }));

  handleSelectRegion = (region: string) => requestAnimationFrame(() => this.setState({ selectedRegion: region }));

  get selectedLanguageName() {
    return this.props.navigation.getParam('languageName', '');
  }

  get selectedVoiceForLanguage() {
    const { languagesWithActiveVoicesByLanguageName, userHasUsedFreeIntroduction, isSubscribed, userSelectedVoices } = this.props;
    const languagewithActiveVoices = languagesWithActiveVoicesByLanguageName && languagesWithActiveVoicesByLanguageName[this.selectedLanguageName];

    return languageUtils.getSelectedVoiceForLanguage(languagewithActiveVoices, userHasUsedFreeIntroduction, isSubscribed, userSelectedVoices)
  }

  get filteredVoices(): Api.Voice[] {
    const { languagesWithActiveVoicesByLanguageName } = this.props;
    const { selectedQuality, selectedGender, selectedRegion } = this.state;

    const availableVoices = languagesWithActiveVoicesByLanguageName && languagesWithActiveVoicesByLanguageName[this.selectedLanguageName].voices || [];

    const filteredVoices = availableVoices.filter(voice => {
      if (selectedGender.toUpperCase() !== voice.gender && selectedGender !== 'All') {
        return false;
      }

      if (selectedQuality !== voice.quality && selectedQuality !== 'All') {
        return false;
      }

      if (selectedRegion !== voice.countryCode && selectedRegion !== 'All') {
        return false;
      }

      return true;
    })

    return filteredVoices;
  }

  get sectionListData(): ReadonlyArray<SectionListData<any>> {
    const { isLoadingSaveSelectedVoiceId, isLoadingPreviewVoiceId } = this.state;

    if (!this.filteredVoices.length) {
      return [];
    }

    return [{
      key: 'available-voices',
      title: 'Available voices',
      data: this.filteredVoices.map((voice) => {
        const isSelected = (this.selectedVoiceForLanguage) ? voice.id === this.selectedVoiceForLanguage.id : false;
        const isPlaying = this.isVoicePlayingInPlayer(voice.id);
        const isActive = this.isVoiceActiveInPlayer(voice.id);
        const isAvailable = !!voice.exampleAudioUrl;
        const isLoadingSaveSelected = isLoadingSaveSelectedVoiceId === voice.id;
        const isLoadingVoicePreview = isLoadingPreviewVoiceId === voice.id;

        const title = `${voice.label || voice.name}`;
        const badgeValue = voice.quality;
        const gender = voice.gender === 'MALE' ? 'Male' : 'Female';
        const subtitle = `${gender} (${voice.countryCode})`;

        const label = voice.label ? voice.label : 'Unknown';
        const rightIconColor = voice.isPremium ? colors.grayDark : undefined;

        return {
          key: voice.id,
          title,
          subtitle,
          isSelected,
          icon: 'play',
          leftIcon: (
            <ButtonVoicePreview
              isPlaying={isPlaying}
              isLoading={isLoadingVoicePreview}
              isActive={isActive}
              isAvailable={isAvailable}
              onPress={() => this.handleOnPreviewPress(title, label, voice)}
            />
          ),
          onPress: () => this.handleOnListItemPress(voice, isSelected),
          value: badgeValue,
          chevron: false,
          isLoading: isLoadingSaveSelected,
          checkmark: true,
          rightIconColor
        };
      })
    }]
  }

  get topFilterOptions() {
    const { selectedQuality, selectedGender, selectedRegion } = this.state;
    const { qualityOptions, genderOptions, countryOptions } = this.props;

    return [
      {
        label: 'Quality',
        options: qualityOptions,
        selectedOption: selectedQuality,
        onSelect: this.handleSelectQuality
      },
      {
        label: 'Gender',
        options: genderOptions,
        selectedOption: selectedGender,
        onSelect: this.handleSelectGender
      },
      {
        label: 'Country',
        options: countryOptions[this.selectedLanguageName],
        selectedOption: selectedRegion,
        onSelect: this.handleSelectRegion
      }
    ];
  }

  render() {

    return (
      <View style={{ flex: 1 }}>
        <TopFilter
          filters={this.topFilterOptions}
        />
        <CustomSectionList
          sectionListData={this.sectionListData}
          emptyTitle="No voices found"
          emptyDescription={['There are no voices matching your filters. Change your filters to see if there are any other voices!']}
        />
      </View>
    );
  }
}

interface DispatchProps {
  saveSelectedVoice: typeof saveSelectedVoice;
  setDownloadedVoice: typeof setDownloadedVoice;
  setTrack: typeof setTrack;
  getUser: typeof getUser;
  resetSaveSelectedVoiceError: typeof resetSaveSelectedVoiceError;
}

interface StateProps {
  readonly playbackState: ReturnType<typeof selectPlayerPlaybackState>;
  readonly playerTrack: ReturnType<typeof selectPlayerTrack>;
  readonly downloadedVoices: ReturnType<typeof selectDownloadedVoicePreviews>;
  readonly languagesWithActiveVoicesByLanguageName: ReturnType<typeof selectLanguagesWithActiveVoicesByLanguageName>;
  readonly userSelectedVoiceByLanguageName: ReturnType<typeof selectUserSelectedVoiceByLanguageName>;
  readonly isSubscribed: ReturnType<typeof selectUserIsSubscribed>;
  readonly errorSaveSelectedVoice: ReturnType<typeof selectUserErrorSaveSelectedVoice>;
  readonly userIsEligibleForTrial: ReturnType<typeof selectUserIsEligibleForTrial>;
  readonly qualityOptions: ReturnType<typeof selectQualityOptions>;
  readonly genderOptions: ReturnType<typeof selectGenderOptions>;
  readonly countryOptions: ReturnType<typeof selectCountryOptions>;
  readonly userHasUsedFreeIntroduction: ReturnType<typeof selectUserHasUsedFreeIntroduction>;
  readonly userSelectedVoices: ReturnType<typeof selectUserSelectedVoices>;
}

const mapStateToProps = (state: RootState) => ({
  playbackState: selectPlayerPlaybackState(state),
  playerTrack: selectPlayerTrack(state),
  downloadedVoices: selectDownloadedVoicePreviews(state),
  languagesWithActiveVoicesByLanguageName: selectLanguagesWithActiveVoicesByLanguageName(state),
  userSelectedVoiceByLanguageName: selectUserSelectedVoiceByLanguageName(state),
  isSubscribed: selectUserIsSubscribed(state),
  errorSaveSelectedVoice: selectUserErrorSaveSelectedVoice(state),
  userIsEligibleForTrial: selectUserIsEligibleForTrial(state),
  qualityOptions: selectQualityOptions(state),
  genderOptions: selectGenderOptions(state),
  countryOptions: selectCountryOptions(state),
  userHasUsedFreeIntroduction: selectUserHasUsedFreeIntroduction(state),
  userSelectedVoices: selectUserSelectedVoices(state)
});

const mapDispatchToProps = {
  saveSelectedVoice,
  setTrack,
  setDownloadedVoice,
  getUser,
  resetSaveSelectedVoiceError
};

export const VoiceSelectContainer = withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(VoiceSelectContainerComponent)
);
