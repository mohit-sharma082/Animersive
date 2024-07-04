import {ImageBackground} from 'react-native';
import {useProgress} from '../ProgressContext';
import {usePlayer} from '../Context';
import {
  SCREEN_HEIGHT,
  SCREEN_HEIGHT_PERCENTAGE,
  SCREEN_WIDTH,
  SCREEN_WIDTH_PERCENTAGE,
} from '../config';

function getLeftSpacing(currentTime, duration, fullScreen) {
  const width = fullScreen ? SCREEN_HEIGHT : SCREEN_WIDTH;
  const percentage = fullScreen
    ? SCREEN_HEIGHT_PERCENTAGE
    : SCREEN_WIDTH_PERCENTAGE;
  const value = (currentTime / duration) * 100 * percentage - 74;
  return Math.min(Math.max(value, 4), width - 164);
}

const SeekPreview = () => {
  const {
    progress: {thumbnail, currentTime, duration},
  } = useProgress();
  const {state} = usePlayer();
  if (!thumbnail || !state.isSeeking) return null;

  return (
    <ImageBackground
      style={{
        width: 160,
        height: 90,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 40,
        left: getLeftSpacing(currentTime, duration, state.fullscreen),
      }}
      imageStyle={{
        height: 90 * 7,
        width: 160 * 7,
        aspectRatio: 16 / 9,
        transform: [
          {
            translateX: 160 * -thumbnail.tiledDisplay.x,
          },
          {
            translateY: 90 * -thumbnail.tiledDisplay.y,
          },
        ],
      }}
      fadeDuration={0}
      resizeMethod="resize"
      source={thumbnail.source}
    />
  );
};

export default SeekPreview;
