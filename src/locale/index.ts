import * as RNLocalize from 'react-native-localize';

const userLocales = RNLocalize.getLocales();

export const userLanguageCode = (userLocales && userLocales.length) ? userLocales[0].languageCode : 'en'; // Fallback to en
