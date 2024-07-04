import { URL } from "react-native-url-polyfill";
import { extractAnimes, extractMostPopularAnimes } from "./scrapeAnimeSearch";
import axios from "axios";
import { load } from 'cheerio';
import { extractTop10Animes } from "./scrapeHomePage";
const ACCEPT_ENCODING_HEADER = 'gzip, deflate, br';

const USER_AGENT_HEADER =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4692.71 Safari/537.36';

const ACCEPT_HEADER =
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9';



import APP_CONFIG from "../../app.json";
const SRC_BASE_URL = APP_CONFIG.BASE_URL;



export default async function scrapeProducerAnimes(
    producerName,
    page = 1
) {
    const res = {
        producerName,
        animes: [],
        top10Animes: {
            today: [],
            week: [],
            month: [],
        },
        topAiringAnimes: [],
        totalPages: 1,
        hasNextPage: false,
        currentPage: Number(page),
    };

    try {
        const producerUrl = new URL(
            `/producer/${producerName}?page=${page}`,
            SRC_BASE_URL
        );

        const mainPage = await axios.get(producerUrl.href, {
            headers: {
                Accept: ACCEPT_HEADER,
                "User-Agent": USER_AGENT_HEADER,
            },
        });
        // console.log(`=> GOT HERE - 1`);
        const $ = load(mainPage.data);

        const animeSelector =
            "#main-content .tab-content .film_list-wrap .flw-item";

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

        res.animes = extractAnimes($, animeSelector);

        if (res.animes.length === 0 && !res.hasNextPage) {
            res.totalPages = 0;
        }

        const producerNameSelector =
            "#main-content .block_area .block_area-header .cat-heading";
        res.producerName = $(producerNameSelector)?.text()?.trim() ?? producerName;

        const top10AnimeSelector =
            '#main-sidebar .block_area-realtime [id^="top-viewed-"]';

        // console.log(`=> GOT HERE - 3`);

        $(top10AnimeSelector).each((_, el) => {
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

        // console.log(`=> GOT HERE - 4`)

        const topAiringSelector =
            "#main-sidebar .block_area_sidebar:nth-child(2) .block_area-content .anif-block-ul ul li";
        res.topAiringAnimes = extractMostPopularAnimes($, topAiringSelector);

        // console.log(`=> GOT HERE - RETRUNING res => `, JSON.stringify(res, 0, 4), `END OF res`);

        return res;
    } catch (err) {
        console.log(`Error in scrapeProducerAnimes : `, err);
        return res;
    }
}

