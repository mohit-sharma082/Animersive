import React, { useRef, useState } from 'react'
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import APP_CONFIG from '../../app.json'
import { FlashList } from '@shopify/flash-list';
import ContentCard from './ContentCard';
import MyButton from './UI/MyButton';

export default Playlist = ({ data, title, cardHeight = 160, numbered = false }) => {
    const animes = data ?? []
    if (title == 'Most Popular Animes') console.log(`=> animes`, animes.length, animes[0]);
    return (
        <>
            {title && <Text style={styles.title}>{title}</Text>}
            {/* {!animes?.length && <ActivityIndicator size={'small'} style={{ marginHorizontal: 'auto', padding: 20 }} />} */}
            {!animes?.length
                ?
                <SkeletonPlaylist height={cardHeight}
                    numbered={numbered}
                />
                : (
                    <FlashList
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        horizontal
                        data={animes}
                        keyExtractor={(anime) => anime.id.toString() + anime.title}
                        renderItem={({ item: anime, index: i }) => (
                            <ContentCard
                                anime={anime}
                                height={cardHeight}
                                number={numbered ? i + 1 : null}
                            />
                        )}
                        estimatedItemSize={cardHeight * 0.75}
                    />
                )}
        </>
    )
}

const SkeletonPlaylist = ({ height = 160, numbered = false }) => {
    const animes = Array.from({ length: 10 }, (_, i) => ({ id: i, title: 'Loading...' }))
    return (
        <FlashList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            horizontal
            data={animes}
            keyExtractor={(anime) => anime.id.toString() + anime.title}
            renderItem={({ item: anime, index: i }) => (
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    {numbered && <Text style={{
                        color: APP_CONFIG.primaryColor,
                        fontWeight: '800',
                        fontSize: 30,
                        textShadowOffset: { width: 2, height: 2 },
                        textShadowRadius: 2,
                        textShadowColor: '#000',
                    }}>{i + 1}</Text>}

                    <View style={{ marginHorizontal: 10 }}>
                        <View style={{
                            height,
                            width: height * (3 / 4),
                            borderRadius: 2,
                            position: 'relative',
                            backgroundColor: APP_CONFIG.primaryColor + '50'
                        }}>
                        </View>
                    </View>
                </View>
            )}
            estimatedItemSize={height * 0.75}
        />
    )
}



const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        padding: 10,
        paddingHorizontal: 10,
        color: '#fff',
        fontWeight: '600'
    },
    container: {
        padding: 10,
    },
    cardContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    verticalCard: {
        height: 160,
        width: 120,
        borderRadius: 2,
        position: 'relative'
    },
    name: {
        color: '#fff',
        fontSize: 10,
        width: 100,
        height: 30
    },
    number: {
        color: APP_CONFIG.primaryColor,
        fontWeight: '800',
        fontSize: 30,
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 2,
        textShadowColor: '#000',
    }

})
