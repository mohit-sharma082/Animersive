import React from 'react'
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import APP_CONFIG from '../../app.json'
import { usePlayer } from '../player/Context';
import { useNavigation } from '@react-navigation/native';

const ContentCard = ({ anime, height = 160, number = false }) => {
    const { loadAnime } = usePlayer()
    const navigation = useNavigation()
    if (!anime) return <ActivityIndicator size={'large'} />

    const { poster, name, id, rating } = anime;

    return (
        <TouchableOpacity
            activeOpacity={0.9}

            style={styles.cardContainer}
            // onPress={() => { alert(`Pressed card : ${JSON.stringify(anime, 0, 8)}`) }}
            onPress={() => navigation.navigate("Anime", { id })}
        >
            {number && <Text style={styles.number}>{number}</Text>}
            <View style={{ marginHorizontal: 10 }}>
                <View style={{
                    height,
                    width: height * (3 / 4),
                    borderRadius: 2,
                    position: 'relative'
                }}>
                    <Image
                        source={{ uri: poster }} style={{ flex: 1, borderRadius: 4, backgroundColor: APP_CONFIG.primaryColor + '50' }}
                    />
                    {rating &&
                        <Text style={styles.ratingBadge}>{rating}</Text>}
                </View>
                <Text numberOfLines={2} style={styles.name}>{name}</Text>
            </View>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({

    cardContainer: {
        display: 'flex',
        flexDirection: 'row',
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
    },
    ratingBadge: {
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: APP_CONFIG.primaryColor,
        color: 'white',
        fontWeight: '500',
        fontSize: 10,
        padding: 2,
        paddingLeft: 8,
        paddingBottom: 8,
        borderBottomLeftRadius: 100
    }

})


export default ContentCard