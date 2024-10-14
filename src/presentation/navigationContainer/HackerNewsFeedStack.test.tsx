import React from 'react';
import {render, screen} from '@testing-library/react-native';
import {
  HackerNewsFeedDrawer,
  HackerNewsFeedStack,
} from '../navigationContainer/navigationStack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {CemeteryNewsScreen, HomeScreen} from '../screens/';
import {NavigationContainer} from '@react-navigation/native';
import {View} from 'react-native';

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

const screenStack = () => {
  const {Screen: ScreenStack} = createDrawerNavigator<HackerNewsFeedStack>();

  return (
    <ScreenStack
      name="HomeScreen"
      component={HomeScreen}
      options={{headerShown: true}}
    />
  );
};

const renderScreen = () => {
  const {Screen, Navigator} = createDrawerNavigator<HackerNewsFeedDrawer>();

  return render(
    <NavigationContainer>
      <Navigator initialRouteName="MainScreen">
        <Screen
          name="MainScreen"
          component={CemeteryNewsScreen}
          options={{
            header: () => <View />,
            headerShown: true,
            headerStyle: {backgroundColor: '#f5f5f5'},
            headerShadowVisible: true,
          }}
        />
        {screenStack()}
      </Navigator>
    </NavigationContainer>,
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
