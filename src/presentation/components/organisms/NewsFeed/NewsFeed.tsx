import React, {useContext} from 'react';
import {View, FlatList, RefreshControl} from 'react-native';

import {NewsCard} from '../../molecules';
import styles from './NewsFeed.styles';
import {NewsContext, NewsKind} from '../../../stores/entities';
import {NewsData} from '../../../../domain';
import uuid from 'react-native-uuid';

const NewsFeed = () => {
  const {dispatchNewsData, stateNewsData} = useContext(NewsContext);
  const {state, loading} = stateNewsData;
  const {data} = state.newsList;

  const onRefresh = React.useCallback(() => {
    dispatchNewsData({
      type: NewsKind.FETCHING,
      payload: {
        newsList: state.newsList,
        favoritesNewsId: undefined,
        deletedNewsId: undefined,
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
        data={data}
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
            tintColor={'white'}
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
