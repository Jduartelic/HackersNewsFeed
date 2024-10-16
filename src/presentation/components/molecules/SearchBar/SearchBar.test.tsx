import React from 'react';
import {
  render,
  waitFor,
  screen,
  fireEvent,
} from '@testing-library/react-native';
import SearchBar from './SearchBar';
import {NavigationContainer} from '@react-navigation/native';
import {
  StateStoreUserActivityData,
  defaultUserActivityContextValues,
  UserActivityContext,
} from '../../../stores/entities';

const mockStateStoreUserActivityData: StateStoreUserActivityData =
  defaultUserActivityContextValues.stateUserActivityData;
const mockDispatchUUserActivityData = jest.fn();

const renderScreen = ({
  stateStoreUserActivityData = mockStateStoreUserActivityData,
}: {
  stateStoreUserActivityData: StateStoreUserActivityData;
}) => {
  return render(
    <NavigationContainer>
      <UserActivityContext.Provider
        value={{
          stateUserActivityData: {
            ...stateStoreUserActivityData,
          },
          dispatchUserActivityData: mockDispatchUUserActivityData,
        }}>
        <SearchBar />
      </UserActivityContext.Provider>
    </NavigationContainer>,
  );
};

describe('SkeletonCardContainer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('renders SkeletonCardContainer ', async () => {
    jest.useFakeTimers();

    renderScreen({
      stateStoreUserActivityData: {
        state: {
          ...mockStateStoreUserActivityData.state,
          pushNotifications: {
            appStateActivity: 'background',
            sentPushNotification: true,
            timeForNextPush: 10,
          },
          querySearch: '',
        },

        fetched: true,
        loading: false,
        error: undefined,
      },
    });

    const searchBarInput = screen.getByTestId('search-bar-input');

    fireEvent(searchBarInput, 'focus');
    fireEvent.changeText(searchBarInput, 'mock');
    fireEvent(searchBarInput, 'blur');

    await waitFor(
      () => {
        expect(mockDispatchUUserActivityData).toHaveBeenCalled();
      },
      {timeout: 10},
    );
  });
});
