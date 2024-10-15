import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  NewsContext,
  StateStoreNewsData,
  defaultNewsContextValues,
} from '../../stores/entities';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import ErrorboundaryScreen from './ErrorboundaryScreen';
import {navigationTabBarMock, optionsTabBarMock} from '../../../../jest/setup';
import {HackerNewsFeedStack} from '../../navigationContainer/navigationStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<HackerNewsFeedStack, 'ErrorboundaryScreen'>;
const mockStateStoreNewsData: StateStoreNewsData =
  defaultNewsContextValues.stateNewsData;
const mockDispatchNewsData = jest.fn();
const mockedNavigate = jest.fn();
const mockedGoBack = jest.fn();
const mockedToggleDrawer = jest.fn();

let mockIndex = 1;

let mockNavigation = {
  ...navigationTabBarMock,
  goBack: mockedNavigate,
};

const mockedNavigatorProps: Props = {
  route: {
    key: 'ErrorboundaryScreen-hJNwRHb_kvfHdrLwWkjU4',
    name: 'ErrorboundaryScreen',
    params: undefined,
  },
  navigation: mockNavigation,
};

const renderScreen = ({
  stateStoreNewsData = mockStateStoreNewsData,
}: {
  stateStoreNewsData: StateStoreNewsData;
}) =>
  render(
    <NavigationContainer>
      <NewsContext.Provider
        value={{
          stateNewsData: {...stateStoreNewsData},
          dispatchNewsData: mockDispatchNewsData,
        }}>
        <ErrorboundaryScreen {...mockedNavigatorProps} />
      </NewsContext.Provider>
      ,
    </NavigationContainer>,
  );

describe('ErrorboundaryScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should render component with ERR_NETWORK message ErrorboundaryScreen correctly ', async () => {
    renderScreen({
      stateStoreNewsData: {
        ...mockStateStoreNewsData,
        state: {
          ...mockStateStoreNewsData.state,
        },
        error: {
          message: 'Network Error',
          name: 'Network Error',
        },
      },
    });

    const mainComponent = screen.getByTestId('cementery-news-container');
    expect(mainComponent).toBeTruthy();
    const buttonComponent = screen.getByTestId('button-icon-close-modal');

    await waitFor(
      async () => {
        fireEvent.press(buttonComponent);
      },
      {timeout: 1000},
    );
    expect(mockDispatchNewsData).toHaveBeenCalled();
    expect(mockedNavigate).toHaveBeenCalled();
  });
  it('should render with GENERIC_ERROR message component ErrorboundaryScreen correctly ', async () => {
    renderScreen({
      stateStoreNewsData: {
        ...mockStateStoreNewsData,
        state: {
          ...mockStateStoreNewsData.state,
        },
        error: {
          message: 'mock',
          name: 'mock',
        },
      },
    });

    const mainComponent = screen.getByTestId('cementery-news-container');
    expect(mainComponent).toBeTruthy();
    const buttonComponent = screen.getByTestId('button-close-modal');

    await waitFor(
      async () => {
        fireEvent.press(buttonComponent);
      },
      {timeout: 1000},
    );
    expect(mockDispatchNewsData).toHaveBeenCalled();
    expect(mockedNavigate).toHaveBeenCalled();
  });
});
