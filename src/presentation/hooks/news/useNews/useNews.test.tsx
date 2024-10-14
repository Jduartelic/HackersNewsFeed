import React, {ReactNode} from 'react';
import {renderHook} from '@testing-library/react-hooks';
import {waitFor} from '@testing-library/react-native';
import {Fixtures} from '../../../../domain';
import {defaultNewsContextValues, NewsContext} from '../../../stores/entities';
import useNews from './useNews';
import {NewsRepository} from '../../../../infraestructure';

const mockedDispatch = jest.fn();
let mockStateLoading = true;
const mockStateNewsData = {
  ...defaultNewsContextValues,
  stateNewsData: {
    ...defaultNewsContextValues.stateNewsData,
    loading: mockStateLoading,
  },
  dispatchNewsData: mockedDispatch,
};

const wrapper = ({children}: {children: ReactNode}) => {
  return (
    <NewsContext.Provider value={mockStateNewsData}>
      {children}
    </NewsContext.Provider>
  );
};

describe('useNews', () => {
  beforeEach(() => {
    jest.spyOn(NewsRepository, 'getNews').mockReset();
    jest.clearAllMocks();
  });

  it('should keep loading state as true when custom hook starts getNews', async () => {
    jest.spyOn(NewsRepository, 'getNews').mockResolvedValue(Fixtures.NewsList);

    const {result} = renderHook(() => useNews(), {
      wrapper,
    });

    await result.current.getNewsList('');
    await waitFor(
      () => {
        expect(mockedDispatch).toHaveBeenCalled();
      },
      {timeout: 1000},
    );
  });

  it('should keep error state as null when the custom hook starts getProductList', async () => {
    jest.spyOn(NewsRepository, 'getNews').mockRejectedValue([]);
    const {result} = renderHook(() => useNews(), {
      wrapper,
    });

    await result.current.getNewsList('mock');
    await waitFor(
      () => {
        expect(mockedDispatch).toHaveBeenCalled();
      },
      {timeout: 1000},
    );
  });
});
