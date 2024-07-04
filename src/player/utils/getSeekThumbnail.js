const xyConvert = v => {
  const imageAndPosition = v.content.split('#xywh=');
  const xywh = imageAndPosition[1].split(',').map(v => Number(v));
  const width = xywh[2];
  const height = xywh[3];
  const x = ~~(xywh[0] / width);
  const y = ~~(xywh[1] / height);
  return {x, y};
};

const getSeekThumbnail = (currentTime, previewData) => {
  try {
    for (let v of previewData) {
      if (~~currentTime >= v.start && ~~currentTime < v.end) {
        return {
          source: {
            uri: v.content,
          },
          tiledDisplay: xyConvert(v),
        };
      }
    }

    if (currentTime === previewData?.length - 1) {
      return {
        source: {
          uri: previewData[currentTime].content,
        },
        tiledDisplay: xyConvert(previewData[currentTime]),
      };
    }
  } catch {}
  return null;
};

export default getSeekThumbnail;
