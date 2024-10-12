import {StyleSheet, Dimensions} from 'react-native';

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
});

export default styles;
