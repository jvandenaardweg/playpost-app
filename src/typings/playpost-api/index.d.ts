declare namespace Api {
  export interface ResponseError {
    message: string;
  }

  export interface Auth {
    token: string;
  }

  export interface ReceiptValidationResponseApple {
    id: string;
    startedAt: string;
    expiresAt: string | null;
    latestTransactionId: string | null;
    originalTransactionId: string;
    latestReceipt: string;
    hadTrial: string | null;
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

  export interface ReceiptValidationResponseGoogle {
    id: string;
    startedAt: string;
    expiresAt: string | null;
    transactionId: string;
    orderId: string;
    purchaseToken: string;
    latestReceipt: string;
    hadTrial: string | null;
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
    limitSecondsPerMonth: number;
    limitSecondsPerArticle: number;
    createdAt: string;
    updatedAt: string;
  }

  export interface UserInAppSubscriptionApple {
    id: string;
    latestTransactionId: string;
    originalTransactionId: string;
    latestReceipt: string;
    isTrial: boolean;
    hadTrial: boolean;
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

  export interface UserInAppSubscriptionGoogle {
    id: string;
    transactionId: string;
    orderId: string;
    purchaseToken: string;
    latestReceipt: string;
    isTrial: boolean;
    hadTrial: boolean;
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

  export interface PlaylistItem {
    id: string;
    order: number;
    lastPlayedAt: string | null;
    createdAt: string;
    updatedAt: string;
    favoritedAt: string | null;
    archivedAt: string | null;
    article: Article;
    user?: User;
  }

  export interface Article {
    id: string;
    title: string | null;
    description: string | null;
    url: string;
    sourceName: string | null;
    imageUrl: string | null;
    authorName: string | null;
    html: string | null;
    createdAt: string;
    updatedAt: string;
    readingTime: number | null;
    canonicalUrl: string | null;
    status: ArticleStatus<string>;
    audiofiles: Audiofile[];
    language: Language | null;
    isCompatible: boolean;
    compatibilityMessage: string | null;
    ssml?: string | null; // optional
    text?: string | null; // optional
    user?: User | null; // optional
    documentHtml?: string | null; // optional
  }

  export interface User {
    id: string;
    email: string;
    activatedAt: string | null;
    authenticatedAt: string | null;
    voiceSettings: UserVoiceSetting[];
    usedInAppSubscriptionTrials: InAppSubscription[];
    activeUserInAppSubscription: UserInAppSubscriptionApple | UserInAppSubscriptionGoogle | null;
    inAppSubscriptions?: UserInAppSubscriptionApple[], // TODO: should be removed later
    used: {
      audiofiles: {
        currentMonthInSeconds: number;
      };
    };
    available: {
      audiofiles: {
        currentMonthInSeconds: number;
      };
    };
    limits: {
      audiofiles: {
        limitSecondsPerMonth: number;
        limitSecondsPerArticle: number;
      };
    };
    createdAt: string;
    updatedAt: string;
  }

  export interface Audiofile {
    id: string;
    url: string;
    bucket: string;
    filename: string;
    length: number;
    article?: Article;
    user?: User;
    voice: Voice;
    mimeType: string;
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
    country: Country;
    isLanguageDefault: boolean | null;
    createdAt: string;
    updatedAt: string;
    quality: string;
  }

  export interface Language {
    id: string;
    name: string;
    code: string;
    nativeName: string | null;
    isActive: boolean;
    voices?: Voice[];
    countries?: Country[];
    rightToLeft: boolean;
    createdAt: string;
    updatedAt: string;
  }

  export interface Country {
    id: string;
    name: string;
    code: string;
    nativeName: string;
    continent: string;
    currency: string;
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
