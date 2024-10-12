import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import APP_CONFIG from '../../../app.json';
import Icons from './Icons';

const MyButton = (
    {
        title = '',
        style = {},
        onPress,
        icon = false,
        secondary = false,
        textStyles = {}
    }
) => {
    let buttonStyle = { ...styles.button, ...style }
    textStyles = { ...styles.text, ...textStyles }

    if (secondary) {
        buttonStyle = {
            borderColor: APP_CONFIG.primaryColor,
            ...buttonStyle,
            backgroundColor: 'transparent',
        }

        textStyles = {
            ...textStyles,
            color: APP_CONFIG.primaryColor
        }

    }

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={buttonStyle} onPress={onPress}>
            {title && <Text style={textStyles}>
                {title}
            </Text>}
            {icon &&
                <Icons name={icon} size={styles.text.fontSize} {...textStyles} />
            }
        </TouchableOpacity>
    )

}


const styles = StyleSheet.create({

    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8,
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 100,
        backgroundColor: APP_CONFIG.primaryColor,
        borderWidth: 2,
    },

    text: {
        fontSize: 14,
        fontWeight: '600',
        color: APP_CONFIG.backgroundColor,
        padding: 4
    }

});


export default MyButton