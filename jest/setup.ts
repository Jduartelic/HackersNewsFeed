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

jest.mock('@notifee/react-native', () => {
  /**
   * Devido a vários problemas ao importar o mock oferecido pela notifee, resolvi
   * criar manualmente o mock apenas das funcionalidades que utilizamos no app.
   * https://github.com/invertase/notifee/issues/739
   */

  const notifee = {
    getInitialNotification: jest.fn().mockResolvedValue(null),
    displayNotification: jest.fn().mockResolvedValue({}),
    onForegroundEvent: jest.fn().mockReturnValue(jest.fn()),
    onBackgroundEvent: jest.fn(),
    createChannelGroup: jest.fn().mockResolvedValue('channel-group-id'),
    createChannel: jest.fn().mockResolvedValue({}),
    requestPermission: jest
      .fn()
      .mockResolvedValue({authorizationStatus: 'granted'}),
  };

  return {
    ...jest.requireActual('@notifee/react-native/dist/types/Notification'),
    __esModule: true,
    default: notifee,
  };
});

jest.mock('react-native-background-timer-android', () => ({
  TIMER_EVENT: 'timerEvent', // Mock the TIMER_EVENT property
  start: jest.fn(),
  stop: jest.fn(),
  setTimeout: jest.fn((callback, timeout) => {
    setTimeout(callback, timeout); // Simulate the timer functionality
  }),
  clearTimeout: jest.fn(id => {
    clearTimeout(id); // Clear the timer
  }),
}));

jest.mock('react-native-webview', () => {
  const MockWebView = jest.requireActual('react-native').View;

  return {
    __esModule: true,
    WebView: MockWebView,
    default: MockWebView,
  };
});

export const navigationTabBarMock = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  dispatch: jest.fn(),
  emit: jest.fn(),
  getId: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(),
  jumpTo: jest.fn(),
  navigate: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
  push: jest.fn(),
  removeListener: jest.fn(),
  replace: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
};

export const optionsTabBarMock = {
  header: jest.fn(),
};

export const routeMocksTabNavigator = [
  {
    key: 'HomeScreen-sPdh_xjdOxrMtgPqOVtED',
    name: 'HomeScreen',
    params: undefined,
  },

  {
    key: 'PreferenceScreen-aJVmNbjGzMaeDNaTmXvmJ',
    name: 'PreferenceScreen',
    params: undefined,
  },
];
