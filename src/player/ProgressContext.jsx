import {createContext, useContext, useReducer, useRef} from 'react';
import DragablePlayer from './DraggablePlayer';
import Player from '../components/player/Player';
import {usePlayer} from './Context';
import getSeekThumbnail from './utils/getSeekThumbnail';

const Context = createContext();
export function useProgress() {
  return useContext(Context);
}

const initialState = {
  currentTime: 0,
  seekableDuration: 0,
  playableDuration: 0,
  duration: 0,
  durationLeft: 0,
  thumbnail: null,
};

const ProgressContext = ({children}) => {
  function reducer(state, {type, payload}) {
    switch (type) {
      case 'PROGRESS':
        return {
          ...state,
          currentTime: payload.currentTime ?? state.currentTime,
          seekableDuration: payload.seekableDuration,
          playableDuration: payload.playableDuration,
          durationLeft: payload.durationLeft,
        };
      case 'CURRENT_TIME':
        return {
          ...state,
          currentTime: payload.currentTime,
        };
      case 'DURATION':
        return {
          ...state,
          duration: payload.duration,
        };
      case 'THUMBNAIL':
        return {
          ...state,
          thumbnail: payload.thumbnail,
        };
      default:
        return state;
    }
  }
  const [progress, dispatch] = useReducer(reducer, initialState);
  const {videoRef, state} = usePlayer();

  const onProgress = ({currentTime, seekableDuration, playableDuration}) => {
    // console.log('onProgress', {
    //   currentTime,
    //   seekableDuration,
    //   playableDuration,
    // });
    const payload = {
      seekableDuration,
      playableDuration,
      durationLeft: progress.duration - currentTime,
    };

    if (!state.isSeeking) {
      payload.currentTime = currentTime;
    }

    dispatch({
      type: 'PROGRESS',
      payload,
    });
  };

  const onLoad = ({duration}) => {
    dispatch({
      type: 'DURATION',
      payload: {
        duration,
      },
    });
  };

  const rewind10 = () => {
    let time = progress.currentTime - 10;
    time = time > 0 ? time : 0;
    dispatch({
      type: 'CURRENT_TIME',
      payload: {
        currentTime: time,
      },
    });
    videoRef.current.seek(time);
  };

  const forward10 = () => {
    const time = progress.currentTime + 10;
    dispatch({
      type: 'CURRENT_TIME',
      payload: {
        currentTime: time,
      },
    });
    videoRef.current.seek(time);
  };

  const onValueChange = ([value]) => {
    dispatch({
      type: 'CURRENT_TIME',
      payload: {
        currentTime: value,
      },
    });

    if (state.config?.thumbnails) {
      const thumbnail = getSeekThumbnail(value, state.config.thumbnails);
      // console.log(thumbnail)
      dispatch({
        type: 'THUMBNAIL',
        payload: {thumbnail},
      });
    }
  };
  return (
    <Context.Provider
      value={{
        progress,
        onProgress,
        onLoad,
        rewind10,
        forward10,
        onValueChange,
      }}>
      {children}
    </Context.Provider>
  );
};

export default ProgressContext;
