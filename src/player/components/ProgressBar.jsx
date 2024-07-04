import { Slider } from '@miblanchard/react-native-slider';
import React from 'react';
import { Text, View } from 'react-native';
import { usePlayer } from '../Context';
import { useProgress } from '../ProgressContext';
import { formatTime } from '../utils';
import SeekPreview from './SeekPreview';
import { primaryColor, backgroundColor } from '../../../app.json'

const ProgressBar = ({ resetControlsTimeout }) => {
  const {
    progress: { currentTime, seekableDuration, durationLeft },
    onValueChange,
  } = useProgress();
  const { state, onSlidingStart, onSlidingComplete } = usePlayer();

  return (
    <View
      style={{
        position: 'absolute',
        width: '100%',
        bottom: state.fullscreen ? 20 : 0,
        zIndex: 40,
        backgroundColor: 'red',
      }}>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          bottom: 0,
          zIndex: 100,
          paddingHorizontal: 10,
        }}>
        <View
          style={{
            width: '100%',
            // backgroundColor: 'blue',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontSize: 12,
              color: 'white',
              fontWeight: 'bold',
            }}>
            {formatTime(currentTime)}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: 'white',
              fontWeight: 'bold',
            }}>
            {formatTime(durationLeft)}
          </Text>
        </View>
        <SeekPreview />
        <Slider
          maximumTrackTintColor="rgba(255, 255, 255, 0.5)"
          minimumTrackTintColor={primaryColor}
          thumbStyle={{
            backgroundColor: primaryColor,
            // height: !!state?.isSeeking ? 22 : 14,
            // width: !!state?.isSeeking ? 22 : 14,
          }}
          value={currentTime}
          onValueChange={v => {
            resetControlsTimeout();
            onValueChange(v);
          }}
          onSlidingStart={onSlidingStart}
          onSlidingComplete={onSlidingComplete}
          maximumValue={seekableDuration}
          trackStyle={{
            height: !!state?.isSeeking ? 5 : 3,
            borderRadius: 10
          }}
          containerStyle={
            {
              // width: '100%',
            }
          }
        />
      </View>
    </View>
  );
};

export default ProgressBar;
