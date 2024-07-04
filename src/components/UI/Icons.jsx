import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View } from 'react-native';

const Icons = ({ name, type, size, color }) => {
    switch (type) {
        case 'material':
            return <MaterialCommunityIcons name={name} size={size ?? 20} color={color} />
            break;

        case 'evil':
            return <EvilIcons name={name} size={size ?? 20} color={color} />
            break;

        case 'fontawesome':
            return <FontAwesome5 name={name} size={size ?? 20} color={color} />
            break;

        default:
            return <Feather name={name} size={size ?? 20} color={color} />
            break;
    }
}

export default Icons