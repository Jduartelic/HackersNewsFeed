import React from 'react';
import {render, waitFor, screen} from '@testing-library/react-native';
import NewsFeed from './NewsFeed';

import {NavigationContainer} from '@react-navigation/native';
import {Fixtures, News} from '../../../../domain';
import {
  StateStoreNewsData,
  defaultNewsContextValues,
  NewsContext,
} from '../../../stores/entities';

const mockDispatchNewsData = jest.fn();
const mockStateStoreNewsData: StateStoreNewsData =
  defaultNewsContextValues.stateNewsData;
const mockNewsFixtures = Fixtures.NewsList;
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
  newsDataList,
  stateStoreNewsData,
}: {
  newsDataList: News;
  stateStoreNewsData: StateStoreNewsData;
}) => {
  return render(
    <NavigationContainer>
      <NewsContext.Provider
        value={{
          stateNewsData: {...stateStoreNewsData},
          dispatchNewsData: mockDispatchNewsData,
        }}>
        <NewsFeed newsDataList={newsDataList} />
      </NewsContext.Provider>
    </NavigationContainer>,
  );
};

describe('NewsFeed', () => {
  it('renders NewsFeed component correctly', () => {
    renderScreen({
      newsDataList: mockNewsFixtures,
      stateStoreNewsData: mockStateStoreNewsData,
    });
    const mainComponent = screen.getByTestId('container-news-feed');
    expect(mainComponent).toBeDefined();
  });

  it('should execute a pull down to refresh', async () => {
    renderScreen({
      newsDataList: mockNewsFixtures,
      stateStoreNewsData: mockStateStoreNewsData,
    });
    const mainComponent = screen.getByTestId('container-news-feed');
    const {refreshControl} = mainComponent.props;

    refreshControl.props.onRefresh();
    await waitFor(() => {
      expect(mockDispatchNewsData).toHaveBeenCalled();
    });
    expect(mainComponent).toBeDefined();
  });
});
