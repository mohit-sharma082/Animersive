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
        fontWeight: '600'
    },


})