//jest.setup.js

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('react-native', () => {
  const ReactNative = jest.requireActual('react-native');
  ReactNative.NativeModules.DeviceInfoManager = {
    getUniqueDeviceId: jest.fn().mockResolvedValue('device-id-test-12345'),
  };

  return ReactNative;
});

jest.mock('react-native-webview', () => ({
  default: () => jest.fn(),
}));

jest.mock('react-native/Libraries/Utilities/BackHandler', () => {
  return jest.requireActual(
    'react-native/Libraries/Utilities/__mocks__/BackHandler.js',
  );
});
