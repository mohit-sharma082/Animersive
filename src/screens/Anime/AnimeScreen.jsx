import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import APP_CONFIG from '../../../app.json';
import getAnimeAboutInfo from '../../scrapers/scrapeAnimeInfo';
const { width, height } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { usePlayer } from '../../player/Context';
import { getPalette } from 'react-native-palette-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icons from '../../components/UI/Icons';
import { ExplorationUtility } from '../../utitlities/explorationUtility';
import { useNavigation } from '@react-navigation/native';

const Description = ({ description, colors }) => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  if (!description) return null;

  const displayedText = showFullText
    ? description
    : `${description?.slice(0, 200)}...`;

  return (
    <View
      style={{
        width,
        paddingHorizontal: 20,
        paddingVertical: 10,
      }}>
      <Text style={{ color: 'white' }}>
        {displayedText}
        <Text
          style={{ color: colors?.vibrant, fontWeight: 'bold' }}
          onPress={toggleText}>
          {showFullText ? ' Less' : ' More'}
        </Text>
      </Text>
    </View>
  );
};

const Genres = ({ genres, colors }) => {
  const navigation = useNavigation();

  return (
    <>
      <Text
        style={{
          paddingLeft: 20,
          color: 'white',
          paddingVertical: 10,
          fontSize: 15,
          fontWeight: 'bold',
        }}>
        Genres
      </Text>
      <FlatList
        horizontal={true}
        data={genres}
        keyExtractor={item => item}
        style={{
          width: width,
          gap: 10,
        }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 10,
          paddingHorizontal: 20,
        }}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('Genre', { genre: item })
              }}>
              <Text
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: colors?.darkVibrant,
                  padding: 7,
                  paddingHorizontal: 14,
                  fontSize: 12,
                  borderRadius: 16,
                  fontWeight: 'bold',
                }}>
                {item}
              </Text>
            </TouchableOpacity>

          );
        }}
      />
    </>
  );
};

const Producers = ({ producers, colors }) => {
  const navigation = useNavigation();
  return (
    <>
      <Text
        style={{
          paddingLeft: 20,
          color: 'white',
          paddingVertical: 10,
          fontSize: 15,
          fontWeight: 'bold',
        }}>
        Producers
      </Text>
      <FlatList
        horizontal={true}
        data={producers}
        keyExtractor={item => item}
        style={{
          width: width,
          gap: 10,
        }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 10,
          paddingHorizontal: 20,
        }}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('Producer', { producer: item })
              }}>
              <Text
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: colors?.darkVibrant,
                  padding: 7,
                  paddingHorizontal: 14,
                  fontSize: 12,
                  borderRadius: 16,
                  fontWeight: 'bold',
                }}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </>
  );
};

const Info = ({ anime }) => {
  const info = [
    {
      title: 'Format',
      value: anime.info.stats.type,
    },
    {
      title: 'Status',
      value: anime.moreInfo.status,
    },
    {
      title: 'Episodes',
      value: anime.info.stats.episodes.sub ?? '-',
    },
    {
      title: 'Duration',
      value: (anime.info.stats.duration == '?m') ? '-' : anime.info.stats.duration,
    },
    {
      title: 'Start Date',
      value: (anime.moreInfo.aired.split(' to ')[0])?.replace('?', '-'),
    },
    {
      title: 'End Date',
      value: (anime.moreInfo.aired.split(' to ')[1])?.replace('?', '-'),
    },
    {
      title: 'Mal Score',
      value: anime.moreInfo.malscore?.replace('?', '-'),
    },
  ];
  return (
    <View
      style={{
        paddingVertical: 20,
        gap: 20,
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 20,
      }}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        {info?.slice(0, 4).map(({ title, value }) => {
          return (
            <View
              key={title}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 10,
                  color: 'rgba(255, 255, 255, 0.5)',
                }}>
                {title}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: 'white',
                }}>
                {value}
              </Text>
            </View>
          );
        })}
      </View>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        {info?.slice(4, 8).map(({ title, value }) => {
          return (
            <View
              key={title}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 10,
                  color: 'rgba(255, 255, 255, 0.5)',
                }}>
                {title}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: 'white',
                }}>
                {value}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const Studios = ({ studios, colors }) => {
  return (
    <>
      <Text
        style={{
          paddingLeft: 20,
          color: 'white',
          paddingVertical: 10,
          fontSize: 15,
          fontWeight: 'bold',
        }}>
        Studios
      </Text>
      <FlatList
        horizontal={true}
        data={[studios]}
        keyExtractor={item => item}
        style={{
          width: width,
          gap: 10,
        }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 10,
          paddingHorizontal: 20,
        }}
        renderItem={({ item }) => {
          return (
            <Text
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                backgroundColor: colors?.darkVibrant,
                padding: 7,
                paddingHorizontal: 14,
                fontSize: 12,
                borderRadius: 16,
                fontWeight: 'bold',
              }}>
              {item}
            </Text>
          );
        }}
      />
    </>
  );
};

const PlayButton = ({ onPress, colors }) => {
  return (
    <View
      style={{
        width,
        paddingHorizontal: 20,
        paddingTop: 10,
      }}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          width: '100%',
          backgroundColor: colors?.vibrant,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          gap: 5,
          paddingVertical: 10,
          borderRadius: 15,
          borderWidth: 0.5,
          borderColor: colors?.vibrant,
        }}>
        <View
          style={{
            position: 'absolute',
            left: 10,
          }}>
          <Icons type={'material'} name="play-circle" color={'black'} />
        </View>

        <Text
          style={{
            fontSize: 15,
            color: 'black',
            paddingLeft: 0,
            fontWeight: 'bold',
          }}>
          Play
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const useImageColors = imgUri => {
  const [colors, setColors] = useState(null);
  const [err, setErr] = useState();

  useEffect(() => {
    (async () => {
      try {
        const res = await getPalette(imgUri, {
          fallback: '#ff0000',
          fallbackTextColor: '#ffffff',
        });
        // console.log('colors', res);
        setColors(res);
      } catch (error) {
        // console.log('colors', error);
        setErr(error);
      }
    })();
  }, []);

  return colors;
};

function hexToHSL(H) {
  // Convert hex to RGB first
  let r = 0,
    g = 0,
    b = 0;
  if (H.length == 4) {
    r = '0x' + H[1] + H[1];
    g = '0x' + H[2] + H[2];
    b = '0x' + H[3] + H[3];
  } else if (H.length == 7) {
    r = '0x' + H[1] + H[2];
    g = '0x' + H[3] + H[4];
    b = '0x' + H[5] + H[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return 'hsl(' + h + ',' + s + '%,' + '' + '10%)';
}

const AnimeScreen = props => {
  const [anime, setAnime] = useState(null);
  const [colors, setColors] = useState(null);
  const { loadAnime } = usePlayer();
  // const colors = useImageColors(anime?.info?.poster);
  // console.log(props);
  useEffect(() => {
    getAnimeAboutInfo(props.route.params.id).then(async ({ anime }) => {
      try {

        setAnime(anime);
        const res = await getPalette(anime?.info?.poster, {
          fallback: '#ff0000',
          fallbackTextColor: '#ffffff',
        });
        setColors({ ...res, darkVibrant: hexToHSL(res.vibrant) });

        await ExplorationUtility.saveAnime(anime);
        console.log('colors', res);
        console.log(` \n\n ANIME INFO => `, JSON.stringify(anime, 0, 4));


      } catch (error) {
        console.log(`ERROR IN getAnimeAboutInfo => `, error);
      }
    }, err => {
      console.log('error', err);
    });
  }, []);

  return anime && colors?.vibrant ? (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: APP_CONFIG.backgroundColor,
      }}>
      <ImageBackground
        style={{
          width,
          aspectRatio: 16 / 9,
          borderBottomColor: 'rgba(255, 255, 255, 0.2)',
          borderBottomWidth: 1,
          alignContent: 'center',
          justifyContent: 'flex-end',
        }}
        source={{ uri: anime?.info?.poster ?? require('../../assets/mesh.png') }}
        fadeDuration={0}
        imageStyle={{ opacity: 0.15 }}>
        <View
          style={{
            width,
            paddingLeft: (9 / 16) * ((width / 16) * 9) + 30,
          }}>
          <Text
            style={{
              fontSize: 25,
              fontWeight: 'bold',
              color: colors?.vibrant,
            }}>
            {anime.moreInfo.japanese}
          </Text>
          <Text
            style={{
              fontSize: 25,
              fontWeight: 'bold',
              color: 'white',
            }}>
            {anime.info.name}
          </Text>
        </View>
      </ImageBackground>

      <ImageBackground
        source={{ uri: anime.info.poster }}
        style={{
          height: (width / 16) * 9,
          aspectRatio: 9 / 16,
          position: 'absolute',
          top: ((width / 16) * 9) / 2,
          left: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        imageStyle={{
          borderRadius: 6,
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1,
        }}>
        {/* <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            backgroundColor: colors?.vibrant,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => loadAnime(props.route.params.id)}>
          <Icon name="play" size={25} color="black" />
        </TouchableOpacity> */}
      </ImageBackground>
      <View
        style={{
          height: ((width / 16) * 9) / 2,
          paddingLeft: (9 / 16) * ((width / 16) * 9) + 30,
          paddingRight: 20,
          paddingVertical: 10,
          justifyContent: 'space-between',
        }}>
        {/* {badges()} */}
        <Text
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: 12,
            fontWeight: 'bold',
          }}>
          {anime.info.stats.type} • {anime.moreInfo.premiered} • {' '}
          {anime.moreInfo.status}
        </Text>
        <Text
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: 10,
            fontWeight: 'bold',
          }}>
          {anime.moreInfo.genres?.slice(0, 3).join(' • ')}
        </Text>
      </View>
      <PlayButton
        onPress={() => loadAnime(props.route.params.id, anime)}
        colors={colors}
      />
      <Description description={anime.info.description} colors={colors} />
      <Info anime={anime} colors={colors} />
      <Studios studios={anime.moreInfo.studios} colors={colors} />
      <Genres genres={anime.moreInfo.genres} colors={colors} />
      <Producers producers={anime.moreInfo.producers} colors={colors} />

      <View style={{ height: 150, backgroundColor: 'transparent' }} />
    </ScrollView>
  ) : <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size={50} color={APP_CONFIG.primaryColor} />
  </View>;
};

export default AnimeScreen;
