import {StyleSheet} from 'react-native';

const SHADOW_COLOR = '#000';
const ANDROID_ELEVATION = 4;
const SHADOW_OFFSET_PROPS = {width: 0, height: -4};
const SHADOW_OPACITY = 0.1;
const SHADOW_RADIUS = 16;

const styles = StyleSheet.create({
  container: {flex: 1},
  cardContainer: {
    flex: 1,
    flexDirection: 'column',
    minHeight: 100,
    width: '100%',
    paddingHorizontal: 16,
  },
  innerCardContainer: {
    flex: 1,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: ANDROID_ELEVATION,
    shadowOffset: SHADOW_OFFSET_PROPS,
    shadowOpacity: SHADOW_OPACITY,
    shadowRadius: SHADOW_RADIUS,
    shadowColor: SHADOW_COLOR,
  },
  cardHeaderContainer: {
    flex: 0.25,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 16,
  },
  cardBodyContainer: {
    flex: 0.55,
    flexDirection: 'row',
  },
  cardFooterContainer: {
    flex: 0.2,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  containerFavoritesbutton: {
    flexShrink: 1,
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  containerTrashButton: {
    position: 'absolute',
    width: '20%',
    minHeight: 99,
    top: 16,
    right: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  trashButton: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderTopStartRadius: 20,
    borderBottomStartRadius: 20,
    padding: 16,
    zIndex: 100,
  },
  tapContainer: {
    flex: 1,
    height: '88%',
    zIndex: 100,
    position: 'absolute',
    top: 16,
    bottom: 0,
    right: 0,
  },
  imageContainer: {height: 50, width: 50, borderRadius: 100},
});

export default styles;
