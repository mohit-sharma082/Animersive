import { FlashList } from '@shopify/flash-list'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import scrapeGenreAnime from '../scrapers/scrapeGenre'
import { useNavigation } from '@react-navigation/native'

const GenresList = ({ genres, onPress = null }) => {

    genres = [...new Set(genres)].sort()
    const navigation = useNavigation()


    if(genres.length === 0) return null

    return (
        <View style={{ paddingVertical: 10, backgroundColor: 'transparent' }}>
            <FlashList
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                horizontal
                data={genres}
                keyExtractor={(genre) => genre?.toString()}
                estimatedItemSize={100}
                renderItem={({ item: genre, index: i }) => {
                    // console.log(i, genre)
                    return (
                        <TouchableOpacity activeOpacity={0.8}
                            onPress={() => {
                                if (onPress != null) {
                                    onPress(genre)
                                } else {
                                    navigation.navigate('Genre', { genre })
                                }
                            }}
                            style={{}}>
                            <Text
                                key={i}
                                style={{
                                    borderColor: 'gray',
                                    borderWidth: 1,
                                    paddingHorizontal: 16,
                                    paddingVertical: 4,
                                    borderRadius: 100,
                                    fontSize: 12,
                                    color: 'white',
                                    marginRight: 10
                                }}>
                                {genre}
                            </Text>
                        </TouchableOpacity>
                    );
                }}

            />
        </View>
    )
}

// const getGenresAnimes = async (genre = '') => {
//     try {
//         if (!genre?.length) {
//             return
//         }
//         const res = await scrapeGenreAnime(genre?.trim())
//         console.log(`res : `, JSON.stringify(res, 0, 4));
//         return res

//     } catch (error) {
//         console.log('Error in getGenresAnimes : ', error);
//     }
// }

export default GenresList