import React from 'react';
import {render, screen} from '@testing-library/react-native';
import {NewsContextProvider} from '../stores/entities/News/NewsContext';
import {UserActivityContextProvider} from '../stores/entities/UserActivity/UserActivityContext';
import HackerNewsFeedNavigator from './HackerNewsFeedStack';

const mockedNavigate = jest.fn();
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
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      goBack: mockedNavigate,
      getState: jest.fn(() => ({
        index: 0,
        key: 'stack-sDRfInYsrpli_xL4H71ps',
        routeNames: ['HomeScreen', 'WebViewScreen', 'FavoritesScreen'],
        routes: mockRoutes,
        stale: false,
        type: 'stack',
      })),
      reset: jest.fn(),
      dispatch: jest.fn(),
      isFocused: () => true,
      replace: jest.fn(),
    }),
  };
});

const renderScreen = () => {
  return render(
    <UserActivityContextProvider>
      <NewsContextProvider>
        <HackerNewsFeedNavigator />
      </NewsContextProvider>
    </UserActivityContextProvider>,
  );
};

describe('HackerNewsFeedStack', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  it('should render HackerNewsFeedStack correctly', async () => {
    renderScreen();
    expect(screen).toBeTruthy();
  });
});
