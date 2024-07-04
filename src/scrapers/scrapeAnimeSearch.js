import { load } from 'cheerio';
import axios from 'axios';

const ACCEPT_ENCODING_HEADER = 'gzip, deflate, br';

const USER_AGENT_HEADER =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4692.71 Safari/537.36';

const ACCEPT_HEADER =
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9';


import APP_CONFIG from "../../app.json";
const SRC_BASE_URL = APP_CONFIG.BASE_URL;
const SRC_AJAX_URL = 'https://hianime.to/ajax';
const SRC_HOME_URL = 'https://hianime.to/home';
const SRC_SEARCH_URL = 'https://hianime.to/search';

// /anime/search?q=${query}&page=${page}
export default async function getAnimeSearch(query, page = 0) {
  try {
    if (query === null) {
      throw new Error('Search keyword required');
    }

    console.log(`~~~~~~~~~~~~~~`);
    console.log(`SEARCHING : `, query)
    if (!query?.length) return {
      animes: [],
      mostPopularAnimes: [],
      currentPage: 0,
      hasNextPage: false,
      totalPages: 0,
    }
    const data = await scrapeAnimeSearch(query, page);
    // console.log(`Data : `, data);
    // console.log(`~~~~~~~~~~~~~~`);
    return data;
  } catch (err) {
    console.error(`Error : `, err);
    return null;
  }
}

export async function scrapeAnimeSearch(q, page = 1) {
  const res = {
    animes: [],
    mostPopularAnimes: [],
    currentPage: Number(page),
    hasNextPage: false,
    totalPages: 1,
  };
  if (!q) return res

  try {
    const mainPage = await axios.get(
      `${SRC_SEARCH_URL}?keyword=${q}&page=${page}`,
      {
        // responseType: 'arraybuffer',
        headers: {
          'User-Agent': USER_AGENT_HEADER,
          //   'Accept-Encoding': ACCEPT_ENCODING_HEADER,
          Accept: ACCEPT_HEADER,
        },
      },
    );
    const $ = load(mainPage.data);

    const selector = '#main-content .tab-content .film_list-wrap .flw-item';

    res.hasNextPage =
      $('.pagination > li').length > 0
        ? $('.pagination li.active').length > 0
          ? $('.pagination > li').last().hasClass('active')
            ? false
            : true
          : false
        : false;

    res.totalPages =
      Number(
        $('.pagination > .page-item a[title="Last"]')
          ?.attr('href')
          ?.split('=')
          .pop() ??
        $('.pagination > .page-item a[title="Next"]')
          ?.attr('href')
          ?.split('=')
          .pop() ??
        $('.pagination > .page-item.active a')?.text()?.trim(),
      ) || 1;

    res.animes = extractAnimes($, selector);

    if (res.animes.length === 0 && !res.hasNextPage) {
      res.totalPages = 0;
    }

    const mostPopularSelector =
      '#main-sidebar .block_area.block_area_sidebar.block_area-realtime .anif-block-ul ul li';
    res.mostPopularAnimes = extractMostPopularAnimes($, mostPopularSelector);

    return res;
  } catch (err) {
    console.log(`Error in scrapeAnimeSearch : `, err);
    return res
  }
}

export const extractMostPopularAnimes = ($, selector) => {
  try {
    const animes = [];

    $(selector).each((i, el) => {
      animes.push({
        id:
          $(el)
            .find('.film-detail .dynamic-name')
            ?.attr('href')
            ?.slice(1)
            .trim() || null,
        name: $(el).find('.film-detail .dynamic-name')?.text()?.trim() || null,
        poster:
          $(el)
            .find('.film-poster .film-poster-img')
            ?.attr('data-src')
            ?.trim() || null,
        jname:
          $(el)
            .find('.film-detail .film-name .dynamic-name')
            .attr('data-jname')
            ?.trim() || null,

        episodes: {
          sub:
            Number($(el)?.find('.fd-infor .tick .tick-sub')?.text()?.trim()) ||
            null,
          dub:
            Number($(el)?.find('.fd-infor .tick .tick-dub')?.text()?.trim()) ||
            null,
        },
        type:
          $(el)
            ?.find('.fd-infor .tick')
            ?.text()
            ?.trim()
            ?.replace(/[\s\n]+/g, ' ')
            ?.split(' ')
            ?.pop() || null,
      });
    });

    return animes;
  } catch (err) {
    throw new Error(err);
  }
};

export const extractAnimes = ($, selector) => {
  try {
    const animes = [];

    $(selector).each((i, el) => {
      const animeId =
        $(el)
          .find('.film-detail .film-name .dynamic-name')
          ?.attr('href')
          ?.slice(1)
          .split('?ref=search')[0] || null;

      animes.push({
        id: animeId,
        name: $(el)
          .find('.film-detail .film-name .dynamic-name')
          ?.text()
          ?.trim(),
        poster:
          $(el)
            .find('.film-poster .film-poster-img')
            ?.attr('data-src')
            ?.trim() || null,
        duration: $(el)
          .find('.film-detail .fd-infor .fdi-item.fdi-duration')
          ?.text()
          ?.trim(),
        type: $(el)
          .find('.film-detail .fd-infor .fdi-item:nth-of-type(1)')
          ?.text()
          ?.trim(),
        rating: $(el).find('.film-poster .tick-rate')?.text()?.trim() || null,
        episodes: {
          sub:
            Number(
              $(el)
                .find('.film-poster .tick-sub')
                ?.text()
                ?.trim()
                .split(' ')
                .pop(),
            ) || null,
          dub:
            Number(
              $(el)
                .find('.film-poster .tick-dub')
                ?.text()
                ?.trim()
                .split(' ')
                .pop(),
            ) || null,
        },
      });
    });

    return animes;
  } catch (err) {
    throw new Error(err);
  }
};
