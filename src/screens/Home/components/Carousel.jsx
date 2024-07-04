import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions, Image } from 'react-native';
import APP_CONFIG from '../../../../app.json';




const Carousel = ({ data, carouselTitle, width }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleScroll = (event) => {
        const { contentOffset } = event.nativeEvent;
        const index = Math.round(contentOffset.x / Dimensions.get('window').width);
        setCurrentIndex(index);
    };

    return (
        <View style={styles.container}>
            {carouselTitle && <Text style={styles.carouselTitle}>{carouselTitle}</Text>}
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={200}
            >
                {data.map((item, index) => (
                    <View key={index} style={styles.item}>
                        <Image source={{ uri: item.poster }} style={styles.img} />
                        <Text numberOfLines={1} style={styles.text}>{item?.name}</Text>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.pagination}>
                {data.map((_, index) => (
                    <Text
                        key={index}
                        style={[
                            styles.paginationDot,
                            {
                                opacity: index === currentIndex ? 1 : 0.5,
                                color: index === currentIndex ? APP_CONFIG.primaryColor : '#fff'
                            },
                        ]}
                    >
                        &bull;
                    </Text>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    carouselTitle: {
        fontWeight: '600',
        fontSize: 24,
        paddingHorizontal: 20,
        paddingVertical: 16,
        color: '#fff',
        width: '100%'
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: APP_CONFIG.secondaryColor,
        borderRadius: 8
    },
    item: {
        width: Dimensions.get('window').width - 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    img: {
        width: Dimensions.get('window').width - 50,
        height: Dimensions.get('window').width / 2,
        borderRadius: 5
    },
    text: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        paddingVertical: 5,
    },
    pagination: {
        flexDirection: 'row',
    },
    paginationDot: {
        marginHorizontal: 5,
        fontSize: 24,
    },
});

export default Carousel;
