import React from 'react';
import {ImageSourcePropType} from 'react-native';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import MainHeader from './MainHeader';
import {NavigationContainer} from '@react-navigation/native';

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
  iconLeft,
  imageSource,
  iconRight = 'chevron-right',
}: {
  iconLeft: string;
  imageSource?: ImageSourcePropType;
  iconRight?: string;
}) => {
  return render(
    <NavigationContainer>
      <MainHeader
        iconLeft={{name: iconLeft}}
        imageSource={0}
        iconRight={{name: iconRight}}
      />
    </NavigationContainer>,
  );
};

describe('MainHeader', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });
  it('renders MainHeader on WebViewScreen correctly and press button', () => {
    const {getByTestId} = renderScreen({
      iconLeft: 'chevron-left',
      iconRight: 'chevron-left',
      imageSource: 0,
    });
    const mainComponent = getByTestId('main-header');
    expect(mainComponent).toBeDefined();

    const buttonComponent = getByTestId('button-left-header');

    fireEvent.press(buttonComponent);
    waitFor(
      async () => {
        expect(mockedGoBack).toHaveBeenCalled();
      },
      {timeout: 1000},
    );
  });

  it('renders MainHeader on HomeScreen correctly and press button', () => {
    mockIndex = 0;
    const {getByTestId} = renderScreen({
      iconLeft: 'chevron-left',
      iconRight: 'chevron-left',
      imageSource: 0,
    });
    const mainComponent = getByTestId('main-header');
    expect(mainComponent).toBeDefined();

    const buttonComponent = getByTestId('button-left-header');

    fireEvent.press(buttonComponent);
    waitFor(
      async () => {
        expect(mockedToggleDrawer).toHaveBeenCalled();
      },
      {timeout: 1000},
    );
  });

  it('renders MainHeader on HomeScreen correctly and navigate to FavoriteScreen', () => {
    mockIndex = 0;
    const {getByTestId} = renderScreen({
      iconLeft: 'chevron-left',
      iconRight: 'chevron-left',
      imageSource: undefined,
    });
    const mainComponent = getByTestId('main-header');
    expect(mainComponent).toBeDefined();

    const buttonComponent = getByTestId('button-right-header');

    fireEvent.press(buttonComponent);
    waitFor(
      async () => {
        expect(mockedNavigate).toHaveBeenCalled();
      },
      {timeout: 1000},
    );
  });
});
