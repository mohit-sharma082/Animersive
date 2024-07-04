import axios from 'axios';
import {parseTime} from '.';

function parseCaption(vtt) {
  return vtt
    .split('\n\n')
    .slice(1)
    .map(sub => {
      const [time, ...subs] = sub.split('\n');
      const [from, to] = time.split(' --> ');
      return {
        from: parseTime(from),
        to: parseTime(to),
        time,
        text: subs.join('\n'),
      };
    });
}

async function parseTextTrack(subtitles, lang) {
  try {
    const url = subtitles?.find?.(sub => sub?.lang === lang)?.url;
    if (!url)
      throw new Error(`language ${lang} not found in available subtitles`);
    const {data} = await axios.get(url);
    const parsed = parseCaption(data);
    return parsed;
  } catch (e) {
    console.log(e);
    return null;
  }
}
export default parseTextTrack;
