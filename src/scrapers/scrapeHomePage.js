
import { extractAnimes } from './scrapeAnimeSearch.js'
import axios, { AxiosError } from "axios";
import { load } from "cheerio";

const USER_AGENT_HEADER =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4692.71 Safari/537.36";

const ACCEPT_HEADER =
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9";

const SRC_BASE_URL = "https://hianime.to";
const SRC_AJAX_URL = "https://hianime.to/ajax";
const SRC_HOME_URL = "https://hianime.to/home";
const SRC_SEARCH_URL = "https://hianime.to/search";

export const extractTop10Animes = ($, period) => {
  try {

    const animes = [];
    const selector = `#top-viewed-${period} ul li`;

    $(selector).each((i, el) => {
      animes.push({
        id:
          $(el)
            .find(".film-detail .dynamic-name")
            ?.attr("href")
            ?.slice(1)
            .trim() || null,
        rank: Number($(el).find(".film-number span")?.text()?.trim()) || null,
        name: $(el).find(".film-detail .dynamic-name")?.text()?.trim() || null,
        poster:
          $(el)
            .find(".film-poster .film-poster-img")
            ?.attr("data-src")
            ?.trim() || null,
        episodes: {
          sub:
            Number(
              $(el)
                .find(".film-detail .fd-infor .tick-item.tick-sub")
                ?.text()
                ?.trim()
            ) || null,
          dub:
            Number(
              $(el)
                .find(".film-detail .fd-infor .tick-item.tick-dub")
                ?.text()
                ?.trim()
            ) || null,
        },
      });
    });

    return animes;
  } catch (err) {
    throw err
  }
};

// /anime/home
async function scrapeHomePage() {
  const res = {
    spotlightAnimes: [],
    trendingAnimes: [],
    latestEpisodeAnimes: [],
    topUpcomingAnimes: [],
    top10Animes: {
      today: [],
      week: [],
      month: [],
    },
    topAiringAnimes: [],
    genres: [],
  };

  try {
    const mainPage = await axios.get(SRC_HOME_URL, {
      headers: {
        "User-Agent": USER_AGENT_HEADER,
        Accept: ACCEPT_HEADER,
      },
    });

    const $ = load(mainPage.data);

    const spotlightSelector =
      "#slider .swiper-wrapper .swiper-slide";

    $(spotlightSelector).each((i, el) => {
      const otherInfo = $(el)
        .find(".deslide-item-content .sc-detail .scd-item")
        .map((i, el) => $(el).text().trim())
        .get()
        .slice(0, -1);

      res.spotlightAnimes.push({
        rank:
          Number(
            $(el)
              .find(".deslide-item-content .desi-sub-text")
              ?.text()
              .trim()
              .split(" ")[0]
              .slice(1)
          ) || null,
        id: $(el)
          .find(".deslide-item-content .desi-buttons a")
          ?.last()
          ?.attr("href")
          ?.slice(1)
          ?.trim(),
        name: $(el)
          .find(".deslide-item-content .desi-head-title.dynamic-name")
          ?.text()
          .trim(),
        description: $(el)
          .find(".deslide-item-content .desi-description")
          ?.text()
          ?.split("[")
          ?.shift()
          ?.trim(),
        poster: $(el)
          .find(".deslide-cover .deslide-cover-img .film-poster-img")
          ?.attr("data-src")
          ?.trim(),
        jname: $(el)
          .find(".deslide-item-content .desi-head-title.dynamic-name")
          ?.attr("data-jname")
          ?.trim(),
        episodes: {
          sub:
            Number(
              $(el)
                .find(
                  ".deslide-item-content .sc-detail .scd-item .tick-item.tick-sub"
                )
                ?.text()
                ?.trim()
            ) || null,
          dub:
            Number(
              $(el)
                .find(
                  ".deslide-item-content .sc-detail .scd-item .tick-item.tick-dub"
                )
                ?.text()
                ?.trim()
            ) || null,
        },
        otherInfo,
      });
    });

    const trendingSelector =
      "#trending-home .swiper-wrapper .swiper-slide";

    $(trendingSelector).each((i, el) => {
      res.trendingAnimes.push({
        rank: parseInt(
          $(el).find(".item .number")?.children()?.first()?.text()?.trim()
        ),
        name: $(el)
          .find(".item .number .film-title.dynamic-name")
          ?.text()
          ?.trim(),
        id: $(el).find(".item .film-poster")?.attr("href")?.slice(1)?.trim(),
        poster: $(el)
          .find(".item .film-poster .film-poster-img")
          ?.attr("data-src")
          ?.trim(),
      });
    });

    const latestEpisodeSelector =
      "#main-content .block_area_home:nth-of-type(1) .tab-content .film_list-wrap .flw-item";
    res.latestEpisodeAnimes = extractAnimes($, latestEpisodeSelector);

    const topUpcomingSelector =
      "#main-content .block_area_home:nth-of-type(3) .tab-content .film_list-wrap .flw-item";
    res.topUpcomingAnimes = extractAnimes($, topUpcomingSelector);

    const genreSelector =
      "#main-sidebar .block_area.block_area_sidebar.block_area-genres .sb-genre-list li";
    $(genreSelector).each((i, el) => {
      res.genres.push(`${$(el).text().trim()}`);
    });

    const mostViewedSelector =
      '#main-sidebar .block_area-realtime [id^="top-viewed-"]';
    $(mostViewedSelector).each((i, el) => {
      const period = $(el).attr("id")?.split("-")?.pop()?.trim();

      if (period === "day") {
        res.top10Animes.today = extractTop10Animes($, period);
        return;
      }
      if (period === "week") {
        res.top10Animes.week = extractTop10Animes($, period);
        return;
      }
      if (period === "month") {
        res.top10Animes.month = extractTop10Animes($, period);
      }
    });

    const topAiringSelector =
      "#anime-featured .row div:nth-of-type(1) .anif-block-ul ul li";
    $(topAiringSelector).each((i, el) => {
      const otherInfo = $(el)
        .find(".fd-infor .fdi-item")
        .map((i, el) => $(el).text().trim())
        .get();

      res.topAiringAnimes.push({
        id: $(el)
          .find(".film-detail .film-name .dynamic-name")
          ?.attr("href")
          ?.slice(1)
          ?.trim(),
        name: $(el)
          .find(".film-detail .film-name .dynamic-name")
          ?.attr("title")
          ?.trim(),
        jname: $(el)
          .find(".film-detail .film-name .dynamic-name")
          ?.attr("data-jname")
          ?.trim(),
        poster: $(el)
          .find(".film-poster a .film-poster-img")
          ?.attr("data-src")
          ?.trim(),
        otherInfo,
      });
    });

    console.log(`~~~~~~~~~~~~~~~~~~`)
    console.log(`HOME PAGE DATA : `);
    for (const key in res) {
      console.log(`~ ${key} : ${res[key]?.length}`);
    }
    // console.log(`~ topUpcomingAnimes VALUE : ${JSON.stringify(res.topUpcomingAnimes, 0, 4)}`);
    console.log(`~~~~~~~~~~~~~~~~~~`)


    return res;
  } catch (err) {
    throw err
  }
}

export default scrapeHomePage;
