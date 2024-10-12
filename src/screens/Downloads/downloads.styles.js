const { StyleSheet, StatusBar } = require("react-native");

export default styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 10,
        // paddingTop: StatusBar.currentHeight,
    },
    pageTitle: {
        fontSize: 20,
        padding: 10,
        paddingHorizontal: 10,
        color: '#fff',
        fontWeight: '600',
        // borderColor: 'orange',
        // borderWidth: 1
    },

    heading: {
        fontSize: 20,
        paddingTop: 10,
        paddingHorizontal: 10,
        textDecorationLine: 'underline',
        color: '#fff',
        fontWeight: '600',
    },
    body: {
        flex: 1,
        padding: 10,
        // borderColor: 'gray',
        // borderWidth: 1
    },

    ongoing: {
        flex: 1,
        width: '100%',
        marginBottom: 10,
        // borderColor: 'orange',
        // borderWidth: 1,
        borderRadius: 10,
        aspectRatio: 2,
        minHeight: 150,
    },

    gradient: {
        height: '100%',
        width: '100%',
        zIndex: 2,
        position: 'absolute',
        top: 0,
        left: 0,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10
    }

})