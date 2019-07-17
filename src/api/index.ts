import axios from 'axios';
import { Platform } from 'react-native';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';
import * as Keychain from 'react-native-keychain';

export const keychainArguments = Platform.select({
  ios: { accessGroup: 'group.playpost', service: 'com.aardwegmedia.playpost' },
  android: { service: 'com.aardwegmedia.playpost' }
});

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
  const credentials = await Keychain.getGenericPassword(keychainArguments);

  if (credentials) {
    const token = credentials.password;
    config.headers['Authorization'] =  token ? `Bearer ${token}` : '';
  }

  // Add some additional, non user identifying, headers for debugging purposes

  // App related
  config.headers['App-Version'] = DeviceInfo.getVersion();
  config.headers['App-Build-Number'] = DeviceInfo.getBuildNumber();
  config.headers['App-Environment'] = Config.NODE_ENV;
  config.headers['App-Bundle-Id'] = DeviceInfo.getBundleId();

  // Device related
  config.headers['Device-Brand'] = DeviceInfo.getBrand();
  config.headers['Device-Manufacturer'] = DeviceInfo.getManufacturer();
  config.headers['Device'] = DeviceInfo.getDevice();
  config.headers['Device-Id'] = DeviceInfo.getDeviceId();
  config.headers['Device-System-Name'] = DeviceInfo.getSystemName();
  config.headers['Device-System-Version'] = DeviceInfo.getSystemVersion();
  config.headers['Device-Locale'] = DeviceInfo.getDeviceLocale();
  config.headers['Device-Is-Emulator'] = DeviceInfo.isEmulator();
  config.headers['Device-Is-Tablet'] = DeviceInfo.isTablet();
  config.headers['Device-Type'] = DeviceInfo.getDeviceType();

  return config;
});

export { apiClient };
