import axios from 'axios';
import {load} from 'cheerio';
import {extractAnimes, extractMostPopularAnimes} from './scrapeAnimeSearch.js';

const USER_AGENT_HEADER =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4692.71 Safari/537.36';

const ACCEPT_HEADER =
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9';


import APP_CONFIG from "../../app.json";
const SRC_BASE_URL = APP_CONFIG.BASE_URL;

// /anime/info?id=${anime-id}
export default async function getAnimeAboutInfo(
  id = 'jujutsu-kaisen-2nd-season-18413',
) {
  try {
    const animeId = id ? decodeURIComponent(id) : null;

    if (animeId === null) {
      throw new Error('Anime unique id required');
    }

    const data = await scrapeAnimeAboutInfo(animeId);
    // console.log('anime info', data);

    return data;
  } catch (err) {
    console.error(`Error getAnimeAboutInfo : `, err);
    return {};
  }
}

async function scrapeAnimeAboutInfo(id) {
  const res = {
    anime: {
      info: {
        id: null,
        name: null,
        poster: null,
        description: null,
        stats: {
          rating: null,
          quality: null,
          episodes: {
            sub: null,
            dub: null,
          },
          type: null,
          duration: null,
        },
      },
      moreInfo: {},
    },
    seasons: [],
    mostPopularAnimes: [],
    relatedAnimes: [],
    recommendedAnimes: [],
  };

  try {
    const animeUrl = new URL(id, SRC_BASE_URL);
    const mainPage = await axios.get(animeUrl.href, {
      headers: {
        'User-Agent': USER_AGENT_HEADER,
        Accept: ACCEPT_HEADER,
      },
    });

    const $ = load(mainPage.data);

    const selector = '#ani_detail .container .anis-content';

    res.anime.info.id =
      $(selector)
        ?.find('.anisc-detail .film-buttons a.btn-play')
        ?.attr('href')
        ?.split('/')
        ?.pop() || null;
    res.anime.info.name =
      $(selector)
        ?.find('.anisc-detail .film-name.dynamic-name')
        ?.text()
        ?.trim() || null;
    res.anime.info.description =
      $(selector)
        ?.find('.anisc-detail .film-description .text')
        .text()
        ?.split('[')
        ?.shift()
        ?.trim() || null;
    res.anime.info.poster =
      $(selector)?.find('.film-poster .film-poster-img')?.attr('src')?.trim() ||
      null;

    // stats
    res.anime.info.stats.rating =
      $(`${selector} .film-stats .tick .tick-pg`)?.text()?.trim() || null;
    res.anime.info.stats.quality =
      $(`${selector} .film-stats .tick .tick-quality`)?.text()?.trim() || null;
    res.anime.info.stats.episodes = {
      sub:
        Number($(`${selector} .film-stats .tick .tick-sub`)?.text()?.trim()) ||
        null,
      dub:
        Number($(`${selector} .film-stats .tick .tick-dub`)?.text()?.trim()) ||
        null,
    };
    res.anime.info.stats.type =
      $(`${selector} .film-stats .tick`)
        ?.text()
        ?.trim()
        ?.replace(/[\s\n]+/g, ' ')
        ?.split(' ')
        ?.at(-2) || null;
    res.anime.info.stats.duration =
      $(`${selector} .film-stats .tick`)
        ?.text()
        ?.trim()
        ?.replace(/[\s\n]+/g, ' ')
        ?.split(' ')
        ?.pop() || null;

    // more information
    $(`${selector} .anisc-info-wrap .anisc-info .item:not(.w-hide)`).each(
      (i, el) => {
        let key = $(el)
          .find('.item-head')
          .text()
          .toLowerCase()
          .replace(':', '')
          .trim();
        key = key.includes(' ') ? key.replace(' ', '') : key;

        const value = [
          ...$(el)
            .find('*:not(.item-head)')
            .map((i, el) => $(el).text().trim()),
        ]
          .map(i => `${i}`)
          .toString()
          .trim();

        if (key === 'genres') {
          res.anime.moreInfo[key] = value.split(',').map(i => i.trim());
          return;
        }
        if (key === 'producers') {
          res.anime.moreInfo[key] = value.split(',').map(i => i.trim());
          return;
        }
        res.anime.moreInfo[key] = value;
      },
    );

    // more seasons
    const seasonsSelector = '#main-content .os-list a.os-item';
    $(seasonsSelector).each((i, el) => {
      res.seasons.push({
        id: $(el)?.attr('href')?.slice(1)?.trim() || null,
        name: $(el)?.attr('title')?.trim() || null,
        title: $(el)?.find('.title')?.text()?.trim(),
        poster:
          $(el)
            ?.find('.season-poster')
            ?.attr('style')
            ?.split(' ')
            ?.pop()
            ?.split('(')
            ?.pop()
            ?.split(')')[0] || null,
        isCurrent: $(el).hasClass('active'),
      });
    });

    /** checked aniwatch site, 'nth-of-type(1)' is giving correct most popular anime */
    const mostPopularSelector =
      '#main-sidebar .block_area.block_area_sidebar.block_area-realtime:nth-of-type(1) .anif-block-ul ul li';
    res.mostPopularAnimes = extractMostPopularAnimes($, mostPopularSelector);

    /** couldnt find 'related anime' on aniwatch site */
    const relatedAnimeSelector =
      '#main-sidebar .block_area.block_area_sidebar.block_area-realtime:nth-of-type(2) .anif-block-ul ul li';
    res.relatedAnimes = extractMostPopularAnimes($, relatedAnimeSelector);

    const recommendedAnimeSelector =
      '#main-content .block_area.block_area_category .tab-content .flw-item';
    res.recommendedAnimes = extractAnimes($, recommendedAnimeSelector);
    // console.log(`~~~~~~~~~~~~~~~info : `, JSON.stringify(res, 0, 4));
    return res;
  } catch (err) {
    console.log(`Error : `, err);
    throw err;
  }
}
