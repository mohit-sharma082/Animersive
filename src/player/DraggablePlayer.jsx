import { Gesture, GestureDetector, ScrollView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  runOnRuntime,
  useAnimatedReaction,
  withTiming,
} from 'react-native-reanimated';
import Player from './Player';
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  AVAILABLE_SCREEN_HEIGHT,
  SCREEN_WIDTH_PERCENTAGE,
  HALF_SCREEN_WIDTH,
} from './config';
import styles from './styles';
import { FlatList, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { usePlayer } from './Context';
import Controls from './Controls';
import Orientation from 'react-native-orientation-locker';
import { BackHandler } from 'react-native';
import { backgroundColor, primaryColor } from '../../app.json'
import { NativeModules } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import Icons from '../components/UI/Icons';
import { useStatusBarContext } from '../state/StatusBarContext';
const { PipModule } = NativeModules;




const calculateWidth = (absoluteY, heightOffset) => {
  'worklet';
  return Math.min(
    Math.max(
      HALF_SCREEN_WIDTH,
      SCREEN_WIDTH_PERCENTAGE *
      (100 -
        ((absoluteY / 2 - heightOffset) / AVAILABLE_SCREEN_HEIGHT) * 100),
    ),
    WINDOW_WIDTH,
  );
};

function DragablePlayer({ player }) {

  //------- PLAYER ----------
  const playerWidth = useSharedValue(WINDOW_WIDTH);
  const playerAspectRatio = useSharedValue(16 / 9);
  const playerTranslationY = useSharedValue(0);
  //------------------------

  const bottomTranslationY = useSharedValue(0);
  const heightOffset = useSharedValue(0);
  const isAnimating = useSharedValue(false);

  const fullScreenListener = useRef(null);
  const { state, dispatch, videoRef, load } = usePlayer();

  const [visibleEpisodes, setVisibleEpisodes] = useState([...state.episodes.slice(0, 10)]);

  const PlayerContainerStyles = useAnimatedStyle(() => {
    return {
      width: playerWidth.value,
      transform: [
        {
          translateY: playerTranslationY.value,
        },
      ],
      aspectRatio: playerAspectRatio.value,
      // borderWidth: playerTranslationY.value > 0 ? 1 : 0,
      borderColor: !!state.fullscreen ? 'transparent' : '#7d7d7d50',
      // marginTop: (!!state?.fullScreen ? 0 : StatusBar?.currentHeight) ?? 0
    };
  });


  const BottomContainerStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: bottomTranslationY.value }],
      opacity: 1 - bottomTranslationY.value / AVAILABLE_SCREEN_HEIGHT,
    };
  });

  const onStart = ({ y }) => {
    'worklet';
    if (state.fullscreen) {
      console.log('\n=>Fullscreen PAN VALUE START => ', y);
      return;
    }
    heightOffset.value = y;
    isAnimating.value = true;
    // console.log(`=> Height offset on START - ${heightOffset.value}`);
  };


  const onUpdate = ({ absoluteY }) => {
    'worklet';
    if (state.fullscreen) {
      // console.log('\n=>Fullscreen PAN VALUE UPDATE => ', absoluteY);
      return;
    }
    if (!heightOffset.value) return;
    const absoluteWithOffset = absoluteY - heightOffset.value;

    // console.log(`~> Height offset ~ ${heightOffset.value}`);
    // console.log(`~> Absolute Y ~ ${absoluteY}`);
    // console.log(`~> ABSOLUTE WITH OFFSET  ~ ${absoluteWithOffset}`);
    // console.log(`\n~~~~~~~~~~~~~~~~~~~~\n\n`);

    if (absoluteWithOffset > 0 && absoluteWithOffset < WINDOW_HEIGHT - 200) {
      playerTranslationY.value = absoluteWithOffset;
      playerWidth.value = calculateWidth(absoluteY, heightOffset.value);
      bottomTranslationY.value = absoluteWithOffset;
    }
  };

  const onEnd = ({ velocityY }) => {
    'worklet';
    if (state.fullscreen) {
      console.log('\n=>Fullscreen PAN VALUE END => ', velocityY);
      return;
    }
    heightOffset.value = 0;
    // console.log(`=> Height offset on END - ${heightOffset.value}`);
    // console.log(`=> VELOCITY Y on END - ${velocityY}`);

    isAnimating.value = false;
    if (velocityY > 0) {
      playerTranslationY.value = withSpring(WINDOW_HEIGHT - 200, {
        duration: 500,
        stiffness: true,
        dampingRatio: 1,
      });
      playerWidth.value = withSpring(HALF_SCREEN_WIDTH, {
        duration: 500,
        stiffness: true,
        dampingRatio: 1,
      });
      bottomTranslationY.value = withSpring(WINDOW_HEIGHT, {
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
      playerWidth.value = withSpring(WINDOW_WIDTH, {
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

    // console.log(`Vel ~ ${velocityY} | Bottom - ${bottomTranslationY.value} | Player - ${playerTranslationY.value} `)
  };

  const enterFullScreen = () => {
    dispatch({
      type: 'FULLSCREEN',
      payload: {
        fullscreen: true,
      },
    });
    state.fullscreen = true;
    Orientation.lockToLandscape();
    console.log(SCREEN_HEIGHT / SCREEN_WIDTH);
    playerAspectRatio.value = SCREEN_HEIGHT / SCREEN_WIDTH;
    playerWidth.value = SCREEN_HEIGHT;
    videoRef.current.presentFullscreenPlayer();

  };

  const exitFullScreen = () => {
    state.fullscreen = false;
    playerAspectRatio.value = 16 / 9;
    playerWidth.value = WINDOW_WIDTH;
    videoRef.current.dismissFullscreenPlayer();
    Orientation.lockToPortrait();
    dispatch({
      type: 'FULLSCREEN',
      payload: {
        fullscreen: false,
      },
    });
    fullScreenListener.current?.remove?.();
  };

  const fullScreen = () => {
    console.log('fullScreen');
    if (!state.fullscreen) {
      enterFullScreen();
      fullScreenListener.current = BackHandler.addEventListener(
        'hardwareBackPress',
        e => {
          exitFullScreen();
          return true;
        },
      );
      // PipModule.enterPipMode();
    } else {
      exitFullScreen();
    }
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      e => {
        if (playerWidth.value === HALF_SCREEN_WIDTH) {
          return false;
        }
        onEnd({ velocityY: 1 });
        return true;
      },
    );
    return () => {
      subscription.remove();
    };
  }, []);


  const pagination = (Array.from({ length: Math.ceil(state.episodes.length / 10) }, (_, i) => {
    const start = i * 10;
    const end = start + 10;
    return {
      text: `${start + 1} - ${Math.min(end, state.episodes.length)}`,
      episodeIds: state.episodes.slice(start, end).map(ep => ep.episodeId) ?? []
    };
  }));


  return (
    <>
      <Animated.View style={[styles.playerContainer, PlayerContainerStyles]}>
        <Player animateToFullScreen={() => onEnd({ velocityY: -1 })} />
        <Controls
          onStart={onStart}
          onUpdate={onUpdate}
          onEnd={onEnd}
          fullScreen={fullScreen}
        />
      </Animated.View>
      <Animated.View style={[styles.bottomContainer, BottomContainerStyles]}>
        <View style={{
          display: 'flex', flexDirection: 'row', alignItems: 'center',
          paddingVertical: 10,
        }}>

          <Text
            style={{
              color: 'white',
              padding: 10,
              fontSize: 17,
              fontWeight: 'bold',
              borderColor: primaryColor, borderRightWidth: 1,
            }}>
            Episodes
          </Text>

          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            horizontal={true}
            data={pagination}
            style={{ paddingRight: 50 }}
            contentContainerStyle={{ gap: 15, paddingStart: 4 }}
            renderItem={({ item: { episodeIds, text }, index }) => {
              return (
                <TouchableOpacity onPress={() => {
                  const nextEpisodes = state.episodes.slice(index * 10, (index + 1) * 10);
                  setVisibleEpisodes(nextEpisodes);
                }} >
                  <Text
                    style={{
                      color: 'white',
                      padding: 15,
                      fontSize: 12,
                      borderColor: episodeIds?.includes(state.episodeId) ? primaryColor : backgroundColor,
                      borderWidth: 1,
                      backgroundColor: episodeIds?.includes(visibleEpisodes[0].episodeId)
                        ? primaryColor
                        : 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 2
                    }}>
                    {text}
                  </Text>


                </TouchableOpacity>
              );
            }}
            keyExtractor={item => item.episodeIds}
          />
        </View>
        {/* <ScrollView>
          <Text>
            {JSON.stringify(Object.keys(state), 0,4)}
            {JSON.stringify(state, 0,4)}
          </Text>
        </ScrollView> */}
        <FlatList

          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 100 }}
          data={visibleEpisodes}
          contentContainerStyle={{
            gap: 10,
            paddingBottom: 10,
          }}
          renderItem={({ item: { episodeId, title }, index }) => {
            return (
              <TouchableOpacity
                onPress={() => load(episodeId)}
                style={{
                  marginHorizontal: 14,
                  marginTop: 4,
                  paddingHorizontal: 20,
                  paddingVertical: 14,
                  borderBottomColor: '#ccc',
                  backgroundColor:
                    state.episodeId === episodeId
                      ? primaryColor
                      : 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 6,
                }}>
                <Text
                  style={{
                    color: state.episodeId === episodeId ? 'black' : 'white',
                  }}>
                  {state.episodes.indexOf(state.episodes.find(item => item.episodeId == episodeId)) + 1} <Icons name={'arrow-right'} size={12} /> {title}
                </Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={item => item.episodeId}
        />
      </Animated.View>
    </>
  );
}

export default DragablePlayer;
