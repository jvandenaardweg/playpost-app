import { Platform } from 'react-native';
import { APP_BUNDLE_ID } from './bundle-id';

export const URL_PRIVACY_POLICY = 'https://playpost.app/privacy';
export const URL_TERMS_OF_USE = 'https://playpost.app/terms';
export const URL_ABOUT = 'https://playpost.app';
export const URL_FEEDBACK = 'https://playpost.app/support';
export const URL_MANAGE_APPLE_SUBSCRIPTIONS = 'https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/manageSubscriptions';
export const URL_MANAGE_GOOGLE_SUBSCRIPTIONS = `https://play.google.com/store/account/subscriptions?package=${APP_BUNDLE_ID}`;
export const URL_MANAGE_SUBSCRIPTIONS = Platform.OS === 'ios' ? URL_MANAGE_APPLE_SUBSCRIPTIONS : `${URL_MANAGE_GOOGLE_SUBSCRIPTIONS}`;

export const URL_DONATE = 'https://www.buymeacoffee.com/playpost';
export const URL_APP_APPLE_APP_STORE = 'https://apps.apple.com/app/playpost/id1460663960';
export const URL_APP_APPLE_APP_STORE_REVIEW = 'https://apps.apple.com/app/playpost/id1460663960?action=write-review';
export const URL_APP_GOOGLE_PLAY_REVIEW = `https://play.google.com/store/apps/details?id=${APP_BUNDLE_ID}`

export const URL_APP_REVIEW = (Platform.OS === 'ios') ? URL_APP_APPLE_APP_STORE_REVIEW : URL_APP_GOOGLE_PLAY_REVIEW;
