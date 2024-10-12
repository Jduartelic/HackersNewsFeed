import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen, WebViewScreen} from '../screens';
import {NavigationContainer} from '@react-navigation/native';
import {HackerNewsFeedStack} from '../navigationContainer/navigationStack';
import {NewsContextProvider} from '../stores/entities';
import {MainHeader} from '../components/molecules';
import {images} from '../../domain';

const Stack = createNativeStackNavigator<HackerNewsFeedStack>();

const HackerNewsFeedNavigator = () => {
  return (
    <NewsContextProvider>
      <NavigationContainer>
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
            options={{gestureEnabled: false, animation: 'slide_from_right'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NewsContextProvider>
  );
};

export default HackerNewsFeedNavigator;
