const { StyleSheet } = require("react-native");

export default styles = StyleSheet.create({

    container: {
        flex: 1,
        // padding: 10,
        paddingBottom: 0,
        overflow: 'scroll'
    },
    pageTitle: {
        fontSize: 20,
        padding: 10,
        paddingHorizontal: 10,
        color: '#fff',
        fontWeight: '600'
    },

    heading: {
        fontSize: 20,
        paddingTop: 10,
        paddingHorizontal: 10,
        textDecorationLine: 'underline',
        color: '#fff',
        fontWeight: '600',
    },

    carouselImgGradient: {
        height: '100%',
        width: '100%',
        zIndex: 2,
        position: 'absolute',
        top: 0,
        left: 0,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    title: {
        fontSize: 20,
        padding: 10,
        paddingHorizontal: 10,
        color: '#fff',
        fontWeight: '600',

    },
})