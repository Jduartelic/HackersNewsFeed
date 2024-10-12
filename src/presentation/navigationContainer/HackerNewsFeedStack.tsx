import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen, WebViewScreen} from '../screens';
import {NavigationContainer} from '@react-navigation/native';
import {HackerNewsFeedStack} from '../navigationContainer/navigationStack';
import {NewsContextProvider} from '../stores/entities';

const Stack = createNativeStackNavigator<HackerNewsFeedStack>();

const HackerNewsFeedNavigator = () => {
  return (
    <NewsContextProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{gestureEnabled: false, animation: 'slide_from_right'}}
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
