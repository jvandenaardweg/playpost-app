export const GENERIC_NETWORK_ERROR = 'Could not communicate with the server. Please make sure you have an active internet connection.';
export const ALERT_GENERIC_INTERNET_REQUIRED = 'You need to have an active internet connection to do this.';

export const GET_USER_FAIL_MESSAGE = 'An unknown error happened while getting your account. Please contact us when this happens all the time.';
export const UPDATE_USER_PASSWORD_FAIL_MESSAGE = 'An unknown error happened while updating your password. Please contact us when this happens all the time.';
export const UPDATE_USER_EMAIL_FAIL_MESSAGE = 'An unknown error happened while updating your e-mail address. Please contact us when this happens all the time.';
export const CREATE_USER_FAIL_MESSAGE = 'An unknown error happened while creating your account. Please contact us when this happens all the time.';
export const DELETE_USER_FAIL_MESSAGE = 'An unknown error happened while deleting your account. Please contact us when this happens all the time.';

export const POST_AUTH_FAIL_MESSAGE = 'An unknown error happened while loggin you in. Please contact us when this happens all the time.';

export const GET_LANGUAGES_FAIL_MESSAGE = 'An unknown error happened while getting the available languages. Please contact us when this happens all the time.';
export const SAVE_SELECTED_VOICE_FAIL_MESSAGE = 'An unknown error happened while saving this voice setting. Please contact us when this happens all the time.';

export const GET_ACTIVE_SUBSCRIPTIONS_FAIL_MESSAGE = 'An unknown error happened while getting the subscriptions. Please contact us when this happens all the time.';
export const POST_VALIDATE_SUBSCRIPTION_RECEIPT_FAIL_MESSAGE = 'An unknown error happened while validation your subscription receipt. Please contact us when this happens all the time.';

// Alerts related to articles
export const ALERT_ARTICLE_AUDIOFILE_CREATE_FAIL = 'There was a problem while creating the audio for this article.';
export const ALERT_ARTICLE_AUDIOFILE_DOWNLOAD_FAIL = 'There was a problem while downloading the audio for this article.';
export const ALERT_ARTICLE_PLAY_INTERNET_REQUIRED = 'You need an active internet connection to listen to this article.';
export const ALERT_ARTICLE_DOWNLOAD_FAIL = 'We could not download this article. Please try again.';
export const ALERT_ARTICLE_PLAY_FAIL = 'We could not play this article. Please try again.';
export const ALERT_ARTICLE_LANGUAGE_UNSUPPORTED = 'In this version we only allow English articles';
export const ALERT_ARTICLE_VOICE_FAIL = 'Audiofile could not be generated at this point, because there is no available voice. Please try again later.';

// Alerts related to the playlist
export const ALERT_PLAYLIST_REMOVE_ARTICLE_FAIL = 'We could not remove this article from your playlist. Please try again later.';
export const ALERT_PLAYLIST_FAVORITE_ARTICLE_FAIL = 'We could not favorite this article. Please try again later.';
export const ALERT_PLAYLIST_UNFAVORITE_ARTICLE_FAIL = 'We could not unfavorite this article. Please try again later.';
export const ALERT_PLAYLIST_ARCHIVE_ARTICLE_FAIL = 'We could not favorite this article. Please try again later.';
export const ALERT_PLAYLIST_UNARCHIVE_ARTICLE_FAIL = 'We could not favorite this article. Please try again later.';
export const ALERT_PLAYLIST_UPDATE_FAIL = 'We could get your up-to-date playlist.';

// Alerts on the settings screen
export const ALERT_SETTINGS_SET_CACHE_SIZE_FAIL = 'We could not set the cache size.';
export const ALERT_SETTINGS_SETTING_UNAVAILABLE = 'Changing this setting is not available yet. It will be available in later versions.';
export const ALERT_SETTINGS_RESET_CACHE_FAIL = 'We could not clear the cache. Please try again.';
export const ALERT_SETTINGS_CLEAR_CACHE_WARNING = 'This will delete the already downloaded article audio and voice previews.';
export const ALERT_SETTINGS_VOICE_CHANGE = 'Articles with already available audio will not be changed to this new voice.';
export const ALERT_SETTINGS_VOICE_PREVIEW_UNAVAILABLE = 'No voice preview available, yet. Please try again later.';
export const ALERT_SETTINGS_LANGUAGES_VOICE_SAVE = 'Saving the selected voice for this language failed. Please try again.';
export const ALERT_SETTINGS_LOGOUT_FAIL = 'We failed to log you out. Please try again.';
export const ALERT_SETTINGS_DELETE_USER = 'Deleting your account cannot be undone. All your data will be deleted from our systems.';
export const ALERT_SETTINGS_DELETE_USER_FAIL = 'An error happened while trying to delete your account. Please try again or contact us when this happens all the time.';

export const ALERT_SETTINGS_UPDATE_EMAIL_WARNING = 'For security reasons, after updating your e-mail address, you need to login again with your new e-mail address.';
export const ALERT_SETTINGS_UPDATE_EMAIL_INVALID_MATCH = 'The given e-mail addresses do not match. Please make sure you typed your e-mail address correctly.';

export const ALERT_SUBSCRIPTION_INIT_FAIL = 'Could not set up a connection to the App Store. Please try again later.';
export const ALERT_SUBSCRIPTION_PURCHASE_SUBSCRIPTION_NOT_FOUND = 'We could not get the subscription to purchase. Please try again later.';
export const ALERT_SUBSCRIPTION_EXPIRED = 'Your subscription is expired. To use our Premium features again, re-subscribe by using the Upgrade button.';
export const ALERT_SUBSCRIPTION_BUY_SUCCESS = 'You can now use our premium features.';
export const ALERT_SUBSCRIPTION_RESTORE_PURCHASE_NOT_FOUND = 'We could not find a subscription purchase to restore. If you had a subscription before, it might be expired. If you think this is incorrect, contact our support.';
export const ALERT_SUBSCRIPTION_RESTORE_SUCCESS = 'You successfully restored the subscription! You can now use the extra features.';
export const ALERT_SUBSCRIPTION_NOT_FOUND = 'The subscription to upgrade to cannot be found. Please try again later.';
