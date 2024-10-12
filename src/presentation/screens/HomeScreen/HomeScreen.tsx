/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, {useEffect, useContext, useCallback} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Platform,
} from 'react-native';
import {useNews} from '../../hooks';
import {NewsContext, NewsKind, NewsPayloadEntity} from '../../stores/entities';
import {NewsFeed} from '../../components/organisms';
import {SkeletonCardContainer} from '../../components/molecules';
import styles from './HomeScreen.styles';
import {constants} from '../../constants';
import uuid from 'react-native-uuid';
import {getSavedData} from '../../functions';

const HomeScreen = (): React.JSX.Element => {
  const {getNewsList} = useNews();
  const {HOME} = constants;

  const {dispatchNewsData, stateNewsData} = useContext(NewsContext);

  const {loading, fetched} = stateNewsData;

  const onFetchingNews = useCallback(async () => {
    let dataPayload: NewsPayloadEntity = {
      newsList: {data: []},
      deletedNewsList: [],
      favoritesNewsList: [],
    };

    const dataFromStorage = await getSavedData();

    if (dataFromStorage) {
      const data = JSON.parse(dataFromStorage);
      dataPayload.newsList = data.newsList;
      dataPayload.deletedNewsList = data.deletedNewsList ?? [];
      dataPayload.favoritesNewsList = data.favoritesNewsList ?? [];
    }

    dispatchNewsData({
      type: NewsKind.FETCHING,
      payload: {
        newsList: dataPayload.newsList,
        favoritesNewsId: undefined,
        deletedNewsId: undefined,
        deletedNewsList: dataPayload.deletedNewsList,
        favoritesNewsList: dataPayload.favoritesNewsList,
      },
    });
  }, [dispatchNewsData]);

  useEffect(() => {
    if (loading && !fetched) {
      getNewsList('mobile');
    }
  }, [loading, fetched, getNewsList]);

  useEffect(() => {
    if (!loading && !fetched) {
      onFetchingNews();
    }
  }, [onFetchingNews, loading, fetched]);

  const renderSkeleton = () => {
    let skeletonArray = Array.from(
      {length: HOME.NUMBER_SKELETON},
      (_, index) => index,
    );
    return (
      <ScrollView
        contentContainerStyle={styles.scrollViewSkeleton}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}>
        {skeletonArray.map(() => {
          return (
            <View style={{flex: 1}} key={uuid.v4().toString()}>
              <SkeletonCardContainer isLoading={loading} />
            </View>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      {loading && renderSkeleton()}
      {!loading && <NewsFeed />}
      <SafeAreaView style={{backgroundColor: 'transparent'}} />
    </SafeAreaView>
  );
};

export default HomeScreen;
