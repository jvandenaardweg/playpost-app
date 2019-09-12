import axios from 'axios';
import { Platform } from 'react-native';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';

import { userLanguageCode } from '../locale';
import * as keychain from '../utils/keychain';

// Android emulator uses 10.0.2.2 as localhost map
export const baseURL = Platform.select({
  ios: Config.API_URL,
  android: (Config.NODE_ENV === 'development') ? Config.API_URL.replace('localhost', '10.0.2.2') : Config.API_URL
});

const apiClient = axios.create({
  baseURL,
  responseType: 'json',
  timeout: 30000 // 30 seconds timeout, creation of audiofiles could take 10 seconds
});

// Set the AUTH token for any request
apiClient.interceptors.request.use(async (config) => {
  const token = await keychain.getToken();

  if (token) {
    config.headers['Authorization'] =  `Bearer ${token}`;
  }

  // Add some additional, non user identifying, headers for debugging purposes

  // App related
  config.headers['App-Version'] = await DeviceInfo.getVersion();
  config.headers['App-Build-Number'] = await DeviceInfo.getBuildNumber();
  config.headers['App-Environment'] = Config.NODE_ENV;
  config.headers['App-Bundle-Id'] = await DeviceInfo.getBundleId();

  // Device related
  config.headers['Device-Brand'] = await DeviceInfo.getBrand();
  config.headers['Device-Manufacturer'] = await DeviceInfo.getManufacturer();
  config.headers['Device'] = await DeviceInfo.getDevice();
  config.headers['Device-Id'] = await DeviceInfo.getDeviceId();
  config.headers['Device-System-Name'] = await DeviceInfo.getSystemName();
  config.headers['Device-System-Version'] = await DeviceInfo.getSystemVersion();
  config.headers['Device-Locale'] = userLanguageCode;
  config.headers['Device-Is-Emulator'] = await DeviceInfo.isEmulator();
  config.headers['Device-Is-Tablet'] = await DeviceInfo.isTablet();
  config.headers['Device-Type'] = await DeviceInfo.getDeviceType();

  return config;
});

export { apiClient };
