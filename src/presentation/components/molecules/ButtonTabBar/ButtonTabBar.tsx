import React, {useContext} from 'react';
import {View, Pressable, Text} from 'react-native';
import styles from './ButtonTabBar.styles';
import {HackerNewsFeedStack} from '../../../navigationContainer/navigationStack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {UserActivityContext, UserActivityKind} from '../../../stores/entities';
import {constants} from '../../../constants';

type HackerNewsFeedNavigationProp =
  NativeStackNavigationProp<HackerNewsFeedStack>;

export const ButtonTabBar = (tabBarProps: BottomTabBarProps) => {
  const {state, navigation} = tabBarProps;
  const {navigate} = useNavigation<HackerNewsFeedNavigationProp>();
  const {dispatchUserActivityData, stateUserActivityData} =
    useContext(UserActivityContext);

  return (
    <View style={styles.containerPadding}>
      <Pressable
        testID="bottom-tab-button"
        style={styles.bottomTabBarContainer}
        onPress={() => {
          if (state.index < 1) {
            navigation.navigate(state.routeNames[state.index + 1]);
          } else {
            const {facetsSelectedByUser, facets, userName} =
              stateUserActivityData.state;
            dispatchUserActivityData({
              type: UserActivityKind.FETCHED,
              payload: {
                ...stateUserActivityData.state,
                facets: facets,
                facetsSelectedByUser: facetsSelectedByUser,
                hasSeenOnboarding: true,
                querySearch: '',
                userName: userName,
              },
            });
            navigate('HomeScreen');
          }
        }}>
        <Text style={styles.titleButton}>{constants.ONBOARDING.CONTINUE}</Text>
      </Pressable>
    </View>
  );
};

export default ButtonTabBar;
