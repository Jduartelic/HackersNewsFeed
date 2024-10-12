import React from 'react';
import Skeleton from 'react-native-reanimated-skeleton';
import styles from './SkeletonCardContainer.styles';
import {View} from 'react-native';
import uuid from 'react-native-uuid';

const SkeletonCardContainer = ({isLoading}: {isLoading: boolean}) => {
  return (
    <View key={uuid.v4().toString()} style={styles.skeletonContainer}>
      <View style={styles.skeletonHeaderContainer}>
        <Skeleton
          animationDirection="horizontalRight"
          containerStyle={{flex: 0.2, paddingVertical: 16, paddingLeft: 16}}
          isLoading={isLoading}
          layout={[
            {
              key: 'someId',
              width: 50,
              height: 50,
              borderRadius: 100,
            },
          ]}
        />
        <Skeleton
          animationDirection="horizontalRight"
          containerStyle={{flex: 0.8, paddingRight: 16}}
          isLoading={isLoading}
          layout={[{key: 'someOtherId', width: '100%', height: '40%'}]}
        />
      </View>
      <View style={styles.skeletonFooterContainer}>
        <Skeleton
          animationDirection="horizontalRight"
          containerStyle={{
            flex: 1,
            paddingHorizontal: 16,
            paddingBottom: 16,
          }}
          isLoading={isLoading}
          layout={[
            {
              key: 'someOtherIdasdas',
              width: '70%',
              height: 30,
              alignSelf: 'flex-end',
            },
          ]}
        />
      </View>
    </View>
  );
};

export default SkeletonCardContainer;
