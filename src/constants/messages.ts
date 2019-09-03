// Alert titles
export const ALERT_TITLE_ERROR_NO_INTERNET = 'No internet availalbe';
export const ALERT_TITLE_ERROR = 'Oops!';
export const ALERT_TITLE_SUBSCRIPTION_ONLY = 'Available on Premium or Plus';
export const ALERT_TITLE_REQUEST_CONFIRM = 'Are you sure?';
export const ALERT_TITLE_SUBSCRIPTION_UPGRADE_SUCCESS = 'Upgrade success!';
export const ALERT_TITLE_SUBSCRIPTION_RESTORE_SUCCESS = 'Restore successful!';
export const ALERT_TITLE_SUBSCRIPTION_RESTORE_ERROR = 'Restore purchase error';
export const ALERT_TITLE_SUBSCRIPTION_UPGRADE_ERROR = 'Upgrade error';
export const ALERT_TITLE_SUBSCRIPTION_RESTORE_NOTHING = 'Nothing to restore';
export const ALERT_TITLE_SUBSCRIPTION_EXPIRED = 'Subscription expired';
export const ALERT_TITLE_VOICE_CHANGE_REQUEST = 'Only applies to new articles';
export const ALERT_TITLE_NO_UPDATE = 'Nothing to update';

// Generic
export const ALERT_GENERIC_INTERNET_REQUIRED = 'You need to have an active internet connection to do this.';

// Alerts related to articles
export const ALERT_ARTICLE_PLAY_INTERNET_REQUIRED = 'You need an active internet connection to listen to this article.';
export const ALERT_ARTICLE_DOWNLOAD_FAIL = 'We could not download this article. Please try again.';
export const ALERT_ARTICLE_PLAY_FAIL = 'We could not play this article. Please try again.';
export const ALERT_ARTICLE_PLAY_DOWNLOAD_FAIL = 'We could not play or download this article. Please try again.';

// Alerts related to the playlist
export const ALERT_PLAYLIST_REMOVE_ARTICLE_FAIL = 'We could not remove this article from your playlist. Please try again later.';
export const ALERT_PLAYLIST_FAVORITE_ARTICLE_FAIL = 'We could not favorite this article. Please try again later.';
export const ALERT_PLAYLIST_UNFAVORITE_ARTICLE_FAIL = 'We could not unfavorite this article. Please try again later.';
export const ALERT_PLAYLIST_ARCHIVE_ARTICLE_FAIL = 'We could not archive this article. Please try again later.';
export const ALERT_PLAYLIST_UNARCHIVE_ARTICLE_FAIL = 'We could not unarchive this article. Please try again later.';
export const ALERT_PLAYLIST_UPDATE_FAIL = 'We could get your up-to-date playlist.';

// Alerts on the settings screen
export const ALERT_SETTINGS_SET_CACHE_SIZE_FAIL = 'We could not set the cache size.';
export const ALERT_SETTINGS_RESET_CACHE_FAIL = 'We could not clear the cache. Please try again.';
export const ALERT_SETTINGS_CLEAR_CACHE_WARNING = 'This will delete the already downloaded article audio and voice previews.';
export const ALERT_SETTINGS_VOICE_CHANGE = 'Articles with already available audio will not be changed to this new voice.';
export const ALERT_SETTINGS_VOICE_PREVIEW_UNAVAILABLE = 'No voice preview available, yet. Please try again later.';
export const ALERT_SETTINGS_LANGUAGES_VOICE_SAVE = 'Saving the selected voice for this language failed. Please try again.';
export const ALERT_SETTINGS_DELETE_USER = 'Deleting your account cannot be undone. All your data will be deleted from our systems.';
export const ALERT_SETTINGS_DELETE_USER_FAIL = 'An error happened while trying to delete your account. Please try again or contact us when this happens all the time.';
export const ALERT_SETTINGS_UPDATE_EMAIL_DIFF = 'The e-mail address given is the same. No need to update :-)';
export const ALERT_SETTINGS_UPDATE_PASSWORD_DIFF_VALIDATION_FAIL = 'The given passwords do not match. Please make sure you typed your passwords correctly.';

export const ALERT_SUBSCRIPTION_INIT_FAIL = 'Could not set up a connection to the App Store. Please try again later.';
export const ALERT_SUBSCRIPTION_EXPIRED = 'Your subscription is expired. To use our Premium or Plus features again, re-subscribe by using the Upgrade button.';
export const ALERT_SUBSCRIPTION_BUY_SUCCESS = 'You can now use the extra features.';
export const ALERT_SUBSCRIPTION_RESTORE_PURCHASE_NOT_FOUND = 'We could not find a subscription purchase to restore. If you had a subscription before, it might be expired. If you think this is incorrect, contact our support.';
export const ALERT_SUBSCRIPTION_RESTORE_NOTHING = 'There are no previous purchases to restore.';
export const ALERT_SUBSCRIPTION_RESTORE_SUCCESS = 'You successfully restored the subscription! You can now use the extra features.';

export const ALERT_SUBSCRIPTION_UPGRADE_PLATFORM_ANDROID = 'Your current active subscription is bought on Android device. Please upgrade using your Android device. Or cancel the subscription on your Android device and then upgrade on your Apple device.';
export const ALERT_SUBSCRIPTION_UPGRADE_PLATFORM_IOS = 'Your current active subscription is bought on an Apple device. Please upgrade using your Apple device. Or cancel that subscription on your Apple device and then upgrade on your Android device.';
export const ALERT_SUBSCRIPTION_RESTORE_PLATFORM_ANDROID = 'You have an active subscription on the Apple App Store. You cannot restore a previous purchase on this Android device.';
export const ALERT_SUBSCRIPTION_RESTORE_PLATFORM_IOS = 'You have an active subscription on the Google Play Store. You cannot restore a previous purchase on this Apple device.';

export const ALERT_PLAYBACK_SPEED_SUBSCRIPTION_ONLY = 'Changing the voice\'s speaking rate is only available for Premium and Plus users.';

export const ALERT_LOGIN_SAVE_TOKEN_FAIL = 'Failed to save authentication credentials. Please try again.';

export const GENERIC_NETWORK_ERROR = 'Could not communicate with the server. Please make sure you have an active internet connection.';

// Reducer messages
export const GET_USER_FAIL_MESSAGE = 'An unknown error happened while getting your account. Please contact us when this happens all the time.';
export const PATCH_USER_FAIL_MESSAGE = 'An unknown error happened while updating your details. Please contact us when this happens all the time.';
export const UPDATE_USER_EMAIL_FAIL_MESSAGE = 'An unknown error happened while updating your e-mail address. Please contact us when this happens all the time.';
export const CREATE_USER_FAIL_MESSAGE = 'An unknown error happened while creating your account. Please contact us when this happens all the time.';
export const DELETE_USER_FAIL_MESSAGE = 'An unknown error happened while deleting your account. Please contact us when this happens all the time.';
export const POST_AUTH_FAIL_MESSAGE = 'An unknown error happened while loggin you in. Please contact us when this happens all the time.';
export const POST_REQUEST_RESET_PASSWORD_TOKEN_FAIL_MESSAGE = 'An unknown error happened while resetting your password. Please contact us when this happens all the time.';
export const POST_UPDATE_PASSWORD_FAIL_MESSAGE = 'An unknown error happened while updating your new password. Please contact us when this happens all the time.';
export const GET_LANGUAGES_FAIL_MESSAGE = 'An unknown error happened while getting the available languages. Please contact us when this happens all the time.';
export const SAVE_SELECTED_VOICE_FAIL_MESSAGE = 'An unknown error happened while saving this voice setting. Please contact us when this happens all the time.';
export const GET_ACTIVE_SUBSCRIPTIONS_FAIL_MESSAGE = 'An unknown error happened while getting the subscriptions. Please contact us when this happens all the time.';
export const POST_VALIDATE_SUBSCRIPTION_RECEIPT_FAIL_MESSAGE = 'An unknown error happened while validation your subscription receipt. Please contact us when this happens all the time.';
export const GET_PLAYLIST_FAIL_MESSAGE = 'An unknown error happened while getting your playlist. Please contact us when this happens all the time.';
export const CREATE_PLAYLIST_ITEM_FAIL_MESSAGE = 'An unknown error happened while adding this article to your playlist. Please contact us when this happens all the time.';
export const FAVORITE_PLAYLIST_ITEM_FAIL_MESSAGE = 'An unknown error happened while favoriting this article. Please contact us when this happens all the time.';
export const UNFAVORITE_PLAYLIST_ITEM_FAIL_MESSAGE = 'An unknown error happened while unfavoriting this article. Please contact us when this happens all the time.';
export const ARCHIVE_PLAYLIST_ITEM_FAIL_MESSAGE = 'An unknown error happened while archiving this article. Please contact us when this happens all the time.';
export const UNARCHIVE_PLAYLIST_ITEM_FAIL_MESSAGE = 'An unknown error happened while unarchiving this article. Please contact us when this happens all the time.';
export const REMOVE_PLAYLIST_ITEM_FAIL_MESSAGE = 'An unknown error happened while removing this article from your playlist. Please contact us when this happens all the time.';
export const REORDER_PLAYLIST_ITEM_FAIL_MESSAGE = 'An unknown error happened while re-ordering this article in your playlist. Please contact us when this happens all the time.';
