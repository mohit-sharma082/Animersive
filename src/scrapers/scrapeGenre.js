import { URL } from "react-native-url-polyfill";
import { extractAnimes, extractMostPopularAnimes } from "./scrapeAnimeSearch";
import axios from "axios";
import { load } from 'cheerio';

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

export default async function scrapeGenreAnime(genreName, page = 1) {
    const res = {
        genreName,
        animes: [],
        genres: [],
        topAiringAnimes: [],
        totalPages: 1,
        hasNextPage: false,
        currentPage: Number(page),
    };

    // there's a typo with zoro where martial arts is marial arts
    genreName = genreName === "martial-arts" ? "marial-arts" : genreName;

    try {
        const genreUrl = new URL(
            `/genre/${genreName}?page=${page}`,
            SRC_BASE_URL
        );

        const mainPage = await axios.get(genreUrl.href, {
            headers: {
                "User-Agent": USER_AGENT_HEADER,
                Accept: ACCEPT_HEADER,
            },
        });

        // console.log(`=> GOT HERE - 1`);
        const $ = load(mainPage.data);

        const selector =
            "#main-content .tab-content .film_list-wrap .flw-item";

        const genreNameSelector =
            "#main-content .block_area .block_area-header .cat-heading";
        res.genreName = $(genreNameSelector)?.text()?.trim() ?? genreName;

        res.hasNextPage =
            $(".pagination > li").length > 0
                ? $(".pagination li.active").length > 0
                    ? $(".pagination > li").last().hasClass("active")
                        ? false
                        : true
                    : false
                : false;

        res.totalPages =
            Number(
                $('.pagination > .page-item a[title="Last"]')
                    ?.attr("href")
                    ?.split("=")
                    .pop() ??
                $('.pagination > .page-item a[title="Next"]')
                    ?.attr("href")
                    ?.split("=")
                    .pop() ??
                $(".pagination > .page-item.active a")?.text()?.trim()
            ) || 1;


        // console.log(`=> GOT HERE - 2`);
        res.animes = extractAnimes($, selector);

        if (res.animes.length === 0 && !res.hasNextPage) {
            res.totalPages = 0;
        }

        const genreSelector =
            "#main-sidebar .block_area.block_area_sidebar.block_area-genres .sb-genre-list li";
        $(genreSelector).each((i, el) => {
            res.genres.push(`${$(el).text().trim()}`);
        });


        // console.log(`=> GOT HERE - 3`);
        const topAiringSelector =
            "#main-sidebar .block_area.block_area_sidebar.block_area-realtime .anif-block-ul ul li";
        res.topAiringAnimes = extractMostPopularAnimes($, topAiringSelector);


        // console.log(`=> GOT HERE - 4`);
        return res;
    } catch (err) {
        console.log(`Error in scrapeGenreAnime : `, err);
        return res;
    }
}

