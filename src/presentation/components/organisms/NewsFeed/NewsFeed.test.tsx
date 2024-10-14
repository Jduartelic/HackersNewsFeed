import React from 'react';
import {View, ImageSourcePropType, Image} from 'react-native';
import {fireEvent, render, act, waitFor} from '@testing-library/react-native';
import NewsFeed from './NewsFeed';
import Icon, {
  FontAwesome5IconProps,
} from 'react-native-vector-icons/FontAwesome5';
import {NavigationContainer} from '@react-navigation/native';
import {Fixtures, News} from '../../../../domain';
import {
  StateStoreNewsData,
  defaultNewsContextValues,
  NewsContext,
} from '../../../stores/entities';

const mockedNavigate = jest.fn();
const mockedGoBack = jest.fn();
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
    const {getByTestId} = renderScreen({
      newsDataList: mockNewsFixtures,
      stateStoreNewsData: mockStateStoreNewsData,
    });
    const mainComponent = getByTestId('container-news-feed');
    expect(mainComponent).toBeDefined();
  });

  it('should execute a pull down to refresh', async () => {
    const {getByTestId} = renderScreen({
      newsDataList: mockNewsFixtures,
      stateStoreNewsData: mockStateStoreNewsData,
    });
    const mainComponent = getByTestId('container-news-feed');
    const {refreshControl} = mainComponent.props;

    refreshControl.props.onRefresh();
    await waitFor(() => {
      expect(mockDispatchNewsData).toHaveBeenCalled();
    });
    expect(mainComponent).toBeDefined();
  });
  // it('renders MainHeader on HomeScreen correctly and press button', () => {
  //   mockIndex = 0;
  //   const {getByTestId} = renderScreen({
  //     iconLeft: 'chevron-left',
  //     iconRight: 'chevron-left',
  //     imageSource: 0,
  //   });
  //   const mainComponent = getByTestId('main-header');
  //   expect(mainComponent).toBeDefined();

  //   const buttonComponent = getByTestId('button-left-header');

  //   fireEvent.press(buttonComponent);
  //   expect(mockedToggleDrawer).toHaveBeenCalled();
  // });
});
