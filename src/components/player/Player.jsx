import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {TouchableOpacity} from 'react-native';

const Player = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Anime');
      }}
      style={{
        backgroundColor: 'red',
        width: 100,
        height: 100,
      }}></TouchableOpacity>
  );
};

export default Player;
