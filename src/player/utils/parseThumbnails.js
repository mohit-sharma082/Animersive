import axios from 'axios';
import {parseTime} from '.';

const getEndpoint = url => {
  const splits = url.split('/');
  splits.pop();
  return splits.join('/') + '/';
};

const parseVtt = (rawText, endpoint) => {
  let linesArr = [];
  linesArr = rawText
    .split('\n')
    .map(v => v.trim()) // remove space each of line
    .filter(v => !!v); // filter not space

  // remove header 'WEBVTT'
  if (linesArr[0] == 'WEBVTT') linesArr.shift();

  let data = [];
  let lineIndex = 0;

  while (lineIndex < linesArr.length) {
    const spliterTime = ' --> ';
    const id = linesArr[lineIndex];
    const start = parseTime(linesArr[lineIndex + 1].split(spliterTime)[0]);
    const end = parseTime(linesArr[lineIndex + 1].split(spliterTime)[1]);
    const content = endpoint + linesArr[lineIndex + 2];

    if (start < 0 || end < 0) throw 'cannot convert start time or end time';

    data.push({
      id,
      start,
      end,
      content,
    });
    lineIndex += 3;
  }

  return data;
};

async function parseThumbnails(subtitles) {
  try {
    const url = subtitles?.find?.(sub => sub?.lang === 'Thumbnails')?.url;
    if (!url) throw new Error('Thumbnails not available');
    const {data: VTT} = await axios.get(url);
    const endpoint = getEndpoint(url);
    const thumbnails = parseVtt(VTT, endpoint);
    return thumbnails;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export default parseThumbnails;
