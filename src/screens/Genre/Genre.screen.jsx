import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator, ToastAndroid } from 'react-native'
import STYLES from './genre.styles'
import scrapeGenreAnime from '../../scrapers/scrapeGenre'
import Grid from '../../components/Grid'
import APP_CONFIG from '../../../app.json'
import GenresList from '../../components/GenresList'
import { useNavigation } from '@react-navigation/native'

const getGenresAnimes = async (genre = '', page = 1) => {
    try {
        if (!genre?.length) {
            return
        }
        const res = await scrapeGenreAnime(genre?.trim(), page)
        console.log(`res : `, res?.animes?.[0].name, res?.animes?.length, Object.keys(res));
        return res

    } catch (error) {
        console.log('Error in getGenresAnimes : ', error);
    }
}

const GenreScreen = ({ route }) => {
    const [genre, setGenre] = useState(route?.params?.genre ?? '')
    const defaultData = {
        genre,
        animes: [],
        genres: [],
        topAiringAnimes: [],
        totalPages: 1,
        hasNextPage: false,
        currentPage: 1,
    }
    const [data, setData] = useState({ ...defaultData, genre: route?.params?.genre ?? '' })

    const navigation = useNavigation()

    useEffect(() => {
        if (!route?.params?.genre?.length) {
            ToastAndroid.show(`No genre found to search :  ${route?.params?.genre}`, ToastAndroid.SHORT)
            return navigation.canGoBack() ? navigation.goBack() : navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
        }
        setData(defaultData)
        getGenresAnimes(genre)
            .then(res => setData(res))
            .catch(err => console.log('Error in useEffect : ', err))

    }, [genre])

    return (
        <View
            style={{
                ...STYLES.container,
                backgroundColor: APP_CONFIG.backgroundColor,
            }}>

            <GenresList genres={data?.genres} onPress={(genre) => { setGenre(genre) }} />

            <Text style={STYLES.pageTitle}>{genre} {!!data?.animes?.length ? `(${data?.animes?.length})` : ''}</Text>

            {/* <Text style={{  color: '#fff' }}>
                {data?.hasNextPage && `PAGES -  ${data.totalPages} | HAS NEXT PAGE - ${data.hasNextPage} | CURRENT PAGE - ${data.currentPage}`}
            </Text> */}
            {!data?.animes?.length ?
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={60} color={APP_CONFIG.primaryColor} />
                </View>
                :
                <Grid
                    animes={data?.animes} columns={3}
                    bottomSpacing={120}
                    onPress={(genre) => { setGenre(genre) }}
                    showLoadingMoreIndicator={data?.hasNextPage}
                    onEndReached={() => {
                        if (data?.hasNextPage) {
                            getGenresAnimes(genre, data?.currentPage + 1)
                                .then(res => {
                                    setData({
                                        ...res,
                                        // currentPage: data?.currentPage + 1,
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

export default GenreScreen