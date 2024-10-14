import React from 'react';
import {View, ImageSourcePropType, Image} from 'react-native';
import {fireEvent, render, waitFor, act} from '@testing-library/react-native';
import SkeletonCardContainer from './SkeletonCardContainer';
import Icon, {
  FontAwesome5IconProps,
} from 'react-native-vector-icons/FontAwesome5';
import {NavigationContainer} from '@react-navigation/native';

const renderScreen = ({loading}: {loading: boolean}) => {
  return render(
    <NavigationContainer>
      <SkeletonCardContainer isLoading={loading} />
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
    const {getByTestId} = renderScreen({
      loading: true,
    });

    act(() => {
      waitFor(
        () => {
          const mainComponent = getByTestId('skeleton-container');
          expect(mainComponent).toBeTruthy();
        },
        {timeout: 1000},
      );
    });
  });

  it('renders not SkeletonCardContainer', async () => {
    const {getByTestId} = renderScreen({
      loading: false,
    });

    act(() => {
      waitFor(
        () => {
          const mainComponent = getByTestId('skeleton-container');
          expect(mainComponent).toBeTruthy();
        },
        {timeout: 1000},
      );
    });
  });
});
