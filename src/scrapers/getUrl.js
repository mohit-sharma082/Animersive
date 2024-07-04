import {load} from 'cheerio';
import axios from 'axios';

import APP_CONFIG from "../../app.json";
const SRC_BASE_URL = APP_CONFIG.BASE_URL;
const SRC_AJAX_URL = 'https://hianime.to/ajax';
const SRC_HOME_URL = 'https://hianime.to/home';
const SRC_SEARCH_URL = 'https://hianime.to/search';
const USER_AGENT_HEADER =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4692.71 Safari/537.36';
const Servers = {
  VidStreaming: 'vidstreaming',
  MegaCloud: 'megacloud',
  StreamSB: 'streamsb',
  StreamTape: 'streamtape',
  VidCloud: 'vidcloud',
  AsianLoad: 'asianload',
  GogoCDN: 'gogocdn',
  MixDrop: 'mixdrop',
  UpCloud: 'upcloud',
  VizCloud: 'vizcloud',
  MyCloud: 'mycloud',
  Filemoon: 'filemoon',
};

export default async function getUrl(
  episodeId,
  category = 'sub',
  server = Servers.VidCloud,
) {
  const epId = new URL(`/watch/${episodeId}`, SRC_BASE_URL).href;
  try {
    const resp = await axios.get(
      `${SRC_AJAX_URL}/v2/episode/servers?episodeId=${epId.split('?ep=')[1]}`,
      {
        headers: {
          Referer: epId,
          'User-Agent': USER_AGENT_HEADER,
          'X-Requested-With': 'XMLHttpRequest',
        },
      },
    );
    const $ = load(resp.data.html);
    const serverId =
      $(
        `.ps_-block.ps_-block-sub.servers-${category} > .ps__-list .server-item`,
      )
        ?.map((_, el) =>
          $(el).attr('data-server-id') == `${1}` ? $(el) : null,
        )
        ?.get()[0]
        ?.attr('data-id') || null;

    const {
      data: {link},
    } = await axios.get(`${SRC_AJAX_URL}/v2/episode/sources?id=${serverId}`);
    return link;
  } catch (err) {
    console.log('error', err.message);
  }
}

// await getUrl('jujutsu-kaisen-2nd-season-18413?ep=109315');
