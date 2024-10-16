import React from 'react';
import {ImageSourcePropType} from 'react-native';
import {
  fireEvent,
  render,
  waitFor,
  screen,
} from '@testing-library/react-native';
import MainHeader from './MainHeader';
import {NavigationContainer} from '@react-navigation/native';
import {
  StateStoreUserActivityData,
  defaultUserActivityContextValues,
  UserActivityContext,
  NewsContext,
  StateStoreNewsData,
  defaultNewsContextValues,
} from '../../../stores/entities';
import {Fixtures} from '../../../../domain';

const mockedNavigate = jest.fn();
const mockedGoBack = jest.fn();
const mockedToggleDrawer = jest.fn();
const mockDispatchUserData = jest.fn();
const mockDispatchNewsData = jest.fn();
const mockStateStoreUserActivityData: StateStoreUserActivityData =
  defaultUserActivityContextValues.stateUserActivityData;
const mockStateStoreNewsData: StateStoreNewsData =
  defaultNewsContextValues.stateNewsData;
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
let mockIsFocus = true;
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
      isFocused: jest.fn().mockResolvedValue(mockIsFocus),
    }),
    useIsFocused: () => true,
  };
});

const renderScreen = ({
  iconLeft,
  imageSource,
  iconRight = 'chevron-right',
  stateStoreUserActivityData = mockStateStoreUserActivityData,
  stateStoreNewsData = mockStateStoreNewsData,
}: {
  iconLeft: string;
  stateStoreUserActivityData: StateStoreUserActivityData;
  stateStoreNewsData: StateStoreNewsData;
  imageSource?: ImageSourcePropType;
  iconRight?: string;
}) => {
  return render(
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
          <MainHeader
            iconLeft={{name: iconLeft}}
            imageSource={imageSource}
            iconRight={{name: iconRight}}
          />
        </UserActivityContext.Provider>
      </NewsContext.Provider>
    </NavigationContainer>,
  );
};

describe('MainHeader', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });
  it('renders MainHeader on WebViewScreen correctly and press button', async () => {
    renderScreen({
      iconLeft: 'chevron-left',
      iconRight: 'chevron-left',
      imageSource: 0,
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
    const mainComponent = screen.getByTestId('main-header');
    expect(mainComponent).toBeDefined();

    const buttonComponent = screen.getByTestId('button-left-header');

    fireEvent.press(buttonComponent);
    await waitFor(
      async () => {
        expect(mockedGoBack).toHaveBeenCalled();
      },
      {timeout: 1000},
    );
  });

  it('renders MainHeader on HomeScreen correctly and press button', async () => {
    mockIndex = 0;
    renderScreen({
      iconLeft: 'chevron-left',
      iconRight: 'chevron-left',
      imageSource: 0,
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
    const mainComponent = screen.getByTestId('main-header');
    expect(mainComponent).toBeDefined();

    const buttonComponent = screen.getByTestId('button-left-header');

    fireEvent.press(buttonComponent);
    await waitFor(
      async () => {
        expect(mockedToggleDrawer).toHaveBeenCalled();
      },
      {timeout: 1000},
    );
  });

  it('renders MainHeader on HomeScreen correctly and navigate to FavoriteScreen', async () => {
    mockIndex = 0;
    renderScreen({
      iconLeft: 'chevron-left',
      iconRight: 'chevron-left',
      imageSource: undefined,
      stateStoreNewsData: {
        state: {
          ...mockStateStoreNewsData.state,
          newsList: Fixtures.NewsList,
          favoritesNewsList: Fixtures.NewsList,
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
          querySearch: 'mock',
        },

        fetched: true,
        loading: false,
        error: undefined,
      },
    });
    const mainComponent = screen.getByTestId('main-header');
    expect(mainComponent).toBeDefined();

    const buttonComponent = screen.getByTestId('button-right-header');

    fireEvent.press(buttonComponent);

    render;
    const inputComponent = screen.getByTestId('search-bar-input');

    fireEvent.changeText(inputComponent, 'mockPasswordInput');
    fireEvent.press(buttonComponent);

    await waitFor(
      async () => {
        expect(mockDispatchNewsData).toHaveBeenCalled();
      },
      {timeout: 1000},
    );
  });

  it('renders remove header elements by focus and go back', async () => {
    mockIndex = 0;
    mockIsFocus = true;
    renderScreen({
      iconLeft: 'chevron-left',
      iconRight: 'chevron-left',
      imageSource: undefined,
      stateStoreNewsData: {
        state: {
          ...mockStateStoreNewsData.state,
          newsList: Fixtures.NewsList,
        },

        fetched: true,
        loading: false,
        error: {
          message: 'mock',
          name: 'mock',
        },
      },
      stateStoreUserActivityData: {
        state: {
          ...mockStateStoreUserActivityData.state,
          pushNotifications: {
            appStateActivity: 'background',
            sentPushNotification: true,
            timeForNextPush: 10,
          },
          querySearch: 'mock',
        },

        fetched: true,
        loading: false,
        error: undefined,
      },
    });
    const mainComponent = screen.getByTestId('main-header');
    expect(mainComponent).toBeDefined();

    const buttonComponent = screen.getByTestId('button-right-header');

    fireEvent.press(buttonComponent);
    await waitFor(
      async () => {
        expect(mockedNavigate).toHaveBeenCalled();
      },
      {timeout: 1000},
    );
  });
});
