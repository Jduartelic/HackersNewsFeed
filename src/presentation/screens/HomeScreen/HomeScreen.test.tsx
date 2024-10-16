import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  NewsContext,
  StateStoreNewsData,
  defaultNewsContextValues,
  StateStoreUserActivityData,
  defaultUserActivityContextValues,
  UserActivityContext,
} from '../../stores/entities';
import {render, screen, waitFor} from '@testing-library/react-native';
import {Fixtures} from '../../../domain';
import HomeScreen from './HomeScreen';
import {constants} from '../../constants';

const Storage = require('../../functions/storage/storage');
const mockStateStoreUserActivityData: StateStoreUserActivityData =
  defaultUserActivityContextValues.stateUserActivityData;

const mockStateStoreNewsData: StateStoreNewsData =
  defaultNewsContextValues.stateNewsData;

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
  const notifee = {
    getInitialNotification: jest.fn().mockResolvedValue(null),
    displayNotification: jest.fn().mockResolvedValue({}),
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
        loading: true,
        fetched: false,
      },
      stateStoreUserActivityData: {
        state: {
          ...mockStateStoreUserActivityData.state,
          hasSeenOnboarding: true,
          querySearch: '',
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
          deletedNewsList: Fixtures.NewsList,
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
    const component = screen.getByTestId('home-screen-container');

    await waitFor(
      () => {
        expect(component).toBeTruthy();
      },
      {timeout: 10},
    );
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

  it('should fetch news by query param', async () => {
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
          hasSeenOnboarding: false,
          querySearch: 'mock',
        },

        fetched: true,
        loading: false,
        error: undefined,
      },
    });
    expect(mockedReplace).toHaveBeenCalled();
  });
});
