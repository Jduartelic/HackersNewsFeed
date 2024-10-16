import React from 'react';
import {SafeAreaView, StatusBar, View, Text, Image} from 'react-native';
import styles from './Onboarding.styles';
import {constants} from '../../../constants';
import {images} from '../../../../domain';

const OnboardingScreen = (): React.JSX.Element => {
  const {MAIN_COLOR, ONBOARDING} = constants;
  const {WELCOME_TITLE, THANKS_COMMENT} = ONBOARDING;

  return (
    <SafeAreaView testID="onboarding-container" style={styles.mainContainer}>
      <StatusBar barStyle={'dark-content'} backgroundColor={MAIN_COLOR} />

      <View style={styles.paddingContainer}>
        <Text style={styles.titleText}>{WELCOME_TITLE}</Text>
      </View>

      <View style={styles.containerImage}>
        <Image
          style={styles.image}
          source={images.Welcome}
          resizeMode="contain"
        />
      </View>
      <View style={styles.paddingContainer}>
        <Text style={styles.commentContainer}>{THANKS_COMMENT}</Text>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
