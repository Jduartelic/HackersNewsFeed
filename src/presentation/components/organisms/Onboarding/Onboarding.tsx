import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  Image,
  useWindowDimensions,
} from 'react-native';
import styles from './Onboarding.styles';
import {constants} from '../../../constants';
import {images} from '../../../../domain';

const OnboardingScreen = (): React.JSX.Element => {
  const {WELCOME_TITLE, THANKS_COMMENT} = constants.ONBOARDING;
  const {width} = useWindowDimensions();

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />

      <View style={{paddingHorizontal: 16}}>
        <Text
          style={{
            fontFamily: 'Cochin',
            fontWeight: '700',
            fontSize: 40,
            color: '#000',
          }}>
          {WELCOME_TITLE}
        </Text>
      </View>

      <View style={{flexShrink: 1}}>
        <Image
          style={{width: width, height: 250}}
          source={images.Welcome}
          resizeMode="contain"
        />
      </View>
      <View style={{paddingHorizontal: 16}}>
        <Text
          style={{
            fontWeight: '400',
            fontSize: 20,
            color: '#000',
          }}>
          {THANKS_COMMENT}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
