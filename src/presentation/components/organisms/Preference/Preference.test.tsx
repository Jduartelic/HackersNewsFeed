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
  StateStoreUserActivityData,
  defaultUserActivityContextValues,
  UserActivityContext,
  NewsContext,
  StateStoreNewsData,
  defaultNewsContextValues,
} from '../../../stores/entities';
import {fireEvent, render, act} from '@testing-library/react-native';
import {Fixtures} from '../../../../domain';
import Preference from './Preference';
import * as ReactNative from 'react-native';
import mock from '@notifee/react-native/jest-mock';

const mockStateStoreUserActivityData: StateStoreUserActivityData =
  defaultUserActivityContextValues.stateUserActivityData;

const mockNewsFixtures = Fixtures.NewsList;

const mockDispatchUserData = jest.fn();
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
  stateStoreUserActivityData = mockStateStoreUserActivityData,
}: {
  stateStoreUserActivityData: StateStoreUserActivityData;
}) =>
  render(
    <NavigationContainer>
      <UserActivityContext.Provider
        value={{
          stateUserActivityData: {
            ...stateStoreUserActivityData,
          },
          dispatchUserActivityData: mockDispatchUserData,
        }}>
        <Preference />
      </UserActivityContext.Provider>
    </NavigationContainer>,
  );

describe('Preference', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  it('should render component successfully and press to select element', () => {
    const {getByTestId, queryAllByTestId} = renderScreen({
      stateStoreUserActivityData: {
        state: {
          ...mockStateStoreUserActivityData.state,
        },

        fetched: true,
        loading: false,
        error: undefined,
      },
    });
    const component = getByTestId('preferences-container-0');
    expect(component).toBeTruthy();
    const componentButton = queryAllByTestId('pressable-component-0');
    fireEvent.press(componentButton[0]);
    expect(mockDispatchUserData).toHaveBeenCalled();
  });

  it('should render component successfully and keyword android should be selected', () => {
    const {getByTestId, queryAllByTestId} = renderScreen({
      stateStoreUserActivityData: {
        state: {
          ...mockStateStoreUserActivityData.state,
          facetsSelectedByUser: ['Best'],
        },

        fetched: true,
        loading: false,
        error: undefined,
      },
    });
    const component = getByTestId('preferences-container-0');
    expect(component).toBeTruthy();
    const componentButton = queryAllByTestId('pressable-component-0');
    fireEvent.press(componentButton[0]);
    expect(mockDispatchUserData).toHaveBeenCalled();
  });
});
