import axios from 'axios';
import APP_CONFIG from '../../../app.json';
import styles from './downloads.styles'
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, PermissionsAndroid, ScrollView } from 'react-native';
import { DocumentDirectoryPath, readDir , ExternalDirectoryPath, ExternalStorageDirectoryPath} from 'react-native-fs';
import Video from 'react-native-video';



function DownloadsScreen() {

    const [videos, setVideos] = useState(null)

    useEffect(() => {
        loadVideos()

    }, []);




    loadVideos = async () => {
        try {
            const files = await readDir(ExternalStorageDirectoryPath);
            const videoFiles = files.filter(file => file.isDirectory());
            setVideos(videoFiles);
        } catch (error) {
            console.error('Error loading videos:', error);
        }
    };


    return (

        <View
            style={{
                ...styles.container,
                backgroundColor: APP_CONFIG.backgroundColor,
            }}>
            <Text style={styles.pageTitle}>Downloads Screen</Text>



            <ScrollView style={{ height: '100%', width: '100%' }}>
                <Text>
                    {JSON.stringify(videos, 0, 4)}
                </Text>
            </ScrollView>

        </View>
    );



}




export default DownloadsScreen;
