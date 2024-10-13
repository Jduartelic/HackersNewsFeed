import React, {useEffect, useContext, useCallback, useMemo} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Platform,
} from 'react-native';
import {useNews} from '../../hooks';
import {
  NewsContext,
  NewsKind,
  NewsPayloadEntity,
  UserActivityContext,
  UserActivityEntity,
  UserActivityKind,
} from '../../stores/entities';
import {NewsFeed} from '../../components/organisms';
import {SkeletonCardContainer} from '../../components/molecules';
import styles from './HomeScreen.styles';
import {constants} from '../../constants';
import uuid from 'react-native-uuid';
import {getSavedData} from '../../functions';
import {useNavigation} from '@react-navigation/native';
import {HackerNewsFeedStack} from '../../navigationContainer/navigationStack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

type HackerNewsFeedNavigationProp =
  NativeStackNavigationProp<HackerNewsFeedStack>;

const HomeScreen = (): React.JSX.Element => {
  const {getNewsList} = useNews();
  const {HOME} = constants;
  const {navigate} = useNavigation<HackerNewsFeedNavigationProp>();
  const {dispatchNewsData, stateNewsData} = useContext(NewsContext);
  const {dispatchUserActivityData, stateUserActivityData} =
    useContext(UserActivityContext);
  const {loading, fetched, state} = stateNewsData;
  const {
    loading: loadingUserActivity,
    fetched: fetchedUserActivity,
    state: stateUserActivity,
  } = stateUserActivityData;

  const filteredListNews = useMemo(() => {
    const {deletedNewsList, newsList} = state;
    return {
      data: newsList.data.filter(
        item => !deletedNewsList.includes(item.storyId),
      ),
    };
  }, [state]);

  const onFetchingNews = useCallback(async () => {
    let dataPayload: NewsPayloadEntity = {
      newsList: {data: []},
      deletedNewsList: [],
      favoritesNewsList: [],
    };

    const dataFromStorage = await getSavedData(constants.HOME.STORAGE_KEY);

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

  const onFetchingUserActivity = useCallback(async () => {
    getSavedData(constants.USER_ACTIVITY.STORAGE_KEY).then(savedData => {
      console.log('savedData', savedData);
      const parseLocalFacets: UserActivityEntity = savedData
        ? JSON.parse(savedData)
        : {
            facets: constants.USER_ACTIVITY.FACETS,
            facetsSelectedByUser: [],
            querySearch: [],
            hasSeenOnboarding: false,
          };
      console.log('parseLocalFacets', parseLocalFacets);
      dispatchUserActivityData({
        type: UserActivityKind.FETCHED,
        payload: {
          facets: parseLocalFacets.facets,
          facetsSelectedByUser: parseLocalFacets.facetsSelectedByUser,
          hasSeenOnboarding: parseLocalFacets.hasSeenOnboarding,
          querySearch: parseLocalFacets.querySearch,
          userName: parseLocalFacets.userName,
        },
      });
    });
    constants.USER_ACTIVITY.STORAGE_KEY;
    dispatchUserActivityData({
      type: UserActivityKind.FETCHING,
      payload: {
        facets: [],
        facetsSelectedByUser: [],
        hasSeenOnboarding: true,
        querySearch: [],
        userName: '',
      },
    });
  }, [dispatchNewsData]);

  useEffect(() => {
    if (!loadingUserActivity && !fetchedUserActivity) {
      onFetchingUserActivity();
    }
  }, [loadingUserActivity, fetchedUserActivity, onFetchingUserActivity]);

  useEffect(() => {
    if (loading && !fetched) {
      getNewsList('mobile');
    }
  }, [loading, fetched, getNewsList]);

  useEffect(() => {
    if (
      !loading &&
      !fetched &&
      !loadingUserActivity &&
      fetchedUserActivity &&
      stateUserActivity.hasSeenOnboarding
    ) {
      onFetchingNews();
    }
  }, [
    onFetchingNews,
    loading,
    fetched,
    loadingUserActivity,
    fetchedUserActivity,
    stateUserActivity.hasSeenOnboarding,
  ]);

  useEffect(() => {
    if (!stateUserActivity.hasSeenOnboarding) {
      navigate('OnboardingScreen');
    }
  }, [navigate, stateUserActivity.hasSeenOnboarding]);

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
      {!loading && <NewsFeed newsDataList={filteredListNews} />}
      <SafeAreaView style={{backgroundColor: 'transparent'}} />
    </SafeAreaView>
  );
};

export default HomeScreen;
