import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import SkeletonCardContainer from './SkeletonCardContainer';

import {NavigationContainer} from '@react-navigation/native';

const renderScreen = ({loading}: {loading: boolean}) => {
  return render(
    <NavigationContainer>
      <SkeletonCardContainer isLoading={loading} />
    </NavigationContainer>,
  );
};

describe.skip('SkeletonCardContainer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.useRealTimers();
  });
  it('renders SkeletonCardContainer ', async () => {
    jest.useFakeTimers();

    const {getByTestId} = renderScreen({
      loading: true,
    });

    waitFor(
      () => {
        const mainComponent = getByTestId('skeleton-container');
        expect(mainComponent).toBeTruthy();
      },
      {timeout: 10},
    );
  });

  it('renders not SkeletonCardContainer', async () => {
    jest.useFakeTimers();

    const {getByTestId} = renderScreen({
      loading: false,
    });

    waitFor(
      () => {
        const mainComponent = getByTestId('skeleton-container');
        expect(mainComponent).toBeTruthy();
      },
      {timeout: 10},
    );
  });
});
