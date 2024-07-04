import { Slider } from '@miblanchard/react-native-slider';
import { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import Video from 'react-native-video';
import { extract } from './utils';
import { useProgress } from './ProgressContext';
import Controls from './Controls';
import { usePlayer } from './Context';
import Captions from './Captions';

const Player = () => {
  const { onProgress, onLoad } = useProgress();
  const { state, videoRef, onBuffer } = usePlayer();

  useEffect(() => {
    // Orientation.lockToLandscape();
    console.log(`HERE ARE THE SOURCES : `, state.config.sources);
  }, []);

  return state.config ? (
    <View
      style={{
        height: '100%',
        aspectRatio: 16 / 9,
        alignSelf: 'center',
      }}>
      <Video
        ref={videoRef}
        muted={state.muted}
        paused={state.paused}
        style={{
          width: '100%',
          // height: '100%',
          aspectRatio: 16 / 9,
          alignSelf: 'center',
        }}
        resizeMode={'contain'}
        source={{
          uri: state.config.sources[1].url,
          type: 'm3u8',
        }}
        onLoad={onLoad}
        onError={err => {
          console.log('onError', err);
        }}
        onProgress={onProgress}
        progressUpdateInterval={300}
        onBuffer={onBuffer}
        onVideoBuffer={() => {
          console.log('onVideoBuffer');
        }}
        onVideoLoadStart={() => {
          console.log('onVideoLoadStart');
        }}
        bufferConfig={{
          minBufferMs: 10000,
          maxBufferMs: 180000,
          bufferForPlaybackMs: 2500,
          bufferForPlaybackAfterRebufferMs: 0,
          
        }}
        preferredForwardBufferDuration={0}
      />
      <Captions  />
      {/* <Controls animateToFullScreen={animateToFullScreen} /> */}
    </View>
  ) : null;
};

export default Player;
