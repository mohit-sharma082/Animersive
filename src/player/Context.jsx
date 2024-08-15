import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import DragablePlayer from './DraggablePlayer';
import { CONSUMET_API_URL } from '../../app.json'
import Player from '../components/player/Player';
import ProgressContext from './ProgressContext';
import { extract } from './utils';
import { Alert, AppState, Image, ToastAndroid } from 'react-native';
import scrapeAnimeEpisodes from '../scrapers/scrapeEpisodes';
import axios from 'axios';
import { useStatusBarContext } from '../state/StatusBarContext';
// import DeviceInfo from 'react-native-device-info';

const Context = createContext();
export function usePlayer() {
  return useContext(Context);
}

const initialState = {
  muted: false,
  paused: false,
  showControls: true,
  config: null,
  fullscreen: false,
  isBuffering: false,
  isSeeking: false,
  episodes: [],
  episodeId: null,
};

const PlayerContext = ({ children }) => {

  function reducer(state, { type, payload }) {
    switch (type) {
      case 'MUTE':
        return {
          ...state,
          muted: payload.muted,
        };
      case 'PAUSED':
        return {
          ...state,
          paused: payload.paused,
        };
      case 'CONFIG':
        return {
          ...state,
          config: payload.config,
        };
      case 'CONTROLS':
        return {
          ...state,
          showControls: payload.showControls,
        };
      case 'FULLSCREEN':
        return {
          ...state,
          fullscreen: payload.fullscreen,
        };
      case 'BUFFER':
        return {
          ...state,
          isBuffering: payload.isBuffering,
        };
      case 'SEEKING':
        return {
          ...state,
          isSeeking: payload.isSeeking,
        };
      case 'EPISODES':
        return {
          ...state,
          episodes: payload.episodes,
        };
      case 'EPISODE_ID':
        return {
          ...state,
          episodeId: payload.episodeId,
        };
      default:
        return state;
    }
  }
  const videoRef = useRef();
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', appState => {
      if (appState.match(/inactive|background/)) {
        dispatch({
          type: 'PAUSED',
          payload: {
            paused: true,
          },
        });
      }
      console.log('AppState', appState);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  async function load(episodeId = 'demon-slayer-kimetsu-no-yaiba-hashira-training-arc-19107?ep=124260') {

    try {

      console.log(`\n\n~~~~~~~~~~~~~~~~~ LOAD SINGLE EPISODE - ${episodeId} ~~~~~~~~~~~~~~~~~\n\n`);
      const config = await extract(episodeId, { lang: 'English' });
      console.log(`~~~~~~~~~~~~~~~-> `,config);
      if(!config?.sources?.[0]?.url?.length) return
      dispatch({ type: 'CONFIG', payload: { config } });
      dispatch({ type: 'EPISODE_ID', payload: { episodeId } });
      if (config?.thumbnails) {
        for (const thumbnail of config.thumbnails) {
          const prefetch = await Image.prefetch(thumbnail.content);
          // console.log('prefetched', prefetch, thumbnail.content);
        }
      }
      // console.log({hasNotch: DeviceInfo.hasNotch()});

    } catch (error) {

      console.log(`Error loading Episode: `, error);
      ToastAndroid.show(`Failed to load episode `, ToastAndroid.LONG)
    }
  }

  async function loadAnime(id, animeInfo = null) {
    try {
      console.log(`LOAD ANIME : `, id, JSON.stringify(animeInfo, 0, 4));
      // const url = "https://api.consumet.org/anime/gogoanime/top-airing";
      // const { data } = await axios.get(url, { params: { page: 1 } });

      console.log(`\n\n~~~~~~~~~~~~~~~~~`);
      // console.log(`EPISODES : ` , id, data)
      console.log(`~~~~~~~~~~~~~~~~~\n\n`);

      const { episodes } = await scrapeAnimeEpisodes(id);
      dispatch({ type: 'EPISODES', payload: { episodes } });
      await load(episodes[0].episodeId);

    } catch (error) {
      console.log(`Error loading anime: `, error);
      Alert.alert('Error', 'Failed to load anime ' + error?.message);
    }
  }
  const pausePlay = () => {
    dispatch({
      type: 'PAUSED',
      payload: {
        paused: !state.paused,
      },
    });
  };

  const onBuffer = ({ isBuffering }) => {
    dispatch({
      type: 'BUFFER',
      payload: {
        isBuffering,
      },
    });
  };

  const onSlidingStart = () => {
    dispatch({
      type: 'SEEKING',
      payload: {
        isSeeking: true,
      },
    });
  };
  const onSlidingComplete = ([value]) => {
    dispatch({
      type: 'SEEKING',
      payload: {
        isSeeking: false,
      },
    });
    videoRef.current.seek(value);
  };

  return (
    <Context.Provider
      value={{
        state,
        dispatch,
        videoRef,
        load,
        loadAnime,
        pausePlay,
        onBuffer,
        onSlidingStart,
        onSlidingComplete,
      }}>
      <ProgressContext>
        {children}
        {state.config ?
          <DragablePlayer player={Player} />
          : null}
      </ProgressContext>
    </Context.Provider>
  );
};

export default PlayerContext;
