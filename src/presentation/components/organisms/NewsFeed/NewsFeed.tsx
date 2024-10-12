import React, {useContext, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  Text,
  RefreshControl,
  ScrollView,
} from 'react-native';

import {NewsCard} from '../../molecules';
import styles from './NewsFeed.styles';
import {NewsContext, NewsKind} from '../../../stores/entities';
import {NewsData} from '../../../../domain';
import uuid from 'react-native-uuid';

const NewsFeed = () => {
  const {dispatchNewsData, stateNewsData} = useContext(NewsContext);
  const {state, loading} = stateNewsData;
  const {data} = state.newsList;
  // const [fadeAnim] = useState(new Animated.Value(0));
  // const barWidth = useRef(new Animated.Value(0)).current;

  // const widthAnim = barWidth.interpolate({
  //   inputRange: [0, 100],
  //   outputRange: ['95%', '100%'],
  //   extrapolate: 'clamp',
  // });

  // React.useEffect(() => {
  //   if (isFocused) {
  //     Animated.timing(fadeAnim, {
  //       toValue: 1,
  //       duration: 300,
  //       delay: 100,
  //       easing: Easing.linear,
  //       useNativeDriver: false,
  //     }).start();
  //     Animated.timing(barWidth, {
  //       toValue: 100,
  //       duration: 200,
  //       delay: 100,
  //       useNativeDriver: false,
  //     }).start();
  //   } else {
  //     Animated.timing(fadeAnim, {
  //       toValue: 0,
  //       duration: 1,
  //       easing: Easing.linear,
  //       useNativeDriver: false,
  //     }).start();
  //     Animated.timing(barWidth, {
  //       toValue: 0,
  //       duration: 1,
  //       useNativeDriver: false,
  //     }).start();
  //   }
  // }, [isFocused, fadeAnim, barWidth]);

  // const skeletonBody = () => {
  //   const skeletonData = Array.from({length: 8});

  //   return (
  //     <SafeAreaView style={themedStyle.containerSkeleton}>
  //       <View
  //         style={themedStyle.containerInnerSkeleton}
  //         testID="container-content-active-user-product-skeleton-header">
  //         {skeletonData.map((item, index) => (
  //           <Skeleton
  //             key={`skeleton-body-product-list-container-${item}-${index}`}
  //             variant="round"
  //             width={'100%'}
  //             height={verticalScale(225)}
  //             borderRadius={oxxoCelTheme.spacing.s2}
  //             backgroundColor={theme.colors.surface_secondary}
  //             foregroundColor={theme.colors.surface_tertiary}
  //             speed={300}
  //           />
  //         ))}
  //       </View>
  //     </SafeAreaView>
  //   );
  // };

  const onRefresh = React.useCallback(() => {
    dispatchNewsData({
      type: NewsKind.FETCHING,
      payload: {...state},
    });
  }, [dispatchNewsData, state]);

  const renderHeader = (): React.ReactNode => {
    return (
      <View style={{flex: 0.1}}>
        <Text>add header (fav, deleted)</Text>
      </View>
    );
  };

  const renderItem = ({item: news}: {item: NewsData}) => {
    // const randomColor = '#000000'.replace(/0/g, function () {
    //   return (~~(Math.random() * 16)).toString(16);
    // });
    console.log('item', news);
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
        // contentContainerStyle={{
        //   // flexGrow: 1,
        //   // justifyContent: 'center',
        //   alignItems: 'center',
        // }}
        style={{
          flex: 1,
          height: '100%',
          width: '100%',
        }}
        // ListHeaderComponent={renderHeader}
        // ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        bounces={true}
        refreshControl={
          <RefreshControl
            testID="refresh-control"
            progressBackgroundColor={'white'}
            colors={['#5ce1e6']}
            tintColor={'white'}
            // style={themedStyle.mainContainer}
            refreshing={loading}
            onRefresh={onRefresh}
          />
        }
        showsHorizontalScrollIndicator={false}
      />
      {/* {!data ? (
        skeletonBody()
      ) : (
        <Animated.View
          key={key}
          testID={key}
          style={StyleSheet.flatten([
            themedStyle.container,
            {
              opacity: fadeAnim,
              width: widthAnim,
            },
          ])}>
          <RecommendedProductList
            content={content}
            productList={data}
            widthCard="100%"
            showHeader={false}
            orientationHorizontal={false}
            orientationParentHorizontal={false}>
            <RecommendedProductCard />
          </RecommendedProductList>
        </Animated.View>
      )} */}
    </View>
  );
};

export default NewsFeed;
