import React from 'react';
import {render} from '@testing-library/react-native';
import {HackerNewsFeedDrawer} from '../navigationContainer/navigationStack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {CemeteryNewsScreen} from '../screens/';
import {NavigationContainer} from '@react-navigation/native';

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      goBack: mockedNavigate,
      getState: jest.fn(() => ({
        routes: jest.fn(),
      })),
      reset: jest.fn(),
      dispatch: jest.fn(),
    }),
  };
});

const renderScreen = () => {
  const {Screen, Navigator} = createDrawerNavigator<HackerNewsFeedDrawer>();
  return render(
    <NavigationContainer>
      <Navigator initialRouteName="MainScreen">
        <Screen
          name="MainScreen"
          component={CemeteryNewsScreen}
          options={{headerShown: false}}
        />
      </Navigator>
    </NavigationContainer>,
  );
};

describe('HackerNewsFeedStack', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  it('should render HackerNewsFeedStack correctly', async () => {
    const container = renderScreen();
    expect(container).toBeTruthy();
  });
});
