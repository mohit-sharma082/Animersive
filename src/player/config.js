import {Dimensions, StatusBar} from 'react-native';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('screen');
const {width: WINDOW_WIDTH, height: WINDOW_HEIGHT} = Dimensions.get('window');
const AVAILABLE_SCREEN_HEIGHT =
  WINDOW_HEIGHT - (WINDOW_WIDTH * 9) / 16 
  // + StatusBar.currentHeight;

const SCREEN_WIDTH_PERCENTAGE = WINDOW_WIDTH / 100;
const SCREEN_HEIGHT_PERCENTAGE = SCREEN_HEIGHT / 100;
const HALF_SCREEN_WIDTH = WINDOW_WIDTH / 2;
export {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  AVAILABLE_SCREEN_HEIGHT,
  SCREEN_WIDTH_PERCENTAGE,
  SCREEN_HEIGHT_PERCENTAGE,
  HALF_SCREEN_WIDTH,
};
