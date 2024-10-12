import axios from 'axios';
import APP_CONFIG from '../../../app.json';
import styles from './downloads.styles'
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, PermissionsAndroid, ScrollView, ImageBackground, Alert, RefreshControl, ToastAndroid } from 'react-native';
import { DocumentDirectoryPath, readDir, ExternalDirectoryPath, ExternalStorageDirectoryPath } from 'react-native-fs';
import Video from 'react-native-video';
import { useGlobalContext } from '../../state/Context';
import { DownloadUtility } from '../../utitlities/downloadUtitliy';
import LinearGradient from 'react-native-linear-gradient';
import getAnimeAboutInfo from '../../scrapers/scrapeAnimeInfo';
import scrapeAnimeEpisodes from '../../scrapers/scrapeEpisodes';
import { extract } from '../../player/utils';
import { FlashList } from '@shopify/flash-list';
import { Linking } from 'react-native';



function DownloadsScreen() {

    const [videos, setVideos] = useState(null)
    const [refreshing, setRefreshing] = useState(null)

    useEffect(() => {
        // loadVideos()

    }, []);



    // loadVideos = async () => {
    //     try {
    //         const files = await readDir(ExternalStorageDirectoryPath);
    //         const videoFiles = files.filter(file => file.isDirectory());
    //         setVideos(videoFiles);
    //     } catch (error) {
    //         console.error('Error loading videos:', error);
    //     }
    // };

    return (

        <View
            style={{
                ...styles.container,
                backgroundColor: APP_CONFIG.backgroundColor,
            }}>
            <Text style={styles.pageTitle}>Downloads</Text>



            <ScrollView
                style={{ ...styles.body }}
                refreshControl={
                    <RefreshControl
                        colors={[APP_CONFIG.primaryColor]}
                        refreshing={refreshing}
                        onRefresh={(e) => {
                            console.log(`refresing ~~~~~~~~~~~~~~~~~~~~~~~`, refreshing);
                            setRefreshing(true)

                            setTimeout(() => {
                                setRefreshing(false)
                            }, 1000);
                        }} />
                }>
                {!refreshing && <OngoingSection />}
                {/* <Text style={{ fontFamily: 'monospace' }} >
                    {JSON.stringify(videos, 0, 4)}
                </Text> */}
            </ScrollView>

        </View>
    );



}


const OngoingSection = ({ }) => {
    const { state, dispatch } = useGlobalContext();

    const { anime, queue, inProgress } = state.downloadState

    // async function downloadAnime(m3u8Url) {
    //     await DownloadUtility.downloadM3U8File(m3u8Url, (progress) => {
    //         dispatch({ type: 'DOWNLOAD_PROGRESS', payload: { progress } });
    //     });
    // }

    useEffect(() => {
        console.log(`USE EFFECT CALLED ~~~~~~~~~~~~~~~~~~~~~~~`);

        async function downloadEpisode(episodeId) {
            console.log(`DOWNLOAD EPISODE ~~~~~~~~~~~~~~~~~~~~~~~`, episodeId);

            if (!episodeId?.length) return ToastAndroid.show(`No length in episode id : ${episodeId}`, ToastAndroid.LONG);

            // Alert.alert('ANIME ', JSON.stringify(anime.episodes, 0, 4))
            const config = await extract(episodeId, { lang: 'English' });
            if (inProgress.url?.length) {
                await DownloadUtility.downloadM3u8Playlist(inProgress.url)

                // if(Linking.canOpenURL(inProgress?.url)){
                //     Linking.openURL(inProgress?.url)
                // }
                return console.log(`returning from here cuz already url exits : `, inProgress?.url)
            }
            console.log('CONFIG ', JSON.stringify(config?.sources ?? config, 0, 4));

            const filteredItems = [...config.sources].filter(item => !!item?.isM3U8)
            const url = filteredItems?.[0]?.url ?? ''
            console.log('URL ', JSON.stringify(url, 0, 4));
            dispatch({ type: 'DOWNLOAD', payload: { inProgress: { ...inProgress, url } } });
            Alert.alert('URL ', JSON.stringify(url, 0, 4))
        }

        downloadEpisode(anime?.episodes?.[0]?.episodeId)
    }, [anime, queue])

    const renderItem = ({ item, index }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => { }}
            style={{ flex: 1, maxWidth: '50%', marginBottom: 10 }}
        >
            {/* <Text style={{ fontFamily: 'monospace' }} >
                {JSON.stringify(item, 0, 4)}
            </Text> */}
            <View>
                <ImageBackground
                    style={{
                        flex: 1,
                        width: '100%',
                        borderRadius: 4,
                        aspectRatio: 1.5,
                        padding: 2
                    }}
                    source={{ uri: item?.poster ?? 'https://raw.githubusercontent.com/mohit-sharma082/Animersive/main/src/assets/mesh-3.png' }}
                    fadeDuration={0}
                    imageStyle={{ borderRadius: 4, resizeMode: 'cover', opacity: 0.8, }}
                >
                    <LinearGradient
                        colors={[APP_CONFIG.backgroundColor + '50', 'transparent']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            ...styles.gradient,
                            paddingHorizontal: 8,
                            paddingVertical: 8
                        }}
                    >
                        <View>
                            <Text style={{  fontSize: 12, color: 'white', width: '75%', fontWeight: '600', }} numberOfLines={4}>
                                {item.name}
                            </Text>
                        </View>
                    </LinearGradient>
                </ImageBackground>
            </View>
        </TouchableOpacity>
    );

    return (
        <View>

            <ImageBackground
                style={styles.ongoing}
                source={{ uri: anime?.poster ?? 'https://raw.githubusercontent.com/mohit-sharma082/Animersive/main/src/assets/mesh-3.png' }}
                fadeDuration={0}
                imageStyle={{ borderRadius: 10, resizeMode: 'cover', opacity: 0.8, }}
            >
                <LinearGradient
                    colors={[APP_CONFIG.backgroundColor + '80', 'transparent']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradient}
                >
                    <View>
                        <Text style={{  fontSize: 14, color: 'white', width: '65%', fontWeight: '500' }} numberOfLines={4}>
                            In Progress
                        </Text>
                        <Text style={{  fontSize: 16, color: 'white', width: '65%', fontWeight: '600', marginVertical: 10 }} numberOfLines={4}>
                            {anime.name}
                        </Text>


                    </View>
                    <View>
                        <View></View>
                    </View>
                </LinearGradient>


            </ImageBackground>

            {!!queue?.length && <FlatList
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                onEndReached={(e) => { console.log(`end reached : `, e) }}
                data={queue}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                contentContainerStyle={{}}
                columnWrapperStyle={{ gap: 6 }}

            />}
            <Text style={{ fontFamily: 'monospace' }} >
                {JSON.stringify(state.downloadState, 0, 4)}
            </Text>
        </View>
    )
}




export default DownloadsScreen;
