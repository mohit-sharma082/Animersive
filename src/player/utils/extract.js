import axios from 'axios';
import getUrl from '../../scrapers/getUrl';
import RapidCloud from '../../scrapers/rapidcloud';
import { parseTextTrack } from '.';
import { parseThumbnails } from './';
import MegaCloud from '../../scrapers/megacloud';
import { ToastAndroid } from 'react-native';
import { URL } from 'react-native-url-polyfill';

export default async function (episodeId, { category = 'sub', lang = '' }) {
  try {
    const megaUrl = await getUrl(episodeId, category);
    let config = null

    console.log(`\n\n => GOT THE MEGA URL ~~`);
    try {

      config = await new RapidCloud().extract(new URL(megaUrl));


    } catch (error) {
      console.log(`~~~~~~~~~~~~~~~~~~~~~~~`);
      console.log(`Error from USING THE RAPID CLOUD FUNCTION : `, error);
      console.log(`~~~~~~~~~~~~~~~~~~~~~~~`);
      try {
        console.log(`\n\n => USING THE ANIME API FUNCTION ~~`);
        const resp = await axios.get(
          `https://anime-api-five-woad.vercel.app/api/stream?id=${episodeId}`
        )
        console.log(`~~ RESPONSE : `, JSON.stringify(resp.data, 0, 4));
        const items = (resp?.data?.results?.streamingInfo ?? []).filter(item => !!item.value.decryptionResult);

        if (!items.length) throw new Error(`No sources found using the anime API !`)
        // console.log(`~~ ITEMS : `, JSON.stringify(items, 0, 4));
        const source = items.find((item) => (item?.value?.decryptionResult?.type ?? "") == category)?.value ?? {};
        // console.log(`\n\n\nWHAT IS THE HERE - > `, JSON.stringify(items[4], 0, 4));

        const extractedData = {
          sources: (items ?? []).map(item => {
            // console.log(`\n\nITEM decryptionResult -> `, item?.value?.decryptionResult.source);
            // console.log(`->> `, JSON.stringify(item?.value, 0, 4))
            const LINK = item?.value?.decryptionResult?.link ?? item?.value?.decryptionResult?.source?.sources?.[0]?.file ?? ''

            return {
              url: LINK,
              quality: item?.value?.decryptionResult?.server ?? "",
              isM3U8: LINK.includes('.m3u8') ?? true,
            }
          }),
          subtitles: (source?.subtitleResult?.subtitle ?? source?.decryptionResult?.source?.tracks ?? []).map((sub) => {
            return {
              lang: sub?.label ?? "Thumbnails",
              url: sub?.file ?? "",
            }
          }),
        };

        config = extractedData
      } catch (error) {
        console.log(`~~~~~~~~~~~~~~~~~~~~~~~`);
        console.log(`Error from ANIMEAPI FUNCTION : `, error);
        console.log(`~~~~~~~~~~~~~~~~~~~~~~~`);
        ToastAndroid.show(`Error in extracting ${episodeId}`, ToastAndroid.LONG);
        try {
          ToastAndroid.show(`Trying the MegaCloud Extractor`, ToastAndroid.SHORT);
          config = await new MegaCloud().extract(new URL(megaUrl))
        } catch (error) {
          console.log(`~~~~~~~~~~~~~~~~~~~~~~~`);
          console.log(`Error from Trying the MegaCloud Extractor : `, error);
          console.log(`~~~~~~~~~~~~~~~~~~~~~~~`);
          ToastAndroid.show(`Error in extracting ${episodeId}`, ToastAndroid.LONG);
        }

      }
    }
    // console.log(`=> CONFIG HERE ~ `, config);
    config.textTrack = await parseTextTrack(config?.subtitles, lang) ?? null;
    config.thumbnails = await parseThumbnails(config?.subtitles);
    return config;
  } catch (err) {
    console.log('\n\n ==> ERROR  in extracting ~~ ', episodeId, err?.message, err);
    ToastAndroid.show(`Something went wrong! Please try again later...`, ToastAndroid.LONG);
  }
}
