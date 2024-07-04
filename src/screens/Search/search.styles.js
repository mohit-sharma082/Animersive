const { StyleSheet, StatusBar } = require("react-native");

export default styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 6,
        // paddingTop: StatusBar.currentHeight,
    },
    pageTitle: {
        fontSize: 20,
        padding: 10,
        paddingHorizontal: 10,
        color: '#fff',
        fontWeight: '600'
    },

    scrollContainer: {
        flex: 1,
    },

    inputSection: {
        position: 'relative',
        marginBottom: 30
    },

    input: {
        width: '100%',
        padding: 14,
        paddingHorizontal: 24,
        paddingRight: 80,
        fontSize: 16,
        backgroundColor: '#7E6AAD90',
        borderRadius: 80,
        fontWeight: '500'
    },

    actionButton: {
        backgroundColor: 'gray',
        height: 45,
        width: 45,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 6,
        top: 5
    }

})