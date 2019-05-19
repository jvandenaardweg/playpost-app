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
    lastPlayedAt: Date<string> | null;
    plays: number;
    createdAt: Date<string>;
    updatedAt: Date<string>;
    favoritedAt: Date<string> | null;
    archivedAt: Date<string> | null;
    article: Article;
  };

  export interface Article {
    id: string;
    title: string | null;
    description: string | null;
    url: string;
    languageCode: string | null; // TODO: remove after upgrade
    language: Language | null | undefined;
    sourceName: string | null;
    imageUrl: string | null;
    authorName: string | null;
    html: string | null;
    ssml?: string; // optional
    text?: string; // optional
    createdAt: Date<string>;
    updatedAt: Date<string>;
    user?: User; // optional
    readingTime: number | null;
    canonicalUrl: string | null;
    status: ArticleStatus<string>;
    isPublic: boolean | null;
    documentHtml?: string; // optional
    audiofiles: Audiofile[];
    language: Language;
  }

  export interface User {
    id: string;
    email: string;
    onboardAt: Date<string> | null;
    activatedAt: Date<string> | null;
    authenticatedAt: Date<string> | null;
    voiceSettings: UserVoiceSetting[];
    createdAt: Date<string>;
    updatedAt: Date<string>;
  }

  export interface Audiofile {
    id: string;
    url: string;
    bucket: string;
    filename: string;
    length: number;
    languageCode: string;
    mimeType: string;
    // language: Language | null | undefined;
    createdAt: Date<string>;
    updatedAt: Date<string>;
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
    createdAt: Date<string>;
    updatedAt: Date<string>;
  }

  export interface Language {
    id: string;
    name: string;
    languageCode: string;
    nativeName: string | null;
    isActive: boolean;
    voices?: Voice[];
    createdAt: Date<string>;
    updatedAt: Date<string>;
  }

  export interface UserVoiceSetting {
    id: string;
    user: User;
    voice: Voice;
    language: Language;
    createdAt: Date<string>;
    updatedAt: Date<string>;
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
