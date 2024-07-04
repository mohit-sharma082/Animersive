export default function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const formattedHours = hrs > 0 ? `${hrs < 10 ? '0' : ''}${hrs}:` : '';
  const formattedMinutes = `${mins < 10 ? '0' : ''}${mins}`;
  const formattedSeconds = `${secs < 10 ? '0' : ''}${secs}`;

  return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
}
