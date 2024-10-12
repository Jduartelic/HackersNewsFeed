import React, {useContext} from 'react';
import {View, FlatList, RefreshControl} from 'react-native';
import {NewsCard} from '../../molecules';
import styles from './NewsFeed.styles';
import {NewsContext, NewsKind} from '../../../stores/entities';
import {News, NewsData} from '../../../../domain';
import uuid from 'react-native-uuid';

const NewsFeed = ({newsDataList}: {newsDataList: News}) => {
  const {dispatchNewsData, stateNewsData} = useContext(NewsContext);
  const {state, loading} = stateNewsData;

  const onRefresh = React.useCallback(async () => {
    dispatchNewsData({
      type: NewsKind.FETCHING,
      payload: {
        newsList: state.newsList,
        favoritesNewsId: undefined,
        deletedNewsId: undefined,
        deletedNewsList: state.deletedNewsList,
        favoritesNewsList: state.favoritesNewsList,
      },
    });
  }, [dispatchNewsData, state]);

  const renderItem = ({item: news}: {item: NewsData}) => {
    return (
      <View
        key={uuid.v4().toString()}
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: 'transparent',
        }}>
        <NewsCard {...news} />
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        testID="container-content-order-confirmation"
        data={newsDataList.data}
        style={{
          flex: 1,
          height: '100%',
          width: '100%',
        }}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        bounces={true}
        refreshControl={
          <RefreshControl
            testID="refresh-control"
            progressBackgroundColor={'white'}
            colors={['#5ce1e6']}
            tintColor={'#5ce1e6'}
            refreshing={loading}
            onRefresh={onRefresh}
          />
        }
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default NewsFeed;
