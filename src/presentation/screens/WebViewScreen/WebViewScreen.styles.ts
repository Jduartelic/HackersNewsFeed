import {StyleSheet} from 'react-native';

const CONTAINER_FLEX = 1;
const styles = StyleSheet.create({
  mainContainer: {
    flex: CONTAINER_FLEX,
    width: '100%',
    backgroundColor: '#fff',
  },
  webViewContainer: {
    flex: CONTAINER_FLEX,
  },
  webViewLoadingContainer: {
    flexGrow: CONTAINER_FLEX,
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: CONTAINER_FLEX,
    width: '100%',
  },
});
export default styles;
