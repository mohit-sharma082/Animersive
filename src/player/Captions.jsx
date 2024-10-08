import React, { useEffect, useState } from 'react';
import { Text, UIManager, View, findNodeHandle } from 'react-native';
import { useProgress } from './ProgressContext';
import { usePlayer } from './Context';

const Captions = ({ data= {} }) => {
  const [currentSubtitle, setCurrentSubtitle] = useState(null);
  const {
    progress: { currentTime },
  } = useProgress();
  const { state } = usePlayer();
  // const [fontSize, setFontSize]
  useEffect(() => {
    // console.log('currentTime changed', currentTime);
    if (!state?.config?.textTrack?.length) return;
    const sub = state.config.textTrack.find(
      t => t.from <= currentTime && t.to >= currentTime,
    );
    if (sub?.text === currentSubtitle) {
      return;
    }
    // console.log({currentTime, sub});
    if (sub?.text) {
      setCurrentSubtitle(sub?.text);
    } else if (!sub?.text && currentSubtitle) {
      setCurrentSubtitle(null);
    }

  }, [currentTime]);

// return null
  return currentSubtitle && state.config?.textTrack ? (
    <View
      style={{
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        // backgroundColor: 'rgba(0,0,0,0.2)'
      }}>
      <Text
        style={{
          fontSize: state?.captionsFontSize ?? 12,
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
          textShadowOffset: {
            height: 0,
            width: 0,
          },
          textShadowRadius: 15,
          textShadowColor: 'black',
          margin: 4,
        }}>
          {/* {JSON.stringify(data, 0 , 2)} */}
        {currentSubtitle}
      </Text>
    </View>
  ) : null;
};

export default Captions;
