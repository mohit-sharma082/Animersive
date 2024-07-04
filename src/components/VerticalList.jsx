import React, { useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MyButton from './UI/MyButton';
import APP_CONFIG from '../../app.json';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { FlashList, AnimatedFlashList } from '@shopify/flash-list';


const SCREEN_HEIGHT = Dimensions.get('window').height;
const ITEM_HEIGHT = SCREEN_HEIGHT / 7


const visibleItemCount = 3; // Number of items visible at a time

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    itemContainer: {
        height: ITEM_HEIGHT,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        margin: 5,

    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});



const VerticalList = ({ animes = [] }) => {
    const ITEM_MIN_HEIGHT = (Dimensions.get('window').height / 5) ?? 150
    const navigation = useNavigation()

    return (
        <FlashList
            // style={{ width: '100%', minHeight: Dimensions.get('window').height / 2, }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            vertical
            data={animes}
            keyExtractor={(anime) => anime.id.toString() + anime.title}
            renderItem={({ item: anime, index: i }) => (
                <TouchableOpacity
                    onPress={() => navigation.navigate("Anime", { id: anime.id })}
                    style={{
                        minHeight: ITEM_MIN_HEIGHT,
                        backgroundColor: APP_CONFIG.primaryColor + '10',
                        display: 'flex', flexDirection: 'row', alignItems: 'center',
                        borderRadius: 8
                    }}>
                    {/* IMAGE SECTION  */}
                    <View style={{ margin: 5, minHeight: ITEM_MIN_HEIGHT, minWidth: ITEM_MIN_HEIGHT * 0.7,backgroundColor: APP_CONFIG.primaryColor + '50' }}>
                        {!!anime.poster?.length &&
                            <Image source={{ uri: anime.poster }} style={{ height: ITEM_MIN_HEIGHT, minWidth: ITEM_MIN_HEIGHT * 0.7, borderRadius: 5 }} />
                        }
                    </View>

                    {/* DETAILS SECCTION */}
                    <View style={{
                        flex: 1,
                        minHeight: ITEM_MIN_HEIGHT,

                    }} >
                        <Text numberOfLines={3} textBreakStrategy='highQuality' style={{ fontWeight: '600', color: '#fff', fontSize: 16, paddingLeft: 8 }}>
                            {anime?.name}
                        </Text>
                        <Text numberOfLines={3} textBreakStrategy='highQuality' style={{ fontSize: 12, paddingHorizontal: 8, fontStyle: 'italic' }}>
                            {anime?.description}
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {
                                Object.values(anime?.info ?? {})
                                    ?.filter((item) => item != '-' && item != ' - ')
                                    .map((item, index) => {
                                        return (
                                            <View
                                                key={index}
                                                style={{
                                                    fontSize: 10,
                                                    backgroundColor: APP_CONFIG.primaryColor + '90',
                                                    borderColor: APP_CONFIG.primaryColor,
                                                    borderWidth: 1,
                                                    margin: 3,
                                                    padding: 4,
                                                    paddingHorizontal: 8,
                                                    borderRadius: 5,
                                                    color: '#fff',
                                                }}>

                                                <Text
                                                    style={{
                                                        fontSize: 10,
                                                        borderRadius: 5, color: '#fff',
                                                        fontStyle: 'italic'
                                                    }}
                                                    key={index}>
                                                    {item
                                                        ?.toString()
                                                        ?.replace('?', '')
                                                        ?.replace('- -', '- ?')
                                                    }
                                                </Text>
                                            </View>
                                        )
                                    })
                            }
                        </View>
                    </View>

                </TouchableOpacity>
            )}
            estimatedItemSize={ITEM_MIN_HEIGHT * 0.75}
            ItemSeparatorComponent={() => <View style={{ height: 1, margin: 6, backgroundColor: APP_CONFIG.primaryColor + '60' }} />}
        />
    )

}


const SwitchList = ({ animes = [] }) => {

    const navigation = useNavigation()
    const scrollViewRef = useRef(null);
    const [focusedItemIndex, setFocusedItemIndex] = useState(1);

    const scrollToNext = () => {
        const nextIndex = focusedItemIndex + 1;
        if (nextIndex < animes.length) {
            setFocusedItemIndex(nextIndex);
            scrollViewRef.current?.scrollTo({ x: 0, y: nextIndex * ITEM_HEIGHT, animated: true, duration: 500 });
        }
    };

    const scrollToPrevious = () => {
        const prevIndex = focusedItemIndex - 1;
        if (prevIndex >= 0) {
            setFocusedItemIndex(prevIndex);
            scrollViewRef.current?.scrollTo({ x: 0, y: prevIndex * ITEM_HEIGHT, animated: true, duration: 500 });
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                style={{ height: ITEM_HEIGHT * (visibleItemCount + 1) }}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false} // Disable gesture scrolling
            >
                {animes.map((item, index) => (
                    <View key={item.id} style={
                        [styles.itemContainer,
                        index >= focusedItemIndex && index < focusedItemIndex + visibleItemCount ? { backgroundColor: 'transparent' } : null,
                        index == focusedItemIndex ? { height: ITEM_HEIGHT + 50, backgroundColor: APP_CONFIG.primaryColor + '20' } : null
                        ]
                    }
                    >
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Anime", { id: item.id })}
                        >
                            <View style={{
                                height: '98%',
                                aspectRatio: 0.8,
                                borderRadius: 2,
                                position: 'relative'
                            }}>
                                <Image source={{ uri: item.poster }} style={{ flex: 1 }} />

                            </View>
                        </TouchableOpacity>

                        <View style={{
                            flex: 1, height: '90%', paddingHorizontal: 15,
                            //  borderWidth: 1, borderColor: 'orange',
                        }}>
                            <Text style={{ overflow: 'hidden', textAlign: 'right' }}
                                numberOfLines={3}
                            >
                                {item.name}{item.name}
                            </Text>
                        </View>

                    </View>
                ))}
            </ScrollView>
            <View style={styles.buttonContainer}>
                <MyButton title={'Previous'} onPress={scrollToPrevious} />
                <MyButton title={'Next'} onPress={scrollToNext} />
            </View>
        </View>
    );
}

export default VerticalList;
