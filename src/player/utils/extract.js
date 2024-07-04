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
        // console.log(`~~ RESPONSE : `, JSON.stringify(resp.data, 0, 4));
        const items = (resp?.data?.results?.streamingInfo ?? []).filter(item => !!item.value.decryptionResult);

        if (!items.length) throw new Error(`No sources found using the anime API !`)
        // console.log(`~~ ITEMS : `, JSON.stringify(items, 0, 4));
        const source = items.find((item) => (item?.value?.decryptionResult?.type ?? "") == category)?.value ?? {};
        // console.log(`WHAT IS THE HERE - > `, JSON.stringify(items[4], 0, 4));

        const extractedData = {
          sources: (items ?? []).map(item => {
            return {
              url: item?.value?.decryptionResult?.link ?? "",
              quality: item?.value?.decryptionResult?.server ?? "",
              isM3U8: item?.value?.decryptionResult?.link.includes('.m3u8') ?? true,
            }
          }),
          subtitles: (source?.subtitleResult?.subtitle ?? []).map((sub) => {
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
        config = await new MegaCloud().extract(new URL(megaUrl))

      }
    }
    // console.log(`=> CONFIG HERE ~ `, config);
    config.textTrack = await parseTextTrack(config?.subtitles, lang);
    config.thumbnails = await parseThumbnails(config?.subtitles);
    return config;
  } catch (err) {
    console.log('\n\n ==> ERROR  in extracting ~~ ', episodeId, err?.message, err);
    ToastAndroid.show(`Something went wrong! Please try again later...`, ToastAndroid.LONG);
  }
}
