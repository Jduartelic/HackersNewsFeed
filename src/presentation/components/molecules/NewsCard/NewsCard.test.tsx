import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react-native';
import NewsCard from './NewsCard';
import {NewsData, Fixtures} from '../../../../domain';
import {
  NewsContext,
  StateStoreNewsData,
  defaultNewsContextValues,
} from '../../../stores/entities';

const mockedNavigate = jest.fn();
const mockedGoBack = jest.fn();
const mockedToggleDrawer = jest.fn();
const mockStateStoreNewsData: StateStoreNewsData =
  defaultNewsContextValues.stateNewsData;
const mockDispatchNewsData = jest.fn();

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
  newsData,
  stateStoreNewsData = mockStateStoreNewsData,
}: {
  newsData: NewsData;
  stateStoreNewsData: StateStoreNewsData;
}) => {
  return render(
    <NewsContext.Provider
      value={{
        stateNewsData: {...stateStoreNewsData},
        dispatchNewsData: mockDispatchNewsData,
      }}>
      <NewsCard {...newsData} />,
    </NewsContext.Provider>,
  );
};

describe('NewsCard', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('renders NewsCard', () => {
    renderScreen({
      newsData: Fixtures.NewsList.data[0],
      stateStoreNewsData: {
        ...mockStateStoreNewsData,
        state: {
          ...mockStateStoreNewsData.state,
          newsList: Fixtures.NewsList,
        },
      },
    });

    const view = screen.getByTestId('layout-provider');

    fireEvent(view, 'onLayout', {
      nativeEvent: {layout: {width: 500}},
    });
    const mainComponent = screen.getByTestId('main-container');
    expect(mainComponent).toBeDefined();
  });

  it('should navigate to webView screen', async () => {
    renderScreen({
      newsData: Fixtures.NewsList.data[0],
      stateStoreNewsData: {
        ...mockStateStoreNewsData,
        state: {
          ...mockStateStoreNewsData.state,
          newsList: Fixtures.NewsList,
          favoritesNewsList: [Fixtures.NewsList.data[0].storyId],
        },
      },
    });

    const mainComponent = screen.getByTestId('body-card');
    fireEvent.press(mainComponent);
    expect(mockedNavigate).toHaveBeenCalled();
  });

  it('should delete a news', async () => {
    renderScreen({
      newsData: Fixtures.NewsList.data[0],
      stateStoreNewsData: {
        ...mockStateStoreNewsData,
        state: {
          ...mockStateStoreNewsData.state,
          newsList: Fixtures.NewsList,
          favoritesNewsList: [Fixtures.NewsList.data[0].storyId],
        },
      },
    });

    const mainComponent = screen.getByTestId('trash-button');
    fireEvent.press(mainComponent);
    expect(mockDispatchNewsData).toHaveBeenCalled();
  });

  it('should add news to favorite', async () => {
    renderScreen({
      newsData: Fixtures.NewsList.data[0],
      stateStoreNewsData: {
        ...mockStateStoreNewsData,
        state: {
          ...mockStateStoreNewsData.state,
          newsList: Fixtures.NewsList,
        },
      },
    });

    const mainComponent = screen.getByTestId('heart-button');
    fireEvent.press(mainComponent);
    expect(mockDispatchNewsData).toHaveBeenCalled();
  });
});
