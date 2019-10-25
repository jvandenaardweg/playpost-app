import perf, { FirebasePerformanceTypes } from '@react-native-firebase/perf';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Platform } from 'react-native';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';

import { userLanguageCode } from '../locale';
import { setIsActiveUpgradeModal } from '../reducers/subscriptions';
import { selectAuthenticationToken } from '../selectors/auth';
import { store } from '../store';

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

apiClient.interceptors.response.use(async (response) => {
  await stopHttpMetric(response.config, response);
  return response
}, async (error: AxiosError) => {
  await stopHttpMetric(error.config, error.response);

  // Status 402 = Payment Required
  // When this happens the user should be shown an upgrade modal
  if (error.response && error.response.status === 402) {
    return store.dispatch(setIsActiveUpgradeModal(true));
  }

  throw error;
})

// Set the AUTH token for any request
apiClient.interceptors.request.use(async (config) => {
  await startHttpMetric(config)

  const token = selectAuthenticationToken(store.getState())

  if (token) {
    config.headers['Authorization'] =  `Bearer ${token}`;
  }

  // Add some additional, non user identifying, headers for debugging purposes

  // App related
  config.headers['App-Version'] = DeviceInfo.getVersion();
  config.headers['App-Build-Number'] = DeviceInfo.getBuildNumber();
  config.headers['App-Environment'] = Config.NODE_ENV;
  config.headers['App-Bundle-Id'] = DeviceInfo.getBundleId();

  // Device related
  config.headers['Device-Brand'] = DeviceInfo.getBrand();
  config.headers['Device-Manufacturer'] = await DeviceInfo.getManufacturer();
  config.headers['Device'] = await DeviceInfo.getDevice();
  config.headers['Device-Id'] = DeviceInfo.getDeviceId();
  config.headers['Device-System-Name'] = DeviceInfo.getSystemName();
  config.headers['Device-System-Version'] = DeviceInfo.getSystemVersion();
  config.headers['Device-Locale'] = userLanguageCode;
  config.headers['Device-Is-Emulator'] = await DeviceInfo.isEmulator();
  config.headers['Device-Is-Tablet'] = DeviceInfo.isTablet();
  config.headers['Device-Type'] = DeviceInfo.getDeviceType();

  return config;
});

export const isPerfHttpMetricsEnabled = (): boolean => {
  const isEnabled = !__DEV__
  return isEnabled;
}

/**
 * Method to start the httpMetric measurement for Firebase Performance.
 * We only do this in non-development environments.
 *
 * @param config
 */
const startHttpMetric = async (config: AxiosRequestConfig) => {
  if (isPerfHttpMetricsEnabled()) {
    const methodUpperCase = config.method && config.method.toUpperCase();

    if (methodUpperCase && config.url) {
      const httpMetric = perf().newHttpMetric(config.url, methodUpperCase as FirebasePerformanceTypes.HttpMethod);

      config['metadata'] = { httpMetric }

      await httpMetric.start();
    }
  }
}

/**
 * Method to stop the httpMetric measurement for Firebase Performance.
 * We only do this in non-development environments.
 *
 * @param config
 */
const stopHttpMetric = async (config: AxiosRequestConfig, response?: AxiosResponse<any>) => {
  if (isPerfHttpMetricsEnabled()) {
    if (config['metadata']) {
      const { httpMetric } = config['metadata'];

      if (response) {
        httpMetric.setHttpResponseCode(response.status);
        httpMetric.setResponseContentType(response.headers['content-type']);
      }

      await httpMetric.stop();
    }
  }
}

export { apiClient };
