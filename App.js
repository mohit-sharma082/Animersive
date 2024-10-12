import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomeScreen from './src/screens/Home/Home.screen';
import SearchScreen from './src/screens/Search/Search.screen';
import SettingsScreen from './src/screens/Settings/Settings.screen';
import GlobalContext from './src/state/Context';
import Icons from './src/components/UI/Icons';
import APP_CONFIG from './app.json';
import Player from './src/components/player/Player';
import PlayerContainer from './src/containers/PlayerContainer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PlayerContext from './src/player/Context';
import AnimeScreen from './src/screens/Anime/AnimeScreen';
import TabBar from './src/components/TabBar';
import { PermissionsAndroid } from 'react-native';
import DownloadsScreen from './src/screens/Downloads/Downloads.screen';
import { useEffect } from 'react';
global.Buffer = global.Buffer || require('buffer').Buffer;

import { LogBox } from 'react-native';
import SplashScreen from 'react-native-splash-screen'
import CollectionScreen from './src/screens/Collection/Collection.screen';
import { DownloadUtility } from './src/utitlities/downloadUtitliy';
import GenreScreen from './src/screens/Genre/Genre.screen';
import ProducerScreen from './src/screens/Producers/Producer.screen';

// Ignore log notification by message
LogBox.ignoreLogs(['Warning: ...']);

//Ignore all log notifications
LogBox.ignoreAllLogs();
const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

function App() {
  // return <Player />;

  useEffect(() => {
    SplashScreen.hide()
  }, [])

  return (
    <QueryClientProvider client={queryClient} style={{
      backgroundColor: APP_CONFIG.backgroundColor,
    }}>
      {/* <StatusBar translucent backgroundColor="transparent" /> */}
      <GestureHandlerRootView
        style={{
          flex: 1,
          backgroundColor: APP_CONFIG.backgroundColor,
        }}>
        <PlayerContext>
          <GlobalContext>
            <NavigationContainer>
              <Tab.Navigator
                backBehavior="history"
                screenOptions={{
                  headerShown: false,
                  tabBarStyle: { backgroundColor: 'black' },
                  tabBarActiveTintColor: APP_CONFIG.primaryColor,
                  tabBarInactiveBackgroundColor: '#121212',
                  tabBarHideOnKeyboard: true,
                }}
                tabBar={TabBar}
                sceneContainerStyle={{
                  backgroundColor: 'black',
                }}>
                <Tab.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{
                    freezeOnBlur: true,
                    tabBarIcon: ({ color }) => (
                      <Icons name={'home'} size={20} color={color} />
                    ),
                  }}
                />
                <Tab.Screen
                  name="Search"
                  component={SearchScreen}
                  options={{
                    freezeOnBlur: true,
                    tabBarIcon: ({ color }) => (
                      <Icons name={'search'} size={20} color={color} />
                    ),
                  }}
                />
                <Tab.Screen
                  name="Downloads"
                  component={DownloadsScreen}
                  options={{
                    freezeOnBlur: true,
                    tabBarIcon: ({ color }) => (
                      <Icons name={'downloads'} size={20} color={color} />
                    ),
                  }}
                />
                <Tab.Screen
                  name="Collection"
                  component={CollectionScreen}
                  options={{
                    freezeOnBlur: true,
                    tabBarIcon: ({ color }) => (
                      <Icons name={'server'} size={20} color={color} />
                    ),
                  }}
                />
                <Tab.Screen
                  name="Settings"
                  component={SettingsScreen}
                  options={{
                    freezeOnBlur: true,
                    tabBarIcon: ({ color }) => (
                      <Icons name={'settings'} size={20} color={color} />
                    ),
                  }}
                />
                <Tab.Screen
                  name="Anime"
                  component={AnimeScreen}
                  options={{
                    freezeOnBlur: true,
                    tabBarIcon: ({ color }) => (
                      <Icons name={'play'} size={20} color={color} />
                    ),
                    unmountOnBlur: true,
                  }}
                />
                <Tab.Screen
                  name="Genre"
                  component={GenreScreen}
                  options={{
                    freezeOnBlur: true,
                    tabBarIcon: ({ color }) => (
                      <Icons name={'book-open'} size={20} color={color} />
                    ),
                    unmountOnBlur: true,
                  }}
                />
                <Tab.Screen
                  name="Producer"
                  component={ProducerScreen}
                  options={{
                    freezeOnBlur: true,
                    tabBarIcon: ({ color }) => (
                      <Icons name={'code'} size={20} color={color} />
                    ),
                    unmountOnBlur: true,
                  }}
                />
              </Tab.Navigator>
            </NavigationContainer>
          </GlobalContext>
        </PlayerContext>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );


  async function requestStoragePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        {
          title: 'Permission Required',
          message: 'This app needs access to your storage to display videos.',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // loadVideos();
      } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
        console.log('Permission denied');
      } else {
        console.warn('Permission request cancelled or other error:', granted);
      }
    } catch (err) {
      if (err.code === PermissionsAndroid.errors.USER_REFUSED) {
        console.warn('User refused permission');
      } else {
        console.error(err);
      }
    }
  }
}

export default App;
