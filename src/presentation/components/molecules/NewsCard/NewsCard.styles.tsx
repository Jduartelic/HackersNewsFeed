import {StyleSheet, Dimensions} from 'react-native';

const SHADOW_COLOR = '#000';
const ANDROID_ELEVATION = 4;
const SHADOW_OFFSET_PROPS = {width: 0, height: -4};
const SHADOW_OPACITY = 0.1;
const SHADOW_RADIUS = 16;
const {width} = Dimensions.get('screen');

const styles = StyleSheet.create({
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
    backgroundColor: 'white',
    elevation: ANDROID_ELEVATION,
    shadowOffset: SHADOW_OFFSET_PROPS,
    shadowOpacity: SHADOW_OPACITY,
    shadowRadius: SHADOW_RADIUS,
    shadowColor: SHADOW_COLOR,
  },
  cardHeaderContainer: {
    flex: 0.25,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  cardBodyContainer: {
    flex: 0.55,
    flexDirection: 'row',
  },
  cardFooterContainer: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  containerFavoritesbutton: {
    position: 'absolute',
    width: '20%',
    minHeight: 99,
    top: 16,
    left: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  favoritesbutton: {
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
});

export default styles;
