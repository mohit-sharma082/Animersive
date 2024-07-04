import React from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import APP_CONFIG from '../../../app.json';
import styles from './content.styles';
import { useQuery } from '@tanstack/react-query';
import getAnimeAboutInfo from '../../scrapers/scrapeAnimeInfo';

const ContentScreen = () => {

    const { data } = useQuery({
        queryFn: () => getAnimeAboutInfo(),
        queryKey: ['details'],
        placeholderData: []
    })

    // const { anime, seasons, mostPopularAnimes, relatedAnimes, recommendedAnimes, } = data


    return (
        <View
            style={{
                ...styles.container,
                backgroundColor: APP_CONFIG.backgroundColor,
            }}>
            <Text style={styles.pageTitle}>Details </Text>
            <ScrollView
                style={{
                    ...styles.scrollContainer,
                    backgroundColor: APP_CONFIG.backgroundColor,
                }}>


                {data?.anime && renderAnimeDetails(data.anime)}

                <Text>
                    {JSON.stringify(data, 0, 4)}
                </Text>

            </ScrollView>
        </View>
    );
}

// anime: {
//     info: {
//         id: null,
//         name: null,
//         poster: null,
//         description: null,
//         stats: {
//             rating: null,
//             quality: null,
//             episodes: {
//                 sub: null,
//                 dub: null,
//             },
//             type: null,
//             duration: null,
//         },
//     },
//     moreInfo: {},
// },

const renderAnimeDetails = (anime) => {
    const { info, moreInfo } = anime;

    return (
        <View style={{ flexDirection: 'row' }}>

            <Image source={{ uri: info.poster }}
                style={{
                    width: '45%',
                    aspectRatio: 3 / 4,
                    borderRadius: 4
                }}
            />

            <View style={{ padding: 10, gap: 10, width: '55%' }}>
                <Text style={{ fontSize: 24, color: 'white' }}>
                    {info.name}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>

                    {moreInfo.genres.length && moreInfo.genres.map((genre, i) => {
                        return <Text key={i} style={{
                            backgroundColor: APP_CONFIG.primaryColor,
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 100,
                            fontSize: 10,
                            fontWeight: '600',
                            color: APP_CONFIG.backgroundColor
                        }}>{genre}</Text>
                    })}

                </View>
                <Text style={{ fontSize: 12, color: '#989898' }} numberOfLines={6}>
                    {info.description}
                </Text>
            </View>

        </View>
    )
}

export default ContentScreen