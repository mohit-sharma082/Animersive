const { StyleSheet } = require("react-native");

export default styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 10,
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
        backgroundColor: '#FF967190',
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
        right: 8,
        top: 5
    }

})