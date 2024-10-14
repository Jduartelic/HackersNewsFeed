import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {render, waitFor} from '@testing-library/react-native';
import Onboarding from './Onboarding';

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

const renderScreen = () =>
  render(
    <NavigationContainer>
      <Onboarding />
    </NavigationContainer>,
  );

describe('OnboardingScreen', () => {
  it('should render OnboardingScreen component successfully', () => {
    const {getByTestId} = renderScreen();
    const component = getByTestId('onboarding-container');

    waitFor(
      () => {
        expect(component).toBeTruthy();
      },
      {timeout: 10},
    );
  });
});
