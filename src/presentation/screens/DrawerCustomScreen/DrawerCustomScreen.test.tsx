import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  NewsContext,
  StateStoreNewsData,
  defaultNewsContextValues,
} from '../../stores/entities';
import {
  fireEvent,
  render,
  waitFor,
  screen,
} from '@testing-library/react-native';
import DrawerCustomScreen from './DrawerCustomScreen';
import {Fixtures} from '../../../domain';

const mockStateStoreNewsData: StateStoreNewsData =
  defaultNewsContextValues.stateNewsData;
const mockedNavigate = jest.fn();
const mockedGoBack = jest.fn();
const mockedToggleDrawer = jest.fn();

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
    }),
    useIsFocused: () => true,
  };
});

const renderScreen = ({
  stateStoreNewsData = mockStateStoreNewsData,
}: {
  stateStoreNewsData: StateStoreNewsData;
}) =>
  render(
    <NavigationContainer>
      <NewsContext.Provider
        value={{
          stateNewsData: {...stateStoreNewsData},
          dispatchNewsData: defaultNewsContextValues.dispatchNewsData,
        }}>
        <DrawerCustomScreen />
      </NewsContext.Provider>
    </NavigationContainer>,
  );

describe('DrawerCustomScreen', () => {
  afterAll(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  it('should render component and by tapping cemetery screen and should navigate', async () => {
    jest.useFakeTimers();

    renderScreen({
      stateStoreNewsData: {
        ...mockStateStoreNewsData,
        state: {
          ...mockStateStoreNewsData.state,
          deletedNewsList: Fixtures.NewsList,
          favoritesNewsList: {data: []},
        },
      },
    });

    const componentButtonCemetery = screen.getByTestId('button-cemetery');
    fireEvent.press(componentButtonCemetery);
    await waitFor(
      async () => {
        expect(mockedNavigate).toHaveBeenCalled();
      },
      {timeout: 1000},
    );
    mockedNavigate.mockClear();
    const componentButtonFavorites = screen.getByTestId('button-favorites');
    fireEvent.press(componentButtonFavorites);
    await waitFor(
      async () => {
        expect(mockedNavigate).not.toHaveBeenCalled();
      },
      {timeout: 1000},
    );
  });

  it('should render component and by tapping favorites should navigate', async () => {
    jest.useFakeTimers();

    renderScreen({
      stateStoreNewsData: {
        ...mockStateStoreNewsData,
        state: {
          ...mockStateStoreNewsData.state,
          deletedNewsList: {data: []},
          favoritesNewsList: Fixtures.NewsList,
        },
      },
    });

    const componentButtonCemetery = screen.getByTestId('button-cemetery');
    fireEvent.press(componentButtonCemetery);
    await waitFor(
      async () => {
        expect(mockedNavigate).not.toHaveBeenCalled();
      },
      {timeout: 1000},
    );
    mockedNavigate.mockClear();
    const componentButtonFavorites = screen.getByTestId('button-favorites');
    fireEvent.press(componentButtonFavorites);
    await waitFor(
      async () => {
        expect(mockedNavigate).toHaveBeenCalled();
      },
      {timeout: 1000},
    );
  });

  it('should goBack and close Drawer', async () => {
    jest.useFakeTimers();

    renderScreen({
      stateStoreNewsData: {
        ...mockStateStoreNewsData,
        state: {
          ...mockStateStoreNewsData.state,
          deletedNewsList: Fixtures.NewsList,
        },
      },
    });

    const componentButtonCemetery = screen.getByTestId('button-go-back');
    fireEvent.press(componentButtonCemetery);
    await waitFor(
      async () => {
        expect(mockedGoBack).toHaveBeenCalled();
      },
      {timeout: 1000},
    );
  });
});
