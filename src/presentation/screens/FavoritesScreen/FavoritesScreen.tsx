/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, {useContext, useMemo} from 'react';
import {SafeAreaView, ScrollView, StatusBar, View} from 'react-native';
import {NewsContext} from '../../stores/entities';
import {NewsFeed} from '../../components/organisms';
import {SkeletonCardContainer} from '../../components/molecules';
import styles from './FavoritesScreen.styles';
import {constants} from '../../constants';
import uuid from 'react-native-uuid';

const FavoritesScreen = (): React.JSX.Element => {
  const {HOME, MAIN_COLOR} = constants;

  const {stateNewsData} = useContext(NewsContext);

  const {loading, state} = stateNewsData;

  const favoritesNews = useMemo(() => {
    const {favoritesNewsList, newsList} = state;
    return {
      data: newsList.data.filter(item =>
        favoritesNewsList.includes(item.storyId),
      ),
    };
  }, [state]);

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
            <View style={styles.mainContainer} key={uuid.v4().toString()}>
              <SkeletonCardContainer isLoading={loading} />
            </View>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView
      testID="favorites-news-container"
      style={styles.mainContainer}>
      <StatusBar barStyle={'dark-content'} backgroundColor={MAIN_COLOR} />
      {loading && renderSkeleton()}
      {!loading && <NewsFeed newsDataList={favoritesNews} />}
    </SafeAreaView>
  );
};

export default FavoritesScreen;
