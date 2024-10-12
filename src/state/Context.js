import { createContext, useContext, useEffect, useReducer } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import scrapeAnimeEpisodes from '../scrapers/scrapeEpisodes';
const Context = createContext();

export function useGlobalContext() {
  return useContext(Context);
}

const GlobalContext = ({ children }) => {
  const initialState = {
    downloadState: {
      inProgress: { epId: null, url: null, progress: 0, name: null },
      anime: { id: null, name: null, episodes: [], poster: null, info: {} },
      queue: [],
    },
    preferences: {
      sub: true,
      dub: false,
      lang: 'english',
      quality: 'high', // lowest, low, medium, high, highest
      downloadQuality: 'high',
    },
  };

  useEffect(() => {
    try {
      console.log(`IN CONTEXT -> Getting preferences from storage`);
      AsyncStorage.getItem('preferences').then((data) => {
        if (!data) return;
        dispatch({ type: 'PREFERENCES', payload: JSON.parse(data) });
      })


    } catch (error) {
      console.log(`IN CONTEXT -> Error getting preferences from storage: `, error);
    }
  }, [])


  function reducer(state, { type, payload }) {
    switch (type) {
      case 'DOWNLOAD':
        return {
          ...state,
          downloadState: {
            ...state.downloadState,
            ...payload,
          },
        };
      case 'DOWNLOAD_PROGRESS':
        return {
          ...state,
          downloadState: {
            ...state.downloadState,
            inProgress: { ...state.downloadState.inProgress, progress: payload.progress },
          },
        };
      case 'PREFERENCES':
        return {
          ...state,
          preferences: payload,
        };
      default:
        return state;
    }
  }


  const [state, dispatch] = useReducer(reducer, initialState);

  async function downloadAnime(anime = {}) {
    try {
      console.log(`download this one -> `, JSON.stringify(anime, 0, 4));

      if (!anime?.id) {
        Alert.alert('Error', 'No anime provided');
        return;
      }
      let EPISODES = []

      try {
        const { episodes } = await scrapeAnimeEpisodes(anime.id)
        // Alert.alert('episodes', JSON.stringify(episodes, 0, 4))
        EPISODES = [...episodes]
      } catch (error) {
        console.log(`could not fetch episodes `, error);

      }
      const item = { id: anime.id, name: anime?.name, episodes: EPISODES, poster: anime.poster, };

      let obj = { anime: item }

      if (state.downloadState.anime?.id) {
        const EXISTING_QUEUE = [...state.downloadState.queue];
        // console.log(`EXISTING_QUEUE: `, JSON.stringify(EXISTING_QUEUE, null, 4));

        const existingIndex = EXISTING_QUEUE.findIndex(a => a.id === item.id);
        if (existingIndex !== -1) return false;

        EXISTING_QUEUE.push(item);
        obj = { queue: EXISTING_QUEUE }
      }

      // console.log(`Set this finally: `, obj);

      dispatch({ type: 'DOWNLOAD', payload: obj });

      return true
    } catch (error) {
      console.log(`Error downloading anime: `, error);
      return false
    }
  }


  return (
    <Context.Provider value={{ state, dispatch, downloadAnime }}>{children}</Context.Provider>
  );
};

export default GlobalContext;
