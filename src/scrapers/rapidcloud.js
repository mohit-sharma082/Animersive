import axios from 'axios';
import CryptoJS from 'crypto-js';
import cheerio from 'cheerio';
import { URL } from 'react-native-url-polyfill';

function substringAfter(str, toFind) {
  const index = str.indexOf(toFind);
  return index == -1 ? '' : str.substring(index + toFind.length);
}

function substringBefore(str, toFind) {
  const index = str.indexOf(toFind);
  return index == -1 ? '' : str.substring(0, index);
}

// https://megacloud.tv/embed-2/e-1/IxJ7GjGVCyml?k=1
class RapidCloud {
  serverName = 'RapidCloud';
  sources = [];

  // https://rapid-cloud.co/embed-6/eVZPDXwVfrY3?vast=1
  fallbackKey = 'c1d17096f2ca11b7';
  host = 'https://rapid-cloud.co';

  async extract(videoUrl) {
    const result = {
      sources: [],
      subtitles: [],
    };

    try {
      const id = videoUrl.href.split('/').pop()?.split('?')[0];
      console.log(`IS THE ERROR HERE  ~ `, videoUrl?.hostname, videoUrl , id)
      const options = {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      };

      let res = null;

      res = await axios.get(
        `https://${videoUrl.hostname}/embed-2/ajax/e-1/getSources?id=${id}`,
        options,
      );

      let {
        data: { sources, tracks, intro, encrypted },
      } = res;

      let decryptKey = await (
        await axios.get(
          'https://raw.githubusercontent.com/theonlymo/keys/e1/key',
        )
      ).data;

      decryptKey = substringBefore(
        substringAfter(decryptKey, '"blob-code blob-code-inner js-file-line">'),
        '</td>',
      );

      if (!decryptKey) {
        decryptKey = await (
          await axios.get(
            'https://raw.githubusercontent.com/theonlymo/keys/e1/key',
          )
        ).data;
      }

      if (!decryptKey) decryptKey = this.fallbackKey;

      try {
        if (encrypted) {
          const sourcesArray = sources.split('');
          let extractedKey = '';
          let currentIndex = 0;

          for (const index of decryptKey) {
            const start = index[0] + currentIndex;
            const end = start + index[1];

            for (let i = start; i < end; i++) {
              extractedKey += res.data.sources[i];
              sourcesArray[i] = '';
            }
            currentIndex += index[1];
          }

          decryptKey = extractedKey;
          sources = sourcesArray.join('');
          console.log(`~~~~~~~~~~~~~~~~~~~`);
          // console.log(`Before going to decrypt : `, sources, decryptKey, typeof sources, typeof decryptKey);

          const decrypt = CryptoJS.AES.decrypt(sources, decryptKey)
          console.log({ decrypt })
          sources = JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
        }
      } catch (err) {
        console.log(err.message);
        throw new Error('Cannot decrypt sources. Perhaps the key is invalid.');
      }

      this.sources = sources?.map(s => ({
        url: s.file,
        isM3U8: s.file.includes('.m3u8'),
      }));

      result.sources.push(...this.sources);

      if (videoUrl.href.includes(new URL(this.host).host)) {
        result.sources = [];
        this.sources = [];

        for (const source of sources) {
          const { data } = await axios.get(source.file, options);
          const m3u8data = data
            .split('\n')
            .filter(
              line => line.includes('.m3u8') && line.includes('RESOLUTION='),
            );

          const secondHalf = m3u8data.map(line =>
            line.match(/RESOLUTION=.*,(C)|URI=.*/g)?.map(s => s.split('=')[1]),
          );

          const TdArray = secondHalf.map(s => {
            const f1 = s[0].split(',C')[0];
            const f2 = s[1].replace(/"/g, '');

            return [f1, f2];
          });

          for (const [f1, f2] of TdArray) {
            this.sources.push({
              url: `${source.file?.split('master.m3u8')[0]}${f2.replace(
                'iframes',
                'index',
              )}`,
              quality: f1.split('x')[1] + 'p',
              isM3U8: f2.includes('.m3u8'),
            });
          }
          result.sources.push(...this.sources);
        }
        if (intro?.end > 1) {
          result.intro = {
            start: intro.start,
            end: intro.end,
          };
        }
      }

      result.sources.push({
        url: sources[0].file,
        isM3U8: sources[0].file.includes('.m3u8'),
        quality: 'auto',
      });

      result.subtitles = tracks
        .map(s =>
          s.file ? { url: s.file, lang: s.label ? s.label : 'Thumbnails' } : null,
        )
        .filter(s => s);

      return result;
    } catch (err) {
      console.log(`RAPID CLOUD ERROR ~~>`,err);
      throw err;
      console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n\n`);
    }
  }
}
export default RapidCloud;

