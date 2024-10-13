import {StyleSheet, Dimensions} from 'react-native';

const WIDTH = Dimensions.get('screen').width;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewSkeleton: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paddingContainer: {paddingHorizontal: 16},
  titleText: {
    fontWeight: '700',
    fontSize: 40,
    color: '#000',
  },
  containerImage: {flexShrink: 1},
  commentContainer: {
    fontWeight: '400',
    fontSize: 20,
    color: '#000',
  },
  image: {width: WIDTH, height: 250},
});
export default styles;
