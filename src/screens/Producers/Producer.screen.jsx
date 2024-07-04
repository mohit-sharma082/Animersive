import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator, ToastAndroid } from 'react-native'
import STYLES from './producer.styles'
import scrapeGenreAnime from '../../scrapers/scrapeGenre'
import Grid from '../../components/Grid'
import APP_CONFIG from '../../../app.json'
import GenresList from '../../components/GenresList'
import { useNavigation } from '@react-navigation/native'
import scrapeProducerAnimes from '../../scrapers/scrapeAnimeProducer'

const getProducersAnime = async (producer = '', page = 1) => {
    try {
        if (!producer?.length) {
            return
        }
        const res = await scrapeProducerAnimes(producer?.trim(), page)
        console.log(`res producers : `, res?.animes, res?.animes?.length, Object.keys(res));
        return res

    } catch (error) {
        console.log('Error in getProducersAnime : ', error);
    }
}

const ProducerScreen = ({ route }) => {
    const [data, setData] = useState({
        producerName: route?.params?.producer ?? '',
        animes: [],
        top10Animes: {
            today: [],
            week: [],
            month: [],
        },
        topAiringAnimes: [],
        totalPages: 1,
        hasNextPage: false,
        currentPage: 1,

    })

    const navigation = useNavigation()

    useEffect(() => {
        if (!route?.params?.producer?.length) {
            ToastAndroid.show(`No producer found to search :  ${route?.params?.producer}`, ToastAndroid.SHORT)
            return navigation.canGoBack() ? navigation.goBack() : navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
        }
        getProducersAnime(route?.params?.producer)
            .then(res => setData(res))
            .catch(err => console.log('Error in useEffect : ', err))

    }, [])

    return (
        <View
            style={{
                ...STYLES.container,
                backgroundColor: APP_CONFIG.backgroundColor,
            }}>


            <Text style={STYLES.pageTitle}>{data?.producerName} ~ {!!data?.animes?.length ? `(${data?.animes?.length})` : ''}</Text>

            {!data?.animes?.length ?
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={60} color={APP_CONFIG.primaryColor} />
                    <Text style={{ color: APP_CONFIG.primaryColor }}>Searching for {data?.producerName}...</Text>
                </View>
                :
                <Grid
                    animes={data?.animes} columns={3}
                    bottomSpacing={120}
                    showLoadingMoreIndicator={data?.hasNextPage}
                    onEndReached={() => {
                        if (data?.hasNextPage) {
                            getProducersAnime(data?.producerName, data?.currentPage + 1)
                                .then(res => {
                                    setData({
                                        ...res,
                                        animes: [...data?.animes, ...res?.animes],
                                    })
                                })
                        }
                    }}
                />
            }
        </View>
    )
}

export default ProducerScreen