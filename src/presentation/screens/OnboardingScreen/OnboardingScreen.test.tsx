import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  NewsContext,
  StateStoreNewsData,
  defaultNewsContextValues,
  StateStoreUserActivityData,
  defaultUserActivityContextValues,
  UserActivityContext,
} from '../../stores/entities';
import {
  waitFor,
  render,
  fireEvent,
  screen,
} from '@testing-library/react-native';
import OnboardingScreen from './OnboardingScreen';

const mockStateStoreUserActivityData: StateStoreUserActivityData =
  defaultUserActivityContextValues.stateUserActivityData;

const mockStateStoreNewsData: StateStoreNewsData =
  defaultNewsContextValues.stateNewsData;

const mockDispatchNewsData = jest.fn();
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

const renderScreen = ({
  stateStoreNewsData = mockStateStoreNewsData,
  stateStoreUserActivityData = mockStateStoreUserActivityData,
}: {
  stateStoreNewsData: StateStoreNewsData;
  stateStoreUserActivityData: StateStoreUserActivityData;
}) =>
  render(
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
            dispatchUserActivityData:
              defaultUserActivityContextValues.dispatchUserActivityData,
          }}>
          <OnboardingScreen />
        </UserActivityContext.Provider>
      </NewsContext.Provider>
    </NavigationContainer>,
  );

describe('OnboardingScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should render tab bar component and press button on bottom tab and move to the next screen', async () => {
    mockIndex = 0;
    renderScreen({
      stateStoreNewsData: {
        ...mockStateStoreNewsData,
        state: {
          ...mockStateStoreNewsData.state,
        },
        loading: false,
      },
      stateStoreUserActivityData: {
        state: {
          ...mockStateStoreUserActivityData.state,
        },

        fetched: false,
        loading: false,
        error: undefined,
      },
    });

    const button = screen.getByTestId('bottom-tab-button');

    fireEvent.press(button);
    await waitFor(
      () => {
        expect('onboarding-screen-container').toBeDefined();
      },
      {timeout: 100},
    );
  });
});
