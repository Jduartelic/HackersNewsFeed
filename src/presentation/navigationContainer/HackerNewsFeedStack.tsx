import React, {useCallback} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  HomeScreen,
  WebViewScreen,
  FavoritesScreen,
  CemeteryNewsScreen,
  OnboardingScreen,
  DrawerCustomScreen,
  ErrorboundaryScreen,
} from '../screens';
import {NavigationContainer} from '@react-navigation/native';
import {
  HackerNewsFeedStack,
  HackerNewsFeedDrawer,
} from '../navigationContainer/navigationStack';
import {NewsContextProvider} from '../stores/entities/News/NewsContext';
import {UserActivityContextProvider} from '../stores/entities/UserActivity/UserActivityContext';
import {MainHeader} from '../components/molecules';
import {images} from '../../domain';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {FontAwesome5IconProps} from 'react-native-vector-icons/FontAwesome5';
import {ImageSourcePropType, View} from 'react-native';

const Stack = createNativeStackNavigator<HackerNewsFeedStack>();
const Drawer = createDrawerNavigator<HackerNewsFeedDrawer>();

function HackerNewsFeedNavigator() {
  const MainHeaderComponent = useCallback(
    () => (
      <MainHeader
        iconLeft={{name: 'chevron-left'}}
        imageSource={images.logoInitials}
      />
    ),
    [],
  );

  const DrawerContentComponent = useCallback(() => <DrawerCustomScreen />, []);

  return (
    <UserActivityContextProvider>
      <NewsContextProvider>
        <NavigationContainer>
          <Drawer.Navigator
            screenOptions={{
              headerShown: false,
              swipeEnabled: false,
            }}
            drawerContent={() => DrawerContentComponent()}>
            <Drawer.Screen
              name="MainScreen"
              component={HackerNewsFeedScreens}
            />
            <Drawer.Screen
              name="CemeteryNewsScreen"
              component={CemeteryNewsScreen}
              options={{
                header: () => MainHeaderComponent(),
                headerShown: true,
                headerStyle: {backgroundColor: '#f5f5f5'},
                headerShadowVisible: true,
              }}
            />

            <Drawer.Screen
              name="FavoritesScreen"
              component={FavoritesScreen}
              options={{
                header: () => MainHeaderComponent(),
                headerShown: true,
                headerStyle: {backgroundColor: '#f5f5f5'},
                headerShadowVisible: true,
              }}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </NewsContextProvider>
    </UserActivityContextProvider>
  );
}

const HackerNewsFeedScreens = () => {
  const HeaderHackerNewsFeedScreens = useCallback(
    ({
      iconLeft,
      imageSource,
      iconRight,
    }: {
      iconLeft: FontAwesome5IconProps;
      imageSource?: ImageSourcePropType;
      iconRight?: FontAwesome5IconProps;
    }) => (
      <MainHeader
        iconLeft={iconLeft}
        imageSource={imageSource}
        iconRight={iconRight}
      />
    ),
    [],
  );

  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: false,
        fullScreenGestureEnabled: false,
        fullScreenGestureShadowEnabled: false,
      }}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          gestureEnabled: false,
          animation: 'slide_from_right',
          header: () =>
            HeaderHackerNewsFeedScreens({
              iconLeft: {name: 'bars'},
              iconRight: {name: 'search'},
              imageSource: images.logoInitials,
            }),
          headerShown: true,
          headerStyle: {backgroundColor: '#f5f5f5'},
          headerShadowVisible: true,
        }}
      />
      <Stack.Screen
        name="WebViewScreen"
        component={WebViewScreen}
        options={{
          gestureEnabled: false,
          animation: 'slide_from_right',
          header: () =>
            HeaderHackerNewsFeedScreens({
              iconLeft: {name: 'chevron-left'},
              imageSource: images.logoInitials,
            }),
          headerShown: true,
          headerStyle: {backgroundColor: '#f5f5f5'},
          headerShadowVisible: true,
        }}
      />

      <Stack.Screen
        name="FavoritesScreen"
        component={FavoritesScreen}
        options={{
          gestureEnabled: false,
          animation: 'slide_from_right',
          header: () =>
            HeaderHackerNewsFeedScreens({
              iconLeft: {name: 'chevron-left'},
              imageSource: images.logoInitials,
            }),
          headerShown: true,
          headerStyle: {backgroundColor: '#f5f5f5'},
          headerShadowVisible: true,
        }}
      />

      <Drawer.Screen
        name="CemeteryNewsScreen"
        component={CemeteryNewsScreen}
        options={{
          header: () =>
            HeaderHackerNewsFeedScreens({
              iconLeft: {name: 'chevron-left'},
              imageSource: images.logoInitials,
            }),
          headerShown: true,
          headerStyle: {backgroundColor: '#f5f5f5'},
          headerShadowVisible: true,
        }}
      />

      <Stack.Screen
        name="OnboardingScreen"
        component={OnboardingScreen}
        options={{
          gestureEnabled: false,
          animation: 'slide_from_right',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="ErrorboundaryScreen"
        component={ErrorboundaryScreen}
        options={{
          gestureEnabled: false,
          animation: 'slide_from_bottom',
          headerShown: false,
          autoHideHomeIndicator: true,
          presentation: 'transparentModal',
        }}
      />
    </Stack.Navigator>
  );
};

export default HackerNewsFeedNavigator;
