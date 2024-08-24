const { StyleSheet, StatusBar } = require("react-native");
import APP_CONFIG from '../../../app.json';

export default styles = StyleSheet.create({

    settingItem: {
        marginVertical: 10,
        // paddingVertical: 4,
        // paddingLeft: 12,
        width: '100%',
        // borderWidth: 2,
        // borderBottomColor: APP_CONFIG.primaryColor + '30',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '600',
        // fontStyle: 'italic',
        color: '#fff'
    },
    picker: {
        height: 50,
        width: 160,
    },

    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingBottom: 10,
        // paddingTop: StatusBar.currentHeight / 1.1,
        backgroundColor: '#121212'
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
    bodyHeading: {
        width: '100%',
        fontSize: 22,
        fontWeight: '600',
        paddingVertical: 10,
        marginHorizontal: 20,
        color: '#fff'
    },

    scrollContainer: {
        height: '100%',
        width: '100%',

    },

    userSection: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        minHeight: 60,
        // paddingBottom: 10,
        // paddingRight: 8,
        paddingVertical: 30,
        paddingHorizontal: 25,
        margin: 10,
        borderWidth: 2,
        // borderStyle: 'dashed',
        borderColor: '#ffffff20',
    },

    firstChar: {
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        height: 55,
        width: 55,
        borderRadius: 100,
        backgroundColor: '#212121',
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'gray'
    },

    body: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-end',
        margin: 10,
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ffffff10',
    },



})