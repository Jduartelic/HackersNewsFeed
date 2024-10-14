import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  waitFor,
  render,
  screen,
  fireEvent,
} from '@testing-library/react-native';
import WebViewScreen from './WebViewScreen';

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
      replace: mockedReplace,
    }),
    useIsFocused: () => mockIsFocus,
  };
});

const BackHandler = jest.requireActual(
  'react-native/Libraries/Utilities/__mocks__/BackHandler.js',
);

const navigationTabBarMock = {
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

const renderScreen = () =>
  render(
    <NavigationContainer>
      <WebViewScreen
        route={{
          key: 'WebViewScreen-oDLbm4ODVUM-X65f-KK6C',
          name: 'WebViewScreen',
          params: {
            url: 'http-mock',
          },
          path: undefined,
        }}
        navigation={{
          ...navigationTabBarMock,
          isFocused: () => mockIsFocus,
        }}
      />
    </NavigationContainer>,
  );

describe('WebViewScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.useRealTimers();
  });
  afterEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.useRealTimers();
  });
  it('should attemp to goback with back button but not working cause is not in focus', async () => {
    mockIsFocus = false;
    renderScreen();

    const webView = screen.getByTestId('web-view-container');
    expect(webView).toBeDefined();

    BackHandler.mockPressBack();

    await waitFor(() => {
      expect(mockedGoBack).toHaveBeenCalledTimes(0);
    });
  });

  it('should render webpage in WebViewScreen and attemp to goback with back button', async () => {
    mockIsFocus = true;

    renderScreen();

    const webView = screen.getByTestId('web-view-container');
    fireEvent(webView, 'onLoadStart', {nativeEvent: {title: 'test '}});
    fireEvent(webView, 'renderLoading', {nativeEvent: {loading: true}});
    fireEvent(webView, 'onLoadEnd', {nativeEvent: {title: 'test '}});
    expect(webView).toBeDefined();

    BackHandler.mockPressBack();

    await waitFor(() => {
      expect(mockedGoBack).toHaveBeenCalledTimes(1);
    });
  });
});
