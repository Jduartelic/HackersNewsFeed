import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from '../screens';
import {NavigationContainer} from '@react-navigation/native';
import {HackerNewsFeedStack} from '../navigationContainer/navigationStack';

const Stack = createNativeStackNavigator<HackerNewsFeedStack>();

const HackerNewsFeedNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default HackerNewsFeedNavigator;
