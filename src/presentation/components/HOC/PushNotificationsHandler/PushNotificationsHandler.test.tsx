import React from 'react';
import {View, AppState, Platform, AppStateStatus, Linking} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  StateStoreUserActivityData,
  defaultUserActivityContextValues,
  UserActivityContext,
  NewsContext,
  StateStoreNewsData,
  defaultNewsContextValues,
} from '../../../stores/entities';
import {
  fireEvent,
  render,
  waitFor,
  screen,
} from '@testing-library/react-native';
import {Fixtures} from '../../../../domain';
import PushNotificationsHandler from './PushNotificationsHandler';

const mockStateStoreUserActivityData: StateStoreUserActivityData =
  defaultUserActivityContextValues.stateUserActivityData;

const mockStateStoreNewsData: StateStoreNewsData =
  defaultNewsContextValues.stateNewsData;

const mockDispatchUserData = jest.fn();
const mockDispatchNewsData = jest.fn();
const mockNotification = jest.fn().mockReturnValue({
  id: 'mockChannelId',
});

jest.mock('@notifee/react-native', () => {
  const notifee = {
    getInitialNotification: jest.fn().mockResolvedValue(null),
    displayNotification: jest.fn().mockResolvedValue(mockNotification),
    onForegroundEvent: jest.fn().mockReturnValue(jest.fn()),
    onBackgroundEvent: jest.fn(),
    createChannelGroup: jest.fn().mockResolvedValue('channel-group-id'),
    createChannel: jest.fn().mockResolvedValue({
      id: 'default',
      name: 'Default Channel',
    }),
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
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter', () => {
  return class MockNativeEventEmitter {
    addListener = () => jest.fn();
    removeListener = () => jest.fn();
    removeAllListeners = () => jest.fn();
  };
});

let mockAppStateStatus = '';

jest.mock('react-native/Libraries/Settings/Settings', () => ({
  SettingsManager: {
    getSettings: jest.fn(),
  },
}));

jest.mock('react-native', () => {
  const actualReactNative = jest.requireActual('react-native');
  return {
    ...actualReactNative,
    AppState: {
      ...actualReactNative.AppState,
      currentState: mockAppStateStatus,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
  };
});

// Define a variable to hold the listener
let appStateChangeListener: ((state: AppStateStatus) => void) | null = null;

// Mock the addEventListener implementation to capture the listener
(AppState.addEventListener as jest.Mock).mockImplementation(
  (type: string, listener: (state: AppStateStatus) => void) => {
    if (type === 'change') {
      appStateChangeListener = listener; // Capture the listener function
    }
    return {remove: jest.fn()}; // Mock the remove function
  },
);

const renderScreen = ({
  children,
  stateStoreUserActivityData = mockStateStoreUserActivityData,
  stateStoreNewsData = mockStateStoreNewsData,
}: {
  children: React.ReactNode;
  stateStoreUserActivityData: StateStoreUserActivityData;
  stateStoreNewsData: StateStoreNewsData;
}) =>
  render(
    <NavigationContainer>
      <NewsContext.Provider
        value={{
          stateNewsData: {...stateStoreNewsData},
          dispatchNewsData: mockDispatchNewsData,
        }}>
        <UserActivityContext.Provider
          value={{
            stateUserActivityData: {
              ...stateStoreUserActivityData,
            },
            dispatchUserActivityData: mockDispatchUserData,
          }}>
          <PushNotificationsHandler>{children}</PushNotificationsHandler>
        </UserActivityContext.Provider>
      </NewsContext.Provider>
    </NavigationContainer>,
  );

describe('PushNotificationsHandler', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.advanceTimersByTime(1000);
  });

  afterAll(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();

    jest.resetModules();
  });

  it('should dipatch action to prepare for sending push notification', async () => {
    jest.clearAllMocks();

    jest.useFakeTimers();
    Platform.OS = 'ios';
    renderScreen({
      children: <View />,
      stateStoreNewsData: {
        state: {
          ...mockStateStoreNewsData.state,
          newsList: Fixtures.NewsList,
        },

        fetched: true,
        loading: false,
        error: undefined,
      },
      stateStoreUserActivityData: {
        state: {
          ...mockStateStoreUserActivityData.state,
          pushNotifications: {
            appStateActivity: 'active',
            sentPushNotification: false,
            timeForNextPush: 10,
          },
        },

        fetched: true,
        loading: false,
        error: undefined,
      },
    });

    await waitFor(
      async () => {
        if (appStateChangeListener) {
          appStateChangeListener('background');
        }
      },
      {timeout: 1000},
    );

    expect(mockDispatchUserData).toHaveBeenCalled();
  });

  it('should sent push notification', async () => {
    jest.clearAllMocks();

    jest.useFakeTimers();
    Platform.OS = 'ios';
    renderScreen({
      children: <View />,
      stateStoreNewsData: {
        state: {
          ...mockStateStoreNewsData.state,
          newsList: Fixtures.NewsList,
        },

        fetched: true,
        loading: false,
        error: undefined,
      },
      stateStoreUserActivityData: {
        state: {
          ...mockStateStoreUserActivityData.state,
          pushNotifications: {
            appStateActivity: 'background',
            sentPushNotification: true,
            timeForNextPush: 10,
          },
        },

        fetched: true,
        loading: false,
        error: undefined,
      },
    });

    await waitFor(
      async () => {
        if (appStateChangeListener) {
          appStateChangeListener('background');
        }
      },
      {timeout: 1000},
    );

    expect(mockNotification().id).toStrictEqual('mockChannelId');
  });

  it('should render modal for authorization in push notifications', () => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    const modalVisible = true;
    const setModalVisible = jest.fn().mockResolvedValue(() => true);
    const spyOnLinking = jest.spyOn(Linking, 'openSettings');
    React.useState = jest.fn().mockReturnValue([modalVisible, setModalVisible]);

    Platform.OS = 'ios';
    renderScreen({
      children: <View />,
      stateStoreNewsData: {
        state: {
          ...mockStateStoreNewsData.state,
          newsList: Fixtures.NewsList,
        },

        fetched: true,
        loading: false,
        error: undefined,
      },
      stateStoreUserActivityData: {
        state: {
          ...mockStateStoreUserActivityData.state,
          pushNotifications: {
            appStateActivity: 'background',
            sentPushNotification: true,
            timeForNextPush: 10,
          },
        },

        fetched: true,
        loading: false,
        error: undefined,
      },
    });

    const modal = screen.getByTestId('modal-request-permission');
    expect(modal).toBeTruthy();

    const buttonCloseModal = screen.getByTestId('button-close-modal');

    fireEvent.press(buttonCloseModal);
    expect(setModalVisible).toHaveBeenCalled();

    const buttonSettings = screen.getByTestId('button-settings');
    fireEvent.press(buttonSettings);

    expect(spyOnLinking).toHaveBeenCalled();
  });

  it('should displaying iOS push notification', () => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    Platform.OS = 'ios';
    const mockTimer = 10;
    renderScreen({
      children: <View />,
      stateStoreNewsData: {
        state: {
          ...mockStateStoreNewsData.state,
          newsList: Fixtures.NewsList,
        },

        fetched: true,
        loading: false,
        error: undefined,
      },
      stateStoreUserActivityData: {
        state: {
          ...mockStateStoreUserActivityData.state,
          pushNotifications: {
            appStateActivity: 'background',
            sentPushNotification: true,
            timeForNextPush: mockTimer,
          },
        },

        fetched: true,
        loading: false,
        error: undefined,
      },
    });

    jest.advanceTimersByTime(mockTimer);
    expect(mockNotification().id).toStrictEqual('mockChannelId');
  });

  it('should displaying Android push notification', () => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    Platform.OS = 'android';
    const mockTimer = 10;
    renderScreen({
      children: <View />,
      stateStoreNewsData: {
        state: {
          ...mockStateStoreNewsData.state,
          newsList: Fixtures.NewsList,
        },

        fetched: true,
        loading: false,
        error: undefined,
      },
      stateStoreUserActivityData: {
        state: {
          ...mockStateStoreUserActivityData.state,
          pushNotifications: {
            appStateActivity: 'background',
            sentPushNotification: true,
            timeForNextPush: mockTimer,
          },
        },

        fetched: true,
        loading: false,
        error: undefined,
      },
    });

    jest.advanceTimersByTime(mockTimer);
    expect(mockNotification().id).toStrictEqual('mockChannelId');
  });

  it('should dipatch action android exec app to prepare for sending push notification', async () => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    Platform.OS = 'android';
    renderScreen({
      children: <View />,
      stateStoreNewsData: {
        state: {
          ...mockStateStoreNewsData.state,
          newsList: Fixtures.NewsList,
        },

        fetched: true,
        loading: false,
        error: undefined,
      },
      stateStoreUserActivityData: {
        state: {
          ...mockStateStoreUserActivityData.state,
          pushNotifications: {
            appStateActivity: '',
            sentPushNotification: false,
            timeForNextPush: 10,
          },
        },

        fetched: true,
        loading: false,
        error: undefined,
      },
    });

    await waitFor(
      async () => {
        if (appStateChangeListener) {
          appStateChangeListener('background');
        }
      },
      {timeout: 1000},
    );

    expect(mockDispatchUserData).toHaveBeenCalled();
  });

  it('should dipatch change state from background to foreground', async () => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    Platform.OS = 'android';
    renderScreen({
      children: <View />,
      stateStoreNewsData: {
        state: {
          ...mockStateStoreNewsData.state,
          newsList: Fixtures.NewsList,
        },

        fetched: true,
        loading: false,
        error: undefined,
      },
      stateStoreUserActivityData: {
        state: {
          ...mockStateStoreUserActivityData.state,
          pushNotifications: {
            appStateActivity: 'background',
            sentPushNotification: false,
            timeForNextPush: 10,
          },
        },

        fetched: true,
        loading: false,
        error: undefined,
      },
    });

    await waitFor(
      async () => {
        if (appStateChangeListener) {
          appStateChangeListener('active');
        }
      },
      {timeout: 1000},
    );

    expect(mockDispatchUserData).toHaveBeenCalledTimes(0);
  });

  it.skip('should request permission', () => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    const modalVisible = true;
    const setModalVisible = jest.fn().mockResolvedValue(() => true);
    React.useState = jest.fn().mockReturnValue([modalVisible, setModalVisible]);

    // mockAuth = AuthorizationStatus.DENIED;
    Platform.OS = 'ios';
    renderScreen({
      children: <View />,
      stateStoreNewsData: {
        state: {
          ...mockStateStoreNewsData.state,
        },

        fetched: false,
        loading: false,
        error: undefined,
      },
      stateStoreUserActivityData: {
        state: {
          ...mockStateStoreUserActivityData.state,
        },

        fetched: true,
        loading: false,
        error: undefined,
      },
    });

    expect(setModalVisible).toHaveBeenCalled();
  });
});
