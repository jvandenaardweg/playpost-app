declare namespace Api {

  export interface ResponseError {
    message: string;
  }

  export interface Auth {
    token: string;
  }

  export type PlaylistItem = {
    id: string;
    order: number;
    lastPlayedAt: Date | null;
    plays: number;
    createdAt: Date;
    updatedAt: Date;
    favoritedAt: Date | null;
    archivedAt: Date | null;
    article: Article;
  };

  export interface Article {
    id: string;
    title: string | null;
    description: string | null;
    url: string;
    canonicalUrl: string | null;
    sourceName: string | null;
    imageUrl: string | null;
    readingTime: number | null;
    authorName: string | null;
    authorUrl: string | null;
    categoryName: string | null;
    ssml: string | null;
    // text: string | null;
    html: string | null;
    documentHtml: string | null;
    createdAt: Date;
    updatedAt: Date;
    audiofiles: Audiofile[];
    status: ArticleStatus;
    language: Language;
    isPublic: boolean | null;
  }

  export interface User {
    id: string;
    email: string;
    onboardAt: Date | null;
    activatedAt: Date | null;
    authenticatedAt: Date | null;
    voiceSettings: UserVoiceSetting[];
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Audiofile {
    id: string;
    url: string;
    bucket: string;
    filename: string;
    length: number;
    languageCode: string;
    encoding: 'MP3' | 'OGG_OPUS';
    voiceId: string;
    lastPlayedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Voice {
    id: string;
    languageCode: string;
    countryCode: string;
    name: string;
    label: string | null;
    gender: Gender;
    synthesizer: Synthesizer;
    audioProfile: AudioProfile;
    speakingRate: number;
    pitch: number;
    naturalSampleRateHertz: number | null;
    isActive: boolean;
    isPremium: boolean;
    exampleAudioUrl: string | null;
    language: Language;
    isLanguageDefault: boolean | null;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Language {
    id: string;
    name: string;
    languageCode: string;
    nativeName: string | null;
    isActive: boolean;
    voices: Voice[];
    createdAt: Date;
    updatedAt: Date;
  }

  export interface UserVoiceSetting {
    id: string;
    user: User;
    voice: Voice;
    language: Language;
    createdAt: Date;
    updatedAt: Date;
  }

  export enum ArticleStatus {
    CRAWLING = 'crawling',
    NEW = 'new',
    FINISHED = 'finished',
    FAILED = 'failed'
  }

  export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    NEUTRAL = 'NEUTRAL',
    SSML_VOICE_GENDER_UNSPECIFIED = 'SSML_VOICE_GENDER_UNSPECIFIED'
  }

  export enum Synthesizer {
    GOOGLE = 'Google',
    AWS = 'AWS'
  }

  export enum AudioProfile {
    DEFAULT = 'default',
    HEADPHONE = 'headphone-class-device',
    SMARTPHONE = 'handset-class-device',
    SMART_WATCH = 'wearable-class-device',
    SMALL_HOME_SPEAKER = 'small-bluetooth-speaker-class-device',
    SMART_HOME_SPEAKER = 'medium-bluetooth-speaker-class-device',
    LARGE_HOME_ENTERTAINMENT_SYSTEM = 'large-home-entertainment-class-device',
    CAR_SPEAKER = 'large-automotive-class-device',
    INTERACTIVE_VOICE_RESPONSE_SYSTEM = 'telephony-class-application'
  }

}
