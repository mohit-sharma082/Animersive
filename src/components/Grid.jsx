
import React, { useEffect } from 'react';
import { FlatList, TouchableOpacity, Image, Text, View, StyleSheet, Dimensions, ToastAndroid, ActivityIndicator } from 'react-native';
import APP_CONFIG from '../../app.json'
import { useNavigation } from '@react-navigation/native';

const Grid = (
    {
        animes = Array.from({ length: 10 }, (_, i) => i),
        columns = 2,
        bottomSpacing = false,
        scrollToTop = false,
        showLoadingMoreIndicator = false,
        customStyle = null,
        onEndReached = () => { }
    }
) => {
    const navigation = useNavigation();
    const renderItem = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => { navigation.navigate('Anime', { id: item.id }) }}
            style={[styles.item, {
                flex: 1, maxWidth: Dimensions.get('screen').width / columns,
            }]}
        >
            {item?.poster
                ? <Image source={{ uri: item.poster }} style={styles.image} />
                : <View style={styles.image}></View>
            }

            {item?.name && <Text style={styles.text} numberOfLines={3}>{item.name}</Text>}
        </TouchableOpacity>
    );

    return (
        <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            scrollsToTop={scrollToTop}
            onEndReached={onEndReached}
            data={animes ?? Array.from({ length: 10 }, (_, i) => i)}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={columns}
            contentContainerStyle={{ ...styles.container, ...customStyle }}
            columnWrapperStyle={{}}
            ListFooterComponent={
            <View style={{ height: bottomSpacing ?? 0 }}>
                {showLoadingMoreIndicator && <ActivityIndicator size={30} color={APP_CONFIG.primaryColor} />}
            </View>}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        // padding: 8,
        // backgroundColor: 'pink'
    },
    item: {
        marginBottom: 12,
        padding: 4,
    },
    image: {
        width: '100%',
        aspectRatio: 11 / 16,
        backgroundColor: APP_CONFIG.primaryColor + '50',
        borderRadius: 4,
    },
    text: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
        marginTop: 5,
        minHeight: 30,

    },
});

export default Grid;
