import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Dimensions, StatusBar, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProgressBar from './components/ProgressBar';
import { useProgress } from './ProgressContext';
import { usePlayer } from './Context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import APP_CONFIG from '../../app.json'

const MainControls = ({ resetControlsTimeout }) => {
  const { rewind10, forward10 } = useProgress();

  const { state, pausePlay } = usePlayer();

  const using = fn => () => {
    resetControlsTimeout();
    fn();
  };

  return (
    <View
      style={{
        gap: state.fullscreen ? 60 : 30,
        flexDirection: 'row',
        position: 'absolute',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 30,
      }}>
      <TouchableOpacity
        style={{
          height: 50,
          width: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <MaterialCommunityIcons
          color="white"
          size={state.fullscreen ? 40 : 35}
          name="rewind-10"
          onPress={using(rewind10)}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          height: 50,
          width: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <MaterialCommunityIcons
          color="white"
          size={state.fullscreen ? 50 : 45}
          name={state.paused ? 'play' : 'pause'}
          onPress={using(pausePlay)}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          height: 50,
          width: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={using(forward10)}>
        <MaterialCommunityIcons
          color="white"
          size={state.fullscreen ? 40 : 35}
          name="fast-forward-10"
        />
      </TouchableOpacity>
    </View>
  );
};

const FullScreen = ({ onPress }) => {
  const { state } = usePlayer();

  return (
    <TouchableOpacity
      style={{
        position: 'absolute',
        width: 40,
        height: 40,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 30,
        top: state.fullscreen ? 10 : 0,
      }}>
      <MaterialCommunityIcons
        color="white"
        size={35}
        name={state.fullscreen ? 'fullscreen-exit' : 'fullscreen'}
        onPress={onPress}
      />
    </TouchableOpacity>
  );
};

const Controls = ({ onStart, onUpdate, onEnd, fullScreen }) => {
  const { rewind10, forward10 } = useProgress();
  const { state, pausePlay, dispatch } = usePlayer();
  const opacity = useSharedValue(1);
  const display = useSharedValue('flex');
  const showControls = useSharedValue(true);
  const controlsStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      // transform: [{scale: display.value}],
      display: display.value,
    };
  });
  const controlsTimeout = useRef();

  const Blur = () => {
    console.log('Blur');
    dispatch({
      type: 'CONTROLS',
      payload: {
        showControls: false,
      },
    });
    showControls.value = false;
    opacity.value = withTiming(
      0,
      { duration: 200 },
      () => (display.value = 'none'),
    );
  };
  const resetControlsTimeout = () => {
    clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(Blur, 5000);
  };
  const Focus = () => {
    console.log('Focus');
    dispatch({
      type: 'CONTROLS',
      payload: {
        showControls: true,
      },
    });
    showControls.value = true;
    // display.value = 1;
    display.value = 'flex';
    opacity.value = withTiming(1, {
      duration: 200,
    });
    resetControlsTimeout();
  };

  const onPress = () => {
    console.log('onPress', showControls.value);
    onEnd({ velocityY: -1 });
    if (state.showControls && showControls.value) {
      Blur();
    } else {
      Focus();
    }
  };

  useEffect(() => {
    resetControlsTimeout();
  }, []);


  return (

    <GestureDetector
      gesture={Gesture.Pan()
        .maxPointers(1)
        .onStart(e => {
          opacity.value = withTiming(0, {
            duration: 100,
          });
          display.value = 'none';
          showControls.value = false;
          onStart(e);
        })
        .onUpdate(onUpdate)
        .onEnd(onEnd)
      }>
      <TouchableOpacity
        activeOpacity={1}
        style={{
          position: 'absolute',
          width: '100%',
          aspectRatio: 16 / 9,
          zIndex: 20,
          height: '100%',
          paddingHorizontal: state.fullscreen ? (StatusBar.currentHeight * 1.2) : 0,
        }}
        onPress={onPress}>
        {/* {state.isBuffering ? (
          <Text
            style={{
              position: 'absolute',
              top: 60,
              right: 60,
              backgroundColor: 'orange',
              color: 'white',
            }}>
            Buffering
          </Text>
        ) : null} */}
        <Animated.View
          style={[
            {
              height: '100%',
              width: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            controlsStyle,
          ]}>
          {!!state.isBuffering
            ? <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size={50} color={APP_CONFIG.primaryColor} />
            </View>
            : <MainControls resetControlsTimeout={resetControlsTimeout} />
          }
          <FullScreen onPress={fullScreen} />
          <ProgressBar resetControlsTimeout={resetControlsTimeout} />
        </Animated.View>
        {/* ) : null} */}
      </TouchableOpacity>
    </GestureDetector>
  );
};

export default Controls;
