import React, {useContext} from 'react';
import {SafeAreaView, ScrollView, StatusBar, View} from 'react-native';
import {NewsContext} from '../../stores/entities';
import {NewsFeed} from '../../components/organisms';
import {SkeletonCardContainer} from '../../components/molecules';
import styles from './CemeteryNewsScreen.styles';
import {constants} from '../../constants';
import uuid from 'react-native-uuid';

const CemeteryNewsScreen = (): React.JSX.Element => {
  const {MAIN_COLOR, HOME} = constants;
  const {stateNewsData} = useContext(NewsContext);
  const {loading, state} = stateNewsData;

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
      testID="cementery-news-container"
      style={styles.mainContainer}>
      <StatusBar barStyle={'dark-content'} backgroundColor={MAIN_COLOR} />
      {loading && renderSkeleton()}
      {!loading && <NewsFeed newsDataList={state.deletedNewsList} />}
    </SafeAreaView>
  );
};

export default CemeteryNewsScreen;
