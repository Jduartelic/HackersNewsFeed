import React from 'react';
import {render, waitFor, screen} from '@testing-library/react-native';
import NewsFeed from './NewsFeed';

import {NavigationContainer} from '@react-navigation/native';
import {Fixtures, News} from '../../../../domain';
import {
  StateStoreNewsData,
  defaultNewsContextValues,
  NewsContext,
} from '../../../stores/entities';

const mockDispatchNewsData = jest.fn();
const mockStateStoreNewsData: StateStoreNewsData =
  defaultNewsContextValues.stateNewsData;
const mockNewsFixtures = Fixtures.NewsList;

const renderScreen = ({
  newsDataList,
  stateStoreNewsData,
}: {
  newsDataList: News;
  stateStoreNewsData: StateStoreNewsData;
}) => {
  return render(
    <NavigationContainer>
      <NewsContext.Provider
        value={{
          stateNewsData: {...stateStoreNewsData},
          dispatchNewsData: mockDispatchNewsData,
        }}>
        <NewsFeed newsDataList={newsDataList} />
      </NewsContext.Provider>
    </NavigationContainer>,
  );
};

describe('NewsFeed', () => {
  it('renders NewsFeed component correctly', () => {
    renderScreen({
      newsDataList: mockNewsFixtures,
      stateStoreNewsData: mockStateStoreNewsData,
    });
    const mainComponent = screen.getByTestId('container-news-feed');
    expect(mainComponent).toBeDefined();
  });

  it('should execute a pull down to refresh', async () => {
    renderScreen({
      newsDataList: mockNewsFixtures,
      stateStoreNewsData: mockStateStoreNewsData,
    });
    const mainComponent = screen.getByTestId('container-news-feed');
    const {refreshControl} = mainComponent.props;

    refreshControl.props.onRefresh();
    await waitFor(() => {
      expect(mockDispatchNewsData).toHaveBeenCalled();
    });
    expect(mainComponent).toBeDefined();
  });
});
