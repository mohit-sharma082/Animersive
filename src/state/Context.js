import { createContext, useContext, useEffect, useReducer } from 'react';
import { Alert } from 'react-native';
import { DownloadUtility } from '../utitlities/downloadUtitliy';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Context = createContext();

export function useGlobalContext() {
  return useContext(Context);
}

const GlobalContext = ({ children }) => {
  const initialState = {
    downloadState: {
      inProgress: { epId: null, url: null, progress: 0, name: null },
      anime: { id: null, title: null, episodes: [], poster: null },
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
            anime: { id: payload.anime.id, title: payload.anime.title, episodes: payload.anime.episodes },
            inProgress: { url: null, progress: 0, name: null },
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

  async function downloadAnime(anime) {
    try {
      if (!anime) return Alert.alert('Error', 'No anime provided');
      dispatch({ type: 'DOWNLOAD', payload: { anime } });

      const m3u8Url = anime.m3u8Url; // Ensure your anime object has this property

      await DownloadUtility.download(m3u8Url, (progress) => {
        dispatch({ type: 'DOWNLOAD_PROGRESS', payload: { progress } });
      });
    } catch (error) {
      console.log(`Error downloading anime: `, error);
    }
  }


  return (
    <Context.Provider value={{ state, dispatch, downloadAnime }}>{children}</Context.Provider>
  );
};

export default GlobalContext;
