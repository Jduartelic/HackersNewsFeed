import React, {useCallback} from 'react';
import {SafeAreaView} from 'react-native';
import {Preference, Onboarding} from '../../components/organisms';
import styles from './OnboardingScreen.styles';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import {HackerNewsOnboardingScreens} from '../../navigationContainer/navigationStack';
import {ButtonTabBar} from '../../components/molecules';

const Tab = createBottomTabNavigator<HackerNewsOnboardingScreens>();

const OnboardingScreen = (): React.JSX.Element => {
  const BottomTabBar = useCallback(
    (props: BottomTabBarProps) => <ButtonTabBar {...props} />,
    [],
  );

  return (
    <SafeAreaView
      testID="onboarding-screen-container"
      style={styles.mainContainer}>
      <Tab.Navigator tabBar={props => BottomTabBar(props)}>
        <Tab.Screen
          name="HomeScreen"
          component={Onboarding}
          options={{headerShown: false}}
        />
        <Tab.Screen
          name="PreferenceScreen"
          component={Preference}
          options={{headerShown: false}}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
