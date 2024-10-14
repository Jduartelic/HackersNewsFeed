import React from 'react';
import {render, waitFor, screen} from '@testing-library/react-native';
import SkeletonCardContainer from './SkeletonCardContainer';

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
    jest.useFakeTimers();

    renderScreen({
      loading: true,
    });

    await waitFor(
      () => {
        const mainComponent = screen.getByTestId('skeleton-container');
        expect(mainComponent).toBeTruthy();
      },
      {timeout: 10},
    );
  });

  it('renders not SkeletonCardContainer', async () => {
    jest.useFakeTimers();

    renderScreen({
      loading: false,
    });

    await waitFor(
      () => {
        const mainComponent = screen.getByTestId('skeleton-container');
        expect(mainComponent).toBeTruthy();
      },
      {timeout: 10},
    );
  });
});
