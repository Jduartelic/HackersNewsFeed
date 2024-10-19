import React from 'react';
import {
  fireEvent,
  render,
  waitFor,
  screen,
} from '@testing-library/react-native';
import ButtonTabBar from './ButtonTabBar';
import {NavigationContainer} from '@react-navigation/native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {
  navigationTabBarMock,
  optionsTabBarMock,
  routeMocksTabNavigator,
} from '../../../../../jest/setup';
import {
  StateStoreUserActivityData,
  defaultUserActivityContextValues,
  UserActivityContext,
} from '../../../stores/entities';

const mockedNavigate = jest.fn();
const mockedGoBack = jest.fn();
const mockedToggleDrawer = jest.fn();
const mockedReplace = jest.fn();
const mockStateStoreUserActivityData: StateStoreUserActivityData =
  defaultUserActivityContextValues.stateUserActivityData;
const mockDispatchUserData =
  defaultUserActivityContextValues.dispatchUserActivityData;

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
let mockIndexTabBar = 0;
let mockedTabBarNavigatorProps: BottomTabBarProps = {
  descriptors: {
    'HomeScreen-aJVmNbjGzMaeDNaTmXvmJ': {
      navigation: {...navigationTabBarMock, navigate: mockedNavigate},
      options: optionsTabBarMock,
      render: jest.fn(),
      route: {
        key: 'HomeScreen-sPdh_xjdOxrMtgPqOVtED',
        name: 'HomeScreen',
        params: undefined,
      },
    },
    'PreferenceScreen-sPdh_xjdOxrMtgPqOVtED': {
      navigation: {...navigationTabBarMock, navigate: mockedNavigate},
      options: optionsTabBarMock,
      render: jest.fn(),
      route: {
        key: 'PreferenceScreen-aJVmNbjGzMaeDNaTmXvmJ',
        name: 'PreferenceScreen',
        params: undefined,
      },
    },
  },
  insets: {
    bottom: 34,
    left: 0,
    right: 0,
    top: 47,
  },
  navigation: navigationTabBarMock,
  state: {
    routes: routeMocksTabNavigator,
    history: [],
    index: mockIndexTabBar,
    key: 'tab-_hHI9RmR_5S-zkk_py9Co',
    routeNames: ['HomeScreen', 'PreferenceScreen'],
    stale: false,
    type: 'tab',
  },
};

const renderScreen = () => {
  return render(
    <NavigationContainer>
      <UserActivityContext.Provider
        value={{
          stateUserActivityData: {
            ...mockStateStoreUserActivityData,
          },
          dispatchUserActivityData: mockDispatchUserData,
        }}>
        <ButtonTabBar {...mockedTabBarNavigatorProps} />
      </UserActivityContext.Provider>
    </NavigationContainer>,
  );
};

describe('ButtonTabBar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  it('renders ButtonTabBar navigate to next screen', async () => {
    renderScreen();
    const buttonComponent = screen.getByTestId('bottom-tab-button');
    fireEvent.press(buttonComponent);

    await waitFor(
      async () => {
        expect(buttonComponent).toBeDefined();
      },
      {timeout: 1000},
    );
  });

  it('renders ButtonTabBar dispatch reducer and navigate HomeScreen ', async () => {
    mockedTabBarNavigatorProps = {
      descriptors: mockedTabBarNavigatorProps.descriptors,
      insets: mockedTabBarNavigatorProps.insets,
      navigation: mockedTabBarNavigatorProps.navigation,
      state: {
        ...mockedTabBarNavigatorProps.state,
        index: 1,
      },
    };
    renderScreen();
    const buttonComponent = screen.getByTestId('bottom-tab-button');
    expect(buttonComponent).toBeDefined();

    fireEvent.press(buttonComponent);
    await waitFor(
      async () => {
        expect(mockedReplace).toHaveBeenCalled();
      },
      {timeout: 1000},
    );
  });
});
