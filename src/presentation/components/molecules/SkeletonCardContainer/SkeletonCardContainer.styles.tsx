import {StyleSheet, Dimensions} from 'react-native';

const SHADOW_COLOR = '#000';
const ANDROID_ELEVATION = 4;
const SHADOW_OFFSET_PROPS = {width: 0, height: -4};
const SHADOW_OPACITY = 0.1;
const SHADOW_RADIUS = 16;
const {width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  skeletonContainer: {
    minHeight: 100,
    width: width - 32,
    backgroundColor: 'white',
    borderRadius: 16,
    marginTop: 16,
    elevation: ANDROID_ELEVATION,
    shadowOffset: SHADOW_OFFSET_PROPS,
    shadowOpacity: SHADOW_OPACITY,
    shadowRadius: SHADOW_RADIUS,
    shadowColor: SHADOW_COLOR,
  },
  skeletonHeaderContainer: {
    flex: 0.25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonBodyContainer: {
    flex: 0.55,
    flexDirection: 'row',
  },
  skeletonFooterContainer: {
    flex: 0.2,
    flexDirection: 'row',
  },
});

export default styles;
