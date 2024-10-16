import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  NewsContext,
  StateStoreNewsData,
  defaultNewsContextValues,
} from '../../stores/entities';
import {render, screen} from '@testing-library/react-native';
import {Fixtures} from '../../../domain';
import FavoritesScreen from './FavoritesScreen';

const mockStateStoreNewsData: StateStoreNewsData =
  defaultNewsContextValues.stateNewsData;
const mockDispatchNewsData = jest.fn();
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
          dispatchNewsData: mockDispatchNewsData,
        }}>
        <FavoritesScreen />
      </NewsContext.Provider>
      ,
    </NavigationContainer>,
  );

describe('FavoritesScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should render component FavoritesScreen correctly', async () => {
    renderScreen({
      stateStoreNewsData: {
        ...mockStateStoreNewsData,
        state: {
          ...mockStateStoreNewsData.state,
          newsList: Fixtures.NewsList,
          favoritesNewsList: [Fixtures.NewsList.data[0].storyId],
        },
      },
    });

    const mainComponent = screen.getByTestId('favorites-news-container');

    expect(mainComponent).toBeTruthy();
  });

  it('should render Skeleton component on loading state', async () => {
    renderScreen({
      stateStoreNewsData: {
        ...mockStateStoreNewsData,
        state: {
          ...mockStateStoreNewsData.state,
        },
        loading: true,
      },
    });

    const mainComponent = screen.getByTestId('favorites-news-container');

    expect(mainComponent).toBeTruthy();
  });
});
