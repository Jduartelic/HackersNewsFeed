import React, {useContext, useMemo} from 'react';
import {SafeAreaView, ScrollView, StatusBar, View} from 'react-native';
import {NewsContext} from '../../stores/entities';
import {NewsFeed} from '../../components/organisms';
import {SkeletonCardContainer} from '../../components/molecules';
import styles from './CemeteryNewsScreen.styles';
import {constants} from '../../constants';
import uuid from 'react-native-uuid';

const CemeteryNewsScreen = (): React.JSX.Element => {
  const {HOME} = constants;

  const {stateNewsData} = useContext(NewsContext);

  const {loading, state} = stateNewsData;

  const deletedNews = useMemo(() => {
    const {deletedNewsList, newsList} = state;

    return {
      data: newsList.data.filter(item =>
        deletedNewsList.includes(item.storyId),
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
      {!loading && <NewsFeed newsDataList={deletedNews} />}
      <SafeAreaView style={{backgroundColor: 'transparent'}} />
    </SafeAreaView>
  );
};

export default CemeteryNewsScreen;
