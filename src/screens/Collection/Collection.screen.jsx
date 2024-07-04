import React, { useEffect, useState } from 'react'
import STYLES from './collection.styles';
import APP_CONFIG from '../../../app.json'
import { RefreshControl, ScrollView, Text, ToastAndroid, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useQueryClient } from '@tanstack/react-query';
import VerticalList from '../../components/VerticalList';
import Grid from '../../components/Grid';
import { useGlobalContext } from '../../state/Context';
import { ExplorationUtility } from '../../utitlities/explorationUtility';



const CollectionScreen = () => {
    const [animes, setAnimes] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const queryClient = useQueryClient()
    const { state } = useGlobalContext();
    const preferences = state.preferences ?? {
        sub: true, dub: false, lang: 'english',
        quality: 'high', downloadQuality: 'high',
    }

    let heading = `Continue Exploring`

    const loadAnimes = () => {
        console.log(`HERE => `, state.downloadState);

        ExplorationUtility.getAnimes(preferences?.sub ?? true)
            .then((value) => {
                // console.log(`Animes loaded: `, value);
                setAnimes(value)
                return value
            })
            .then((value) => {
                if (!!value.length) return console.log(`Animes found in continue exploring`, animes.length);
                const { trendingAnimes } = queryClient.getQueryData(['home'])
                heading = `Explore Trending Animes...`
                setAnimes(trendingAnimes)

            })

    }

    useEffect(() => {
        loadAnimes()
        return () => {
            console.log('CollectionScreen Unmounted');
        }

    }, [])


    return (

        <View
            style={{
                ...STYLES.container,
                backgroundColor: APP_CONFIG.backgroundColor,
            }}>

            <Text style={STYLES.pageTitle}>{heading}</Text>
            <ScrollView
                vertical
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        colors={[APP_CONFIG.primaryColor]}
                        refreshing={refreshing} onRefresh={(e) => {
                            loadAnimes()
                        }} />
                }>
                {/* <Grid animes={animes} /> */}

                {!!animes?.length && <VerticalList animes={animes} />}
                {/* <Text style={{ color: '#fff' }}>
                    {JSON.stringify(animes, 0, 4)}
                </Text> */}
            </ScrollView>
        </View>
    );
}

export default CollectionScreen