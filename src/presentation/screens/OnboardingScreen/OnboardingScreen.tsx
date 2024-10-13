import React, {useContext, useCallback} from 'react';
import {SafeAreaView, View, Text, Pressable} from 'react-native';
import {UserActivityContext, UserActivityKind} from '../../stores/entities';
import {Preference, Onboarding} from '../../components/organisms';
import styles from './OnboardingScreen.styles';
import {constants} from '../../constants';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import {
  HackerNewsOnboardingScreens,
  HackerNewsFeedStack,
} from '../../navigationContainer/navigationStack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

const Tab = createBottomTabNavigator<HackerNewsOnboardingScreens>();
type HackerNewsFeedNavigationProp =
  NativeStackNavigationProp<HackerNewsFeedStack>;

const OnboardingScreen = (): React.JSX.Element => {
  const {navigate} = useNavigation<HackerNewsFeedNavigationProp>();
  const {dispatchUserActivityData, stateUserActivityData} =
    useContext(UserActivityContext);

  const BottomTabBar = useCallback(
    (props: BottomTabBarProps) => (
      <View style={styles.containerPadding}>
        <Pressable
          style={styles.bottomTabBarContainer}
          onPress={() => {
            if (props.state.index < 1) {
              props.navigation.navigate(
                props.state.routeNames[props.state.index + 1],
              );
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
          <Text style={styles.titleButton}>
            {constants.ONBOARDING.CONTINUE}
          </Text>
        </Pressable>
      </View>
    ),
    [dispatchUserActivityData, navigate, stateUserActivityData.state],
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Tab.Navigator tabBar={props => BottomTabBar(props)}>
        <Tab.Screen
          name="HomeScreen"
          component={Onboarding}
          options={{headerShown: false}}
        />
        <Tab.Screen name="PreferenceScreen" component={Preference} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
