// import { Alert, Image, Text, TouchableOpacity, View, ScrollView } from 'react-native';
// import APP_CONFIG from '../../../app.json';
// import styles from './settings.styles'
// import { useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icons from '../../components/UI/Icons';
// import MyButton from '../../components/UI/MyButton';
// import ContentCard from '../../components/ContentCard';
// import Playlist from '../../components/Playlist';
// import { Picker } from '@react-native-picker/picker';
// import { useGlobalContext } from '../../state/Context';


// function SettingsScreen() {
//   const [user, setUser] = useState({ name: 'Developer', email: 'developer@gmail.com', phone: '' });
//   const [animes, setAnimes] = useState([])
//   const { state } = useGlobalContext();
//   const [preferences, setPreferences] = useState(state.preferences ?? { lang: 'english', quality: 'medium', sub: true, dub: false, downloadQuality: 'medium' })

//   useEffect(() => {
//     AsyncStorage.getItem('user').then(value => {
//       const data = structuredClone(JSON.parse(value) ?? user)
//       setUser(data)
//     })
//     AsyncStorage.getItem('animes').then(value => {
//       const parsedValue = [...(JSON.parse(value) ?? animes)]
//       if (parsedValue?.length) {

//         // filter out animes with same id
//         const filteredValue = parsedValue.filter((item, index, self) =>
//           index === self.findIndex((t) => (
//             t.id === item.id
//           ))
//         )

//         setAnimes(filteredValue)
//       }
//     })
//   }, [])


//   const User = () => {
//     const colors = ['red', 'green', 'orange', 'purple', 'gray', 'pink', 'brown']
//     const randomColor = colors[Math.floor(Math.random() * colors.length)]
//     return (
//       <View style={styles.userSection}>
//         <View style={{ ...styles.firstChar, backgroundColor: randomColor }}>
//           <Text style={{
//             color: '#fff',
//             fontWeight: '600',
//             fontSize: 22,
//           }}>
//             {user?.name.charAt(0).toUpperCase()}
//           </Text>
//         </View>
//         <View style={{ width: '70%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
//           <Text style={{
//             width: '70%', fontSize: 20,
//             color: '#fff',
//           }}>{user?.name}</Text>
//           <Text style={{
//             width: '70%', fontSize: 12, fontWeight: '500',
//             color: '#fff',
//           }}>{user?.email}</Text>
//         </View>
//         <TouchableOpacity style={{ borderRadius: 100, borderWidth: 1.5, borderColor: randomColor, padding: 8 }} onPress={() => {
//           Alert.alert('Edit Profile', 'Do you want to edit your profile?')
//         }}>
//           <Icons name='edit-3' size={16} color={randomColor} />
//         </TouchableOpacity>
//       </View>
//     )
//   }


//   console.log(`state`, state?.preferences);

//   return (

//     <View
//       style={{
//         ...styles.container,
//         backgroundColor: APP_CONFIG.backgroundColor,
//       }}>
//       {/* <Text style={styles.pageTitle}>Settings Screen</Text> */}
//       <User />
//       <ScrollView
//         style={{ flex: 1 }}
//       >
//         <View style={{ borderWidth: 1, padding: 10, margin: 10, borderBottomColor: APP_CONFIG.primaryColor + '50', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Text style={{ fontSize: 16, fontWeight: '600', fontStyle: 'italic' }}>Mode</Text>
//           <Picker
//             mode='dropdown'
//             selectionColor={APP_CONFIG.primaryColor}
//             dropdownIconColor={APP_CONFIG.primaryColor}
//             dropdownIconRippleColor={APP_CONFIG.primaryColor}
//             selectedValue={preferences.lang}
//             style={{ height: 60, width: 200, }}
//             onValueChange={(itemValue, itemIndex) => {
//               setPreferences({ ...preferences, sub: itemValue === 'sub', dub: itemValue === 'dub' })
//             }}>
//             <Picker.Item style={{ backgroundColor: APP_CONFIG.primaryColor + '50', color: 'white' }} label="Subtitles" value="sub" />
//             <Picker.Item style={{ backgroundColor: APP_CONFIG.primaryColor + '50', color: 'white' }} label="Dubbed" value="dub" />
//           </Picker>
//         </View>

//         <View style={{ borderWidth: 1, padding: 10, margin: 10, borderBottomColor: APP_CONFIG.primaryColor + '50', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Text style={{ fontSize: 16, fontWeight: '600', fontStyle: 'italic' }}>Download Quality </Text>

//           <Picker
//             mode='dropdown'
//             selectionColor={APP_CONFIG.primaryColor}
//             dropdownIconColor={APP_CONFIG.primaryColor}
//             dropdownIconRippleColor={APP_CONFIG.primaryColor}
//             selectedValue={preferences.downloadQuality}
//             style={{ height: 60, width: 200, }}
//             onValueChange={(itemValue, itemIndex) => {
//               setPreferences({ ...preferences, downloadQuality: itemValue })
//             }}>
//             <Picker.Item style={{ backgroundColor: APP_CONFIG.primaryColor + '50', color: 'white' }} label="Highest" value="highest" />
//             <Picker.Item style={{ backgroundColor: APP_CONFIG.primaryColor + '50', color: 'white' }} label="High" value="high" />
//             <Picker.Item style={{ backgroundColor: APP_CONFIG.primaryColor + '50', color: 'white' }} label="Medium" value="medium" />
//             <Picker.Item style={{ backgroundColor: APP_CONFIG.primaryColor + '50', color: 'white' }} label="Low" value="low" />
//           </Picker>
//         </View>


//       </ScrollView>


//     </View>
//   );
// }

// export default SettingsScreen;






// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ToastAndroid } from 'react-native';
import styles from './settings.styles'
import APP_CONFIG from '../../../app.json';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Icons from '../../components/UI/Icons';
import { Picker } from '@react-native-picker/picker';
import { useGlobalContext } from '../../state/Context';
import EditProfileModal from './Edit-Modal';
import MyButton from '../../components/UI/MyButton';
import { width } from 'react-native-reanimated-player';




const SettingsScreen = () => {
  const { state } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false)


  return (
    <ScrollView
      refreshControl={<RefreshControl
        colors={[APP_CONFIG.primaryColor]}
        refreshing={refreshing}
        onRefresh={(e) => {
          setRefreshing(true)
          setTimeout(() => {
            setRefreshing(false)
          }, 100)
        }} />}
      style={{ ...styles.container, backgroundColor: APP_CONFIG.backgroundColor }}>
      {!refreshing && <User />}
      {!refreshing && <Body data={state?.preferences} />}
    </ScrollView>
  );
};



const User = ({ }) => {
  const [user, setUser] = useState({ name: 'Guest', email: 'guest@gmail.com', phone: '' });
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('user').then(value => {
      const data = { ...(JSON.parse(value) ?? user) };
      setUser(data);
    }).catch(err => {
      console.log(`Error getting user from storage - ${err}`)
      saveUser(user);
    });
  }, [modalVisible]);

  const saveUser = (user) => {
    const stringifiedUser = JSON.stringify(user);
    AsyncStorage.setItem('user', stringifiedUser).then(value => {
      const data = { ...(JSON.parse(value) ?? user) };
      setUser(data);
    });
  }
  const colors = ['red', 'green', 'orange', 'violet', 'gray', 'brown', 'teal', APP_CONFIG.primaryColor];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <View style={{
      ...styles.userSection,
      borderColor: randomColor,
      backgroundColor: randomColor + '10'
    }}>
      <View style={{ ...styles.firstChar, backgroundColor: randomColor, borderColor: '#ffffff80' }}>
        <Text style={{
          color: '#fff',
          fontWeight: '600',
          fontSize: 20,
        }}>
          {user?.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Text numberOfLines={1} style={{ fontSize: 20, color: '#fff', }}>{user?.name}</Text>
        <Text numberOfLines={1} style={{ fontSize: 12, fontStyle: 'italic', color: '#fff', opacity: 0.7 }}>{user?.email}</Text>
        <Text numberOfLines={1} style={{ fontSize: 10, fontStyle: 'italic', color: '#fff', opacity: 0.7 }}>{user?.phone}</Text>
      </View>
      <TouchableOpacity style={{ borderRadius: 100, borderWidth: 1.5, borderColor: randomColor, padding: 8 }}
        onPress={() => {
          setModalVisible(!modalVisible)
        }}>
        <Icons name='edit-3' size={16} color={randomColor} />
      </TouchableOpacity>
      <EditProfileModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        user={user}
        onSave={saveUser}
      />
    </View>
  );
};

const SettingItem = ({ label, selectedValue, onValueChange, options, enabled = true }) => {
  return (
    <View style={{ ...styles.settingItem, opacity: enabled ? 1 : 0.6 }}>
      <Text style={styles.settingLabel}> {label}</Text>
      <Picker
        enabled={enabled}
        mode='dropdown'
        selectionColor={APP_CONFIG.primaryColor}
        dropdownIconColor={APP_CONFIG.primaryColor}
        dropdownIconRippleColor={APP_CONFIG.primaryColor}
        collapsable={true}
        selectedValue={selectedValue}
        style={styles.picker}
        onValueChange={onValueChange}>
        {options.map((option, index) => (
          <Picker.Item style={{ color: 'white' }} key={index} label={option.label} value={option.value} />
        ))}
      </Picker>
    </View>
  );
};

const Body = ({ data = null }) => {
  const [preferences, setPreferences] = useState(data ??
  {
    lang: 'english',
    quality: 'medium',
    sub: true,
    dub: false,
    downloadQuality: 'medium'
  }
  )


  const handleModeChange = (itemValue) => {
    setPreferences({ ...preferences, sub: itemValue === 'sub', dub: itemValue === 'dub' });
  };

  const handleDownloadQualityChange = (itemValue) => {
    setPreferences({ ...preferences, downloadQuality: itemValue });
  };

  const handleStreamingQuality = (itemValue) => {
    setPreferences({ ...preferences, quality: itemValue });
  };

  return (
    <>
      <Text style={styles.bodyHeading}>Settings</Text>
      <View style={{ ...styles.body }}>
        <SettingItem
          label="Mode"
          selectedValue={preferences.sub ? 'sub' : 'dub'}
          onValueChange={handleModeChange}
          options={[
            { label: "Subtitles", value: "sub" },
            { label: "Dubbed", value: "dub" }
          ]}
        />
        <SettingItem
          label="Download Quality"
          selectedValue={preferences.downloadQuality}
          onValueChange={handleDownloadQualityChange}
          options={[
            { label: "Highest", value: "highest" },
            { label: "High", value: "high" },
            { label: "Medium", value: "medium" },
            { label: "Low", value: "low" }
          ]}
        />
        <SettingItem
          label="Preferred Streaming Quality"
          selectedValue={preferences.quality}
          onValueChange={handleStreamingQuality}
          options={[
            { label: "Highest", value: "highest" },
            { label: "High", value: "high" },
            { label: "Medium", value: "medium" },
            { label: "Low", value: "low" }
          ]}
        />

        <SettingItem
          label="Language"
          selectedValue={preferences.lang}
          enabled={false}
          onValueChange={handleModeChange}
          options={[
            { label: "English", value: "english" },
            { label: "Hindi", value: "hindi" }
          ]}
        />

        <MyButton title={'Save'}
          style={{
            paddingVertical: 4,
            width: '20%'
          }}
          textStyles={{ fontSize: 16 }}
          secondary={true}
          onPress={() => {
            console.log(`preferences`, preferences);
            AsyncStorage.setItem('preferences', JSON.stringify(preferences))
              .then(() => {
                console.log('Preferences saved successfully');
                ToastAndroid.show('Preferences saved successfully', ToastAndroid.LONG);
              })
          }} />
      </View>
    </>
  )
}


export default SettingsScreen;
