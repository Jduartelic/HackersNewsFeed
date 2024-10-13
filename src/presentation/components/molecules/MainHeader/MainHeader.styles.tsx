import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    flexShrink: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  innerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 70,
  },
  imageContainer: {
    height: 60,
    width: 60,
    borderRadius: 100,
  },
});

export default styles;
