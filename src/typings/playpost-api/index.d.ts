declare namespace Api {

  export interface ResponseError {
    message: string;
  }

  export interface Auth {
    token: string;
  }

  export interface InAppSubscription {
    id: string;
    productId: string;
    description: string;
    price: number;
    currency: string;
    duration: string;
    service: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }

  export interface ReceiptValidationResponse {
    id: string;
    startedAt: string;
    expiresAt: string | null;
    latestTransactionId: string | null;
    originalTransactionId: string;
    latestReceipt: string;
    isTrial: boolean;
    isCanceled: boolean | null;
    isExpired: boolean | null;
    status: string;
    environment: string;
    renewedAt: string | null;
    canceledAt: string | null;
    createdAt: string;
    updatedAt: string;
    inAppSubscription: InAppSubscription;
  }

  export interface InAppSubscription {
    id: string;
    productId: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    duration: string;
    service: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }

  export interface UserInAppSubscriptions {
    id: string;
    latestTransactionId: string;
    originalTransactionId: string;
    latestReceipt: string;
    isTrial: boolean;
    status: string;
    environment: string;
    renewedAt: string | null;
    canceledAt: string | null;
    startedAt: string;
    expiresAt: string | null;
    isCanceled: boolean;
    isExpired: boolean;
    user?: User;
    inAppSubscription: InAppSubscription;
    createdAt: string;
    updatedAt: string;
  }

  export type PlaylistItem = {
    id: string;
    order: number;
    lastPlayedAt: string | null;
    createdAt: string;
    updatedAt: string;
    favoritedAt: string | null;
    archivedAt: string | null;
    article: Article;
    user?: User;
  };

  export interface Article {
    id: string;
    title: string | null;
    description: string | null;
    url: string;
    languageCode: string | null; // TODO: remove after upgrade
    language?: Language;
    sourceName: string | null;
    imageUrl: string | null;
    authorName: string | null;
    html: string | null;
    ssml?: string | null; // optional
    text?: string | null; // optional
    createdAt: string;
    updatedAt: string;
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
    activatedAt: string | null;
    authenticatedAt: string | null;
    voiceSettings: UserVoiceSetting[];
    inAppSubscriptions: UserInAppSubscriptions[];
    createdAt: string;
    updatedAt: string;
  }

  export interface Audiofile {
    id: string;
    url: string;
    bucket: string;
    filename: string;
    length: number;
    languageCode: string;
    article?: Article;
    user?: User;
    voice: Voice;
    mimeType: string;
    language?: Language;
    createdAt: string;
    updatedAt: string;
  }

  export interface Voice {
    id: string;
    languageCode: string;
    countryCode: string;
    name: string;
    label: string | null;
    gender: Gender<string>;
    synthesizer: Synthesizer<string>;
    audioProfile: AudioProfile<string>;
    speakingRate: number;
    pitch: number;
    naturalSampleRateHertz: number | null;
    isActive: boolean;
    isPremium: boolean;
    isHighestQuality: boolean;
    exampleAudioUrl: string | null;
    language: Language;
    isLanguageDefault: boolean | null;
    createdAt: string;
    updatedAt: string;
  }

  export interface Language {
    id: string;
    name: string;
    languageCode: string;
    nativeName: string | null;
    isActive: boolean;
    voices?: Voice[];
    createdAt: string;
    updatedAt: string;
  }

  export interface UserVoiceSetting {
    id: string;
    voice: Voice;
    language: Language;
    user?: User;
    createdAt: string;
    updatedAt: string;
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
