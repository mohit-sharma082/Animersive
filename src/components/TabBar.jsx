import React, { useState } from 'react';
import {
  Dimensions,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import routes from '../routes';
import Icon from 'react-native-vector-icons/Feather';

const { width, height } = Dimensions.get('window');
const tabHeight = 180 - (9 / 16) * (width / 2);
const borderRadius = tabHeight / 1.5;
import APP_CONFIG from '../../app.json';

const TabBar = props => {
  // console.log(` \n\n PROPS =>   `,{props});
  return (
    <View style={{}}>
      <View
        style={{
          width: width / 2,
          height: tabHeight,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          // borderTopColor: 'rgba(255, 255, 255, 0.2)',
          // borderTopWidth: 0.5,
          // borderLeftColor: 'rgba(255, 255, 255, 0.2)',
          // borderLeftWidth: 0.5,
          // borderRightColor: 'rgba(255, 255, 255, 0.2)',
          // borderRightWidth: 0.5,
          // borderTopLeftRadius: borderRadius,
          // borderTopRightRadius: borderRadius,
          borderColor: 'rgba(255, 255, 255, 0.4)',
          borderWidth: 0.5,
          borderRadius,
          position: 'absolute',
          bottom: 20,
          alignSelf: 'center',
        }}>
        {routes.map(({ name, icon }) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={name}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
              }}
              onPress={() => props.navigation.navigate(name)}>
              <Icon
                name={icon}
                size={25}
                color={
                  name === routes?.[props?.state?.index]?.name
                    ? APP_CONFIG.primaryColor
                    : 'white'
                }
              />
              {/* <Text style={{
                fontSize: 12
            }}>{route.name}</Text> */}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default TabBar;
