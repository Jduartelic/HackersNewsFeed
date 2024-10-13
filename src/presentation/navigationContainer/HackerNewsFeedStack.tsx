import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  HomeScreen,
  WebViewScreen,
  FavoritesScreen,
  CemeteryNewsScreen,
  OnboardingScreen,
} from '../screens';
import {NavigationContainer} from '@react-navigation/native';
import {
  HackerNewsFeedStack,
  HackerNewsFeedDrawer,
} from '../navigationContainer/navigationStack';
import {
  NewsContextProvider,
  UserActivityContextProvider,
} from '../stores/entities';
import {MainHeader} from '../components/molecules';
import {images} from '../../domain';
import {createDrawerNavigator} from '@react-navigation/drawer';

const Stack = createNativeStackNavigator<HackerNewsFeedStack>();
const Drawer = createDrawerNavigator<HackerNewsFeedDrawer>();

function HackerNewsFeedNavigator() {
  return (
    <UserActivityContextProvider>
      <NewsContextProvider>
        <NavigationContainer>
          <Drawer.Navigator
            screenOptions={{
              headerShown: false,
              swipeEnabled: false,
            }}>
            <Drawer.Screen
              name="MainScreen"
              component={HackerNewsFeedScreens}
            />
            <Drawer.Screen
              name="CemeteryNewsScreen"
              component={CemeteryNewsScreen}
              options={{
                header: () => (
                  <MainHeader
                    iconLeft={{name: 'chevron-left'}}
                    imageSource={images.logoInitials}
                  />
                ),
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
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: false,
      }}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          gestureEnabled: false,
          animation: 'slide_from_right',
          header: () => (
            <MainHeader
              iconLeft={{name: 'bars'}}
              imageSource={images.logoInitials}
              iconRight={{name: 'star'}}
            />
          ),
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
          header: () => (
            <MainHeader
              iconLeft={{name: 'chevron-left'}}
              imageSource={images.logoInitials}
            />
          ),
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
          header: () => (
            <MainHeader
              iconLeft={{name: 'chevron-left'}}
              imageSource={images.logoInitials}
            />
          ),
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
    </Stack.Navigator>
  );
};

export default HackerNewsFeedNavigator;
