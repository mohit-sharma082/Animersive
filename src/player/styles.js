import { StatusBar, StyleSheet } from 'react-native';
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  AVAILABLE_SCREEN_HEIGHT,
  SCREEN_WIDTH_PERCENTAGE,
  HALF_SCREEN_WIDTH,
} from './config';

const styles = StyleSheet.create({
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: WINDOW_WIDTH,
    backgroundColor: 'black',
    zIndex: 15,
    zIndex: 10,
    height: AVAILABLE_SCREEN_HEIGHT,

  },
  playerContainer: {
    position: 'absolute',
    zIndex: 15,
    backgroundColor: 'black',
    right: 0,
    borderWidth: 1,
    borderColor: '#7d7d7d50' ,
    // marginTop: StatusBar?.currentHeight ?? 0,

  },
});
export default styles;
