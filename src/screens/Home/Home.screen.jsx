import React, { useEffect, useState } from 'react';
import { FlatList, Image, ImageBackground, Modal, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
// import Carousel from './components/Carousel';
import scrapeHomePage from '../../scrapers/scrapeHomePage';
import APP_CONFIG from '../../../app.json';
import Playlist from '../../components/Playlist';
import MyButton from '../../components/UI/MyButton';
import { useQuery } from '@tanstack/react-query';
import homeStyles from './home.styles';
import getUrl from '../../scrapers/getUrl';
import RapidCloud from '../../scrapers/rapidcloud';
import { usePlayer } from '../../player/Context';
import PLACEHOLDER_DATA from './homeData.json';

import { Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Carousel from 'react-native-reanimated-carousel';
import GenresList from '../../components/GenresList';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useGlobalContext } from '../../state/Context';
import { DownloadUtility } from '../../utitlities/downloadUtitliy';
import VerticalList from '../../components/VerticalList';
import Grid from '../../components/Grid';

export default function Home() {
  const { load } = usePlayer();
  const { downloadAnime } = useGlobalContext();
  const [currCarouselItem, setCurrCarouselItem] = useState(null);
  const navigation = useNavigation()

  // const { genres,
  //   latestEpisodeAnimes,
  //   spotlightAnimes,
  //   top10Animes,
  //   topAiringAnimes,
  //   topUpcomingAnimes,
  //   trendingAnimes
  // } = PLACEHOLDER_DATA
  useEffect(() => {
    // load();
    const urls = [{
      "isM3U8": true,
      "url": "https://ea.netmagcdn.com:2228/hls-playback/f877ebeebe0a613047d4e5f85385c11177b24cda7bdbccf58bcebc6e66fd986ce939105fd66efa1102caf04268238238eea0a0e4abf1772c4377e3f994af360c8f4680b35f7e49fac7a3861c04603a641e46189a3a6cdad52b9932ec73bfc4a6c234f3344250af492876fe9945c2fe079938cccf51188c7eb37a2f1fa32c31ce9d96c17adb01f7895b5761723ea01d7f/master.m3u8"
    },
    {
      "isM3U8": true,
      "quality": "auto",
      "url": "https://ea.netmagcdn.com:2228/hls-playback/f877ebeebe0a613047d4e5f85385c11177b24cda7bdbccf58bcebc6e66fd986ce939105fd66efa1102caf04268238238eea0a0e4abf1772c4377e3f994af360c8f4680b35f7e49fac7a3861c04603a641e46189a3a6cdad52b9932ec73bfc4a6c234f3344250af492876fe9945c2fe079938cccf51188c7eb37a2f1fa32c31ce9d96c17adb01f7895b5761723ea01d7f/master.m3u8"
    }]


    // DownloadUtility.downloadtest(urls[0].url)

    // DownloadUtility.downloadM3U8File(urls[0].url, 'highest')
    //   .then(() => {
    //     // console.log('Download complete');
    //   })
    //   .catch((error) => {
    //     console.error('Error downloading video', error);
    //   });

    // DownloadUtility.download(urls[1].url, (progress) => {
    //   console.log(`\n=> progress `, progress);
    // }).then(() => {
    //   console.log(`\n=> Download completed `);
    // })
  }, []);


  const {
    data: {
      genres,
      latestEpisodeAnimes,
      spotlightAnimes,
      trendingAnimes,
      topUpcomingAnimes,
      topAiringAnimes,
      top10Animes,
    },
  } = useQuery({
    queryFn: scrapeHomePage,
    queryKey: ['home'],
    placeholderData: PLACEHOLDER_DATA,
  });

  // return null;

  // return <App />;
  const width = Dimensions.get('window').width;


  return (

    <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={{ position: 'relative' }}>

      <Carousel
        loop
        width={width}
        height={width / 1.6}
        autoPlay={true}
        autoPlayInterval={3000}
        data={spotlightAnimes}
        scrollAnimationDuration={1500}
        onSnapToItem={(index) => {
          // console.log('current index:', index);
          setCurrCarouselItem(spotlightAnimes[index])
        }}
        renderItem={({ item, index }) => (
          <View
            style={{ flex: 1, position: 'relative' }}
          >
            <Image source={{ uri: item.poster }} style={{ flex: 1, zIndex: 1 }} />
            <LinearGradient
              colors={['transparent', 'transparent', 'transparent', APP_CONFIG.backgroundColor]}
              style={homeStyles.carouselImgGradient}
            ></LinearGradient>
            <LinearGradient
              colors={[APP_CONFIG.backgroundColor, 'transparent']}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={homeStyles.carouselImgGradient}
            >
              <Text style={{ fontSize: 12, color: '#f2f2f2', width: '50%' }} numberOfLines={6}>
                {item.description}
              </Text>
              <Text style={{ fontSize: 14, color: APP_CONFIG.primaryColor, paddingVertical: 10, fontWeight: '500' }} >
                {[item.episodes.sub + ' EP', ...item.otherInfo].join(' • ')}
              </Text>
              <Text style={{ fontSize: 18, color: 'white', width: '65%', fontWeight: '600' }} numberOfLines={2}>
                {item.name}
              </Text>
            </LinearGradient>

          </View>
        )
        }
      />
      <View style={{ flexDirection: 'row', width: '100%', position: 'relative', backgroundColor: 'transparent' }}>
        <MyButton style={{ marginTop: 5, marginLeft: 20 }} title={'Watch Now'} icon={'play'}
          onPress={() => {
            navigation.navigate("Anime", { id: currCarouselItem?.id })
          }}
        />

        <MyButton style={{ marginTop: 5, backgroundColor: APP_CONFIG.backgroundColor }} title={'Download'} icon={'download'} secondary={true} onPress={() => {
          downloadAnime(currCarouselItem)
        }} />

      </View>


      <GenresList genres={genres} />
      {/* MAIN BODY */}
      <ScrollView

        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          verticalPadding: 10,
          backgroundColor: APP_CONFIG.backgroundColor,
        }}>

        <Playlist title={'Trending Animes'} data={trendingAnimes} numbered={true} />
        <Playlist title={'Top Upcoming Animes'} data={topUpcomingAnimes} />
        <Playlist title={'Top Airing Animes'} data={topAiringAnimes} />
        <Playlist title={'Latest Episodes Anime'} data={latestEpisodeAnimes} />

        {/* <View>
          <Text style={homeStyles.heading}>Top 10 Animes</Text>
          <View
            style={{
              marginTop: 10,
              paddingHorizontal: 10,
              borderRadius: 5,
              backgroundColor: APP_CONFIG.secondaryColor + 50,
            }}>
            <Playlist title={'Monthly'} data={top10Animes.month} cardHeight={200} numbered={true} />
            <Playlist title={'Weekly'} data={top10Animes.week} cardHeight={200} numbered={true} />
            <Playlist title={'Today'} data={top10Animes.today} cardHeight={200} numbered={true}
            />
          </View>
        </View> */}

        <Text style={homeStyles.title}>{'Top 10 Animes - Monthly'}</Text>
        <Grid columns={4} animes={top10Animes.month} customStyle={{ padding: 8, }} />

        <Text style={homeStyles.title}>{'Top 10 Animes - Weekly'}</Text>
        <Grid columns={4} animes={top10Animes.week} customStyle={{ padding: 8, }} />

        <Text style={homeStyles.title}>{'Top 10 Animes - Today'}</Text>
        <Grid columns={4} animes={top10Animes.today} customStyle={{ padding: 8, }} />



        <View style={{ height: 200 }}></View>
      </ScrollView>
    </ScrollView >

    // <View style={{ ...homeStyles.container, backgroundColor: APP_CONFIG.backgroundColor }}>
    //   {/* <Text style={homeStyles.pageTitle}>Home </Text> */}
    //   <Carousel
    //     loop
    //     width={width}
    //     height={width / 2}
    //     autoPlay={true}
    //     data={spotlightAnimes}
    //     scrollAnimationDuration={2500}
    //     onSnapToItem={(index) => {
    //       // console.log('current index:', index);
    //       setCurrCarouselItem(spotlightAnimes[index])
    //     }}
    //     renderItem={({ item, index }) => (
    //       <View
    //         style={{ flex: 1, position: 'relative' }}
    //       >
    //         <Image source={{ uri: item.poster }} style={{ flex: 1, zIndex: 1 }} />
    //         <LinearGradient
    //           colors={[APP_CONFIG.backgroundColor, 'transparent']}
    //           start={{ x: 0, y: 1 }}
    //           end={{ x: 1, y: 0 }}
    //           style={homeStyles.carouselImgGradient}
    //         >
    //           <Text style={{ fontSize: 12, color: '#f2f2f2', width: '50%' }} numberOfLines={6}>
    //             {item.description}
    //           </Text>
    //           <Text style={{ fontSize: 14, color: APP_CONFIG.primaryColor, paddingVertical: 10, fontWeight: '500' }} >
    //             {[item.episodes.sub + ' EP', ...item.otherInfo].join(' • ')}
    //           </Text>
    //           <Text style={{ fontSize: 18, color: 'white', width: '65%', fontWeight: '600' }} numberOfLines={2}>
    //             {item.name}
    //           </Text>
    //         </LinearGradient>
    //       </View>
    //     )
    //     }
    //   />
    //   <GenresList genres={genres} />
    //   <ScrollView
    //     showsVerticalScrollIndicator={false}
    //     style={{
    //       flex: 1,
    //       verticalPadding: 10,
    //       backgroundColor: APP_CONFIG.backgroundColor,
    //       height: '100%',
    //     }}>



    //     <View style={{ flexDirection: 'row', width: '100%' }}>
    //       <MyButton title={'Watch Now'} icon={'play'}
    //         onPress={() => {
    //           navigation.navigate("Anime", { id: currCarouselItem?.id })
    //         }}
    //       />

    //       <MyButton title={'Download'} icon={'download'} secondary={true} onPress={() => {
    //         downloadAnime(currCarouselItem)
    //       }} />
    //     </View>

    //     <Playlist title={'Trending Animes'} data={trendingAnimes} numbered={true} />
    //     <Playlist title={'Top Upcoming Animes'} data={topUpcomingAnimes} />
    //     <Playlist title={'Top Airing Animes'} data={topAiringAnimes} />

    //     <View>
    //       <Text style={homeStyles.heading}>Top 10 Animes</Text>
    //       <View
    //         style={{
    //           marginTop: 10,
    //           paddingHorizontal: 10,
    //           borderRadius: 5,
    //           backgroundColor: APP_CONFIG.secondaryColor + 50,
    //         }}>
    //         <Playlist title={'Monthly'} data={top10Animes.month} cardHeight={120} numbered={true} />
    //         <Playlist title={'Weekly'} data={top10Animes.week} cardHeight={120} numbered={true} />
    //         <Playlist title={'Today'} data={top10Animes.today} cardHeight={120} numbered={true}
    //         />
    //       </View>
    //     </View>

    //     <Playlist title={'Latest Episodes Anime'} data={latestEpisodeAnimes} />

    //     <View style={{ height: 200 }}></View>
    //   </ScrollView>
    // </View >
  );
}
