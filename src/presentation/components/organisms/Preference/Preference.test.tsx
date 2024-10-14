import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  StateStoreUserActivityData,
  defaultUserActivityContextValues,
  UserActivityContext,
} from '../../../stores/entities';
import {
  fireEvent,
  render,
  waitFor,
  screen,
} from '@testing-library/react-native';
import Preference from './Preference';

const mockStateStoreUserActivityData: StateStoreUserActivityData =
  defaultUserActivityContextValues.stateUserActivityData;
const mockDispatchUserData = jest.fn();
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
  afterAll(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  it('should render component successfully and press to select element', async () => {
    jest.useFakeTimers();

    renderScreen({
      stateStoreUserActivityData: {
        state: {
          ...mockStateStoreUserActivityData.state,
        },

        fetched: true,
        loading: false,
        error: undefined,
      },
    });
    const component = screen.getByTestId('preferences-container-0');
    expect(component).toBeTruthy();

    const componentButton = screen.queryAllByTestId('pressable-component-0');
    fireEvent.press(componentButton[0]);
    await waitFor(
      async () => {
        expect(mockDispatchUserData).toHaveBeenCalled();
      },
      {timeout: 1000},
    );
  });

  it('should render component successfully and keyword android should be selected', async () => {
    jest.useFakeTimers();

    renderScreen({
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
    const component = screen.getByTestId('preferences-container-0');
    expect(component).toBeTruthy();
    const componentButton = screen.queryAllByTestId('pressable-component-0');
    fireEvent.press(componentButton[0]);

    await waitFor(
      async () => {
        expect(mockDispatchUserData).toHaveBeenCalled();
      },
      {timeout: 1000},
    );
  });
});
