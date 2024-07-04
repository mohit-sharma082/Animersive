import axios from 'axios';
import { load } from 'cheerio';

const USER_AGENT_HEADER =
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4692.71 Safari/537.36';
const ACCEPT_HEADER =
	'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9';

import APP_CONFIG from "../../app.json";
const SRC_BASE_URL = APP_CONFIG.BASE_URL;
const SRC_AJAX_URL = 'https://hianime.to/ajax';

// /anime/episodes/${anime-id}
export default async function scrapeAnimeEpisodes(animeId) {
	const res = {
		totalEpisodes: 0,
		episodes: [],
	};

	try {
		const episodesAjax = await axios.get(
			`${SRC_AJAX_URL}/v2/episode/list/${animeId.split('-').pop()}`,
			{
				headers: {
					Accept: ACCEPT_HEADER,
					'User-Agent': USER_AGENT_HEADER,
					'X-Requested-With': 'XMLHttpRequest',
					Referer: `${SRC_BASE_URL}/watch/${animeId}`,
				},
			},
		);

		const $ = load(episodesAjax.data.html);

		res.totalEpisodes = Number($('.detail-infor-content .ss-list a').length);

		$('.detail-infor-content .ss-list a').each((i, el) => {
			res.episodes.push({
				title: $(el)?.attr('title')?.trim() || null,
				episodeId: $(el)?.attr('href')?.split('/')?.pop() || null,
				number: Number($(el).attr('data-number')),
				isFiller: $(el).hasClass('ssl-item-filler'),
			});
		});

		return res;
	} catch (err) {
		console.log(err);
		return res
	}
}


