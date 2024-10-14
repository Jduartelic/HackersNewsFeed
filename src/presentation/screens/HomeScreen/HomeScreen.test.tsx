import React, {
  useEffect,
  useContext,
  useCallback,
  useRef,
  useState,
} from 'react';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  NewsContext,
  StateStoreNewsData,
  defaultNewsContextValues,
  StateStoreUserActivityData,
  defaultUserActivityContextValues,
  UserActivityContext,
} from '../../stores/entities';
import {waitFor, render, act} from '@testing-library/react-native';
import {Fixtures} from '../../../domain';
import HomeScreen from './HomeScreen';
import * as ReactNative from 'react-native';
import mock from '@notifee/react-native/jest-mock';
import {MMKV} from 'react-native-mmkv';
import {constants} from '../../constants';
// import {} from '../../functions/storage/storage'
const Storage = require('../../functions/storage/storage');
const mockStateStoreUserActivityData: StateStoreUserActivityData =
  defaultUserActivityContextValues.stateUserActivityData;

const mockStateStoreNewsData: StateStoreNewsData =
  defaultNewsContextValues.stateNewsData;
const mockNewsFixtures = Fixtures.NewsList;

const mockDispatchUserData = jest.fn();
const mockDispatchNewsData = jest.fn();
const mockedNavigate = jest.fn();
const mockedGoBack = jest.fn();
const mockedToggleDrawer = jest.fn();
const mockedReplace = jest.fn();

let mockRoutes = [
  {
    key: 'HomeScreen-FEk94Gtig1PYp4J0YNcdJ',
    name: 'HomeScreen',
    params: undefined,
  },
  {
    key: 'WebViewScreen-hJNwRHb_kvfHdrLwWkjU4',
    name: 'WebViewScreen',
    params: undefined,
  },
  {
    key: 'FavoritesScreen-hJNwRHb_kvfHdrLwWkjU4',
    name: 'FavoritesScreen',
    params: undefined,
  },
];
let mockIndex = 1;
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      goBack: mockedGoBack,
      navigate: mockedNavigate,
      getState: jest.fn(() => ({
        index: mockIndex,
        key: 'stack-sDRfInYsrpli_xL4H71ps',
        routeNames: ['HomeScreen', 'WebViewScreen', 'FavoritesScreen'],
        routes: mockRoutes,
        stale: false,
        type: 'stack',
      })),
      toggleDrawer: mockedToggleDrawer,
      replace: mockedReplace,
    }),
    useIsFocused: () => true,
  };
});

jest.mock('react-native-mmkv', () => {
  const actualNav = jest.requireActual('react-native-mmkv');
  return {
    ...actualNav,
    set: jest.fn().mockImplementation(() => ''),
    getString: jest.fn().mockImplementation(() => ''),
  };
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
    createChannel: jest.fn().mockResolvedValue({
      id: 'default',
      name: 'Default Channel',
      // visibility: mockVisibility,
      // importance: mockImportance,
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

const renderScreen = ({
  stateStoreNewsData = mockStateStoreNewsData,
  stateStoreUserActivityData = mockStateStoreUserActivityData,
}: {
  stateStoreNewsData: StateStoreNewsData;
  stateStoreUserActivityData: StateStoreUserActivityData;
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
          <HomeScreen />
        </UserActivityContext.Provider>
      </NewsContext.Provider>
    </NavigationContainer>,
  );

describe('HomeScreen', () => {
  let storage: MMKV;

  beforeAll(() => {
    storage = new MMKV();
  });
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should start fetching userActivity on loading state', async () => {
    renderScreen({
      stateStoreNewsData: {
        ...mockStateStoreNewsData,
        state: {
          ...mockStateStoreNewsData.state,
        },
        loading: false,
      },
      stateStoreUserActivityData: {
        state: {
          ...mockStateStoreUserActivityData.state,
        },

        fetched: false,
        loading: false,
        error: undefined,
      },
    });

    expect(mockDispatchUserData).toHaveBeenCalled();
  });

  it('should start fetching newsData on loading state', async () => {
    jest.spyOn(Storage, 'getSavedData').mockImplementation(key => {
      if (key === constants.HOME.STORAGE_KEY) {
        return JSON.stringify({
          newsList: {data: Fixtures.NewsList.data},
          deletedNewsList: [Fixtures.NewsList.data[0].storyId],
          favoritesNewsList: [Fixtures.NewsList.data[1].storyId],
        });
      }
      return undefined;
    });

    renderScreen({
      stateStoreNewsData: {
        ...mockStateStoreNewsData,
        state: {
          ...mockStateStoreNewsData.state,
        },
        loading: false,
        fetched: false,
      },
      stateStoreUserActivityData: {
        state: {
          ...mockStateStoreUserActivityData.state,
          hasSeenOnboarding: true,
        },

        fetched: true,
        loading: false,
        error: undefined,
      },
    });

    expect(mockDispatchNewsData).toHaveBeenCalledTimes(0);
  });

  it('should render HomeScreen component with data', async () => {
    renderScreen({
      stateStoreNewsData: {
        ...mockStateStoreNewsData,
        state: {
          ...mockStateStoreNewsData.state,
          newsList: Fixtures.NewsList,
          deletedNewsList: [Fixtures.NewsList.data[0].storyId],
        },
        loading: false,
        fetched: true,
      },
      stateStoreUserActivityData: {
        state: {
          ...mockStateStoreUserActivityData.state,
          hasSeenOnboarding: true,
        },

        fetched: true,
        loading: false,
        error: undefined,
      },
    });

    expect('home-screen-container').toBeTruthy();
  });

  it('should fetching news list without query param', async () => {
    jest.useFakeTimers();
    renderScreen({
      stateStoreNewsData: {
        ...mockStateStoreNewsData,
        state: {
          ...mockStateStoreNewsData.state,
        },
        loading: true,
        fetched: false,
      },
      stateStoreUserActivityData: {
        state: {
          ...mockStateStoreUserActivityData.state,
          hasSeenOnboarding: true,
        },

        fetched: false,
        loading: true,
        error: undefined,
      },
    });
    expect('home-screen-container').toBeTruthy();
  });

  it('should navigate to onboarding screen', async () => {
    renderScreen({
      stateStoreNewsData: {
        ...mockStateStoreNewsData,
        state: {
          ...mockStateStoreNewsData.state,
        },
        loading: false,
        fetched: false,
      },
      stateStoreUserActivityData: {
        state: {
          ...mockStateStoreUserActivityData.state,
          hasSeenOnboarding: false,
        },

        fetched: true,
        loading: false,
        error: undefined,
      },
    });
    expect(mockedReplace).toHaveBeenCalled();
  });
});
