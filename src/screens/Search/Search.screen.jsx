import { Image, ScrollView, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import getAnimeSearch from '../../scrapers/scrapeAnimeSearch.js';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import styles from './search.styles.js'
import APP_CONFIG from '../../../app.json'
import Icons from '../../components/UI/Icons.jsx';
import ContentCard from '../../components/ContentCard.jsx'
import Playlist from '../../components/Playlist.jsx';
import Grid from '../../components/Grid.jsx';

function SearchScreen() {
  const [search, setSearch] = useState('Shoshimin');
  const [mostPopularAnimes, setMostPopularAnimes] = useState([])

  const queryClient = useQueryClient()
  const homeData = queryClient.getQueryData(['home']) || {
    spotlightAnimes: [],
    trendingAnimes: [],
    topUpcomingAnimes: [],
    topAiringAnimes: [],
    top10Animes: [],
  };
  const { data } = useQuery({
    queryFn: () => getAnimeSearch(search),
    queryKey: ['mySearch', { search }],
    placeholderData: [{ mostPopularAnimes: homeData?.trendingAnimes ?? homeData?.topAiringAnimes ?? mostPopularAnimes ?? [] }],
  });

  useEffect(() => {
    if (data?.mostPopularAnimes?.length) {
      setMostPopularAnimes(data.mostPopularAnimes);
    } else {
      setMostPopularAnimes(homeData.trendingAnimes.length ? homeData.trendingAnimes : homeData.topAiringAnimes);
    }

  }, [data]);



  return (

    <View
      style={{
        ...styles.container,
        backgroundColor: APP_CONFIG.backgroundColor,
      }}>
      <Text style={styles.pageTitle}>Search </Text>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{
          ...styles.scrollContainer,
          backgroundColor: APP_CONFIG.backgroundColor,
        }}>

        {renderInputSection(search, setSearch)}

        {/* <Playlist
          title={'Search Results'}
          data={data?.animes}
          cardHeight={160}
        /> */}

        <Playlist
          title={'Most Popular Animes'}
          data={mostPopularAnimes ?? []}
        />

        <Text style={{
          fontSize: 20,
          padding: 10,
          paddingHorizontal: 10,
          color: '#fff',
          fontWeight: '600'
        }}>
          Search Results {!!data?.animes?.length ? `(${data?.animes?.length})` : '...'}
        </Text>
        <Grid animes={data?.animes} columns={3} bottomSpacing={120} />
      </ScrollView>
    </View>
  );



}


const DEBOUNCE_DELAY = 500;

function renderInputSection(search, setSearch) {
  const queryClient = useQueryClient();
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(debouncedSearch);
      queryClient.invalidateQueries(['mySearch']);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedSearch, setSearch, queryClient]);

  return (
    <View style={styles.inputSection}>
      <TextInput
        style={styles.input}
        autoFocus={true}
        placeholder="e.g. Naruto, One Piece..."
        onChangeText={(text) => setDebouncedSearch(text?.replace('  ', ' '))}
        value={debouncedSearch}
        placeholderTextColor={APP_CONFIG.secondaryColor}
        selectionColor={APP_CONFIG.secondaryColor}
        onSubmitEditing={() => { }}
        keyboardAppearance={"dark"}
        cursorColor={APP_CONFIG.secondaryColor}
      />
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          ...styles.actionButton,
          backgroundColor:  APP_CONFIG.primaryColor ,
        }}
        onPress={() => {
          console.log(`pressed ${debouncedSearch}`);
          if (!debouncedSearch?.length) return;
          getAnimeSearch(debouncedSearch);
          ToastAndroid.show(`Searching for ${debouncedSearch}`, ToastAndroid.SHORT);
        }}
      >
        <Icons name={'search'} color={'white' } />
      </TouchableOpacity>
    </View>
  );
}

export default SearchScreen;
