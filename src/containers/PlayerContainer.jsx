import {Button, Dimensions, Easing, StatusBar} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import Player from '../components/player/Player';

let {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const AVAILABLE_SCREEN_HEIGHT =
  SCREEN_HEIGHT - StatusBar.currentHeight - (SCREEN_WIDTH * 9) / 16;
const SCREEN_WIDTH_PERCENTAGE = SCREEN_WIDTH / 100;
const HALF_SCREEN_WIDTH = SCREEN_WIDTH / 2;

const calculateWidth = (absoluteY, heightOffset) => {
  'worklet';
  return Math.min(
    Math.max(
      HALF_SCREEN_WIDTH,
      SCREEN_WIDTH_PERCENTAGE *
        (100 -
          ((absoluteY / 2 - heightOffset) / AVAILABLE_SCREEN_HEIGHT) * 100),
    ),
    SCREEN_WIDTH,
  );
};

function DragablePlayer({player}) {
  const playerWidth = useSharedValue(SCREEN_WIDTH);
  const playerTranslationY = useSharedValue(0);
  const bottomTranslationY = useSharedValue(0);
  const heightOffset = useSharedValue(0);
  const PlayerContainerStyles = useAnimatedStyle(() => {
    return {
      width: playerWidth.value,
      transform: [
        {
          translateY: playerTranslationY.value,
        },
      ],
    };
  });

  const BottomContainerStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: bottomTranslationY.value,
        },
      ],
      // opacity: 1 - bottomTranslationY.value / AVAILABLE_SCREEN_HEIGHT,
    };
  });

  return (
    <>
      <GestureDetector
        gesture={Gesture.Pan()
          .maxPointers(1)
          .onStart(({y}) => (heightOffset.value = y))
          .onUpdate(({absoluteY}) => {
            if (!heightOffset.value) return;
            const absoluteWithOffset = absoluteY - heightOffset.value;
            if (
              absoluteWithOffset > 0 &&
              absoluteWithOffset < SCREEN_HEIGHT - 200
            ) {
              playerTranslationY.value = absoluteWithOffset;
              playerWidth.value = calculateWidth(absoluteY, heightOffset.value);
              bottomTranslationY.value = absoluteWithOffset;
            }
          })
          .onEnd(e => {
            heightOffset.value = 0;
            if (e.velocityY > 0) {
              playerTranslationY.value = withSpring(SCREEN_HEIGHT - 190, {
                duration: 500,
                stiffness: true,
                dampingRatio: 1,
              });
              playerWidth.value = withSpring(HALF_SCREEN_WIDTH, {
                duration: 500,
                stiffness: true,
                dampingRatio: 1,
              });
              bottomTranslationY.value = withSpring(SCREEN_HEIGHT, {
                duration: 500,
                stiffness: true,
                dampingRatio: 1,
              });
            } else {
              playerTranslationY.value = withSpring(0, {
                duration: 500,
                stiffness: true,
                dampingRatio: 1,
              });
              playerWidth.value = withSpring(SCREEN_WIDTH, {
                duration: 500,
                stiffness: true,
                dampingRatio: 1,
              });
              bottomTranslationY.value = withSpring(0, {
                duration: 500,
                stiffness: true,
                dampingRatio: 1,
              });
            }
          })}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              right: 0,
              width: SCREEN_WIDTH,
              // backgroundColor: 'blue',
              // borderRadius: 15,
              zIndex: 15,
              aspectRatio: 16 / 9,
              borderWidth: 1,
              borderColor: 'red',
            },
            PlayerContainerStyles,
          ]}>
          <Player />
        </Animated.View>
      </GestureDetector>
      <Animated.ScrollView
        style={[
          {
            position: 'absolute',
            bottom: 0,
            height: 300,
            width: SCREEN_WIDTH,
            backgroundColor: 'black',
            // borderRadius: 15,
            zIndex: 15,
            zIndex: 10,
            height: AVAILABLE_SCREEN_HEIGHT,
          },
          BottomContainerStyles,
        ]}></Animated.ScrollView>
    </>
  );
}

export default DragablePlayer;

note10 = {
  AVAILABLE_SCREEN_HEIGHT: 695.4475296226835,
  StatusBar: 38.0562629699707,
  screen: {
    fontScale: 1,
    height: 982.0971292112035,
    scale: 2.4437501430511475,
    width: 441.9437081450416,
  },
  window: {
    fontScale: 1,
    height: 944.0408654542695,
    scale: 2.4437501430511475,
    width: 441.9437081450416,
  },
};

emulator = {
  AVAILABLE_SCREEN_HEIGHT: 606,
  StatusBar: 24,
  screen: {
    fontScale: 1,
    height: 850.9090909090909,
    scale: 2.75,
    width: 392.72727272727275,
  },
  window: {
    fontScale: 1,
    height: 826.9090909090909,
    scale: 2.75,
    width: 392.72727272727275,
  },
};

moto = {
  AVAILABLE_SCREEN_HEIGHT: 651,
  StatusBar: 42,
  screen: {fontScale: 0.8500000238418579, height: 960, scale: 2.5, width: 432},
  window: {fontScale: 0.8500000238418579, height: 894, scale: 2.5, width: 432},
};

realme7 = {
  AVAILABLE_SCREEN_HEIGHT: 515.1666666666666,
  StatusBar: 38.33333206176758,
  screen: {fontScale: 1, height: 800, scale: 3, width: 360},
  window: {fontScale: 1, height: 717.6666666666666, scale: 3, width: 360},
};
