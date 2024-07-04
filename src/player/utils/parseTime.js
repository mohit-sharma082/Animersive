function parseTime(timeString) {
  let totalSeconds = 0;

  const timeParts = timeString.split(':').map(parseFloat);
  const hasHours = timeParts.length === 3;

  if (hasHours) {
    totalSeconds += timeParts[0] * 3600; // hours to seconds
    totalSeconds += timeParts[1] * 60; // minutes to seconds
    const [secondsPart, millisecondsPart] = timeParts[2].toString().split('.');
    totalSeconds += parseFloat(secondsPart);
    if (millisecondsPart) {
      totalSeconds += parseFloat(`0.${millisecondsPart}`);
    }
  } else {
    const [minutes, seconds] = timeParts;
    const [secondsPart, millisecondsPart] = seconds.toString().split('.');
    totalSeconds += minutes * 60 + parseFloat(secondsPart);
    if (millisecondsPart) {
      totalSeconds += parseFloat(`0.${millisecondsPart}`);
    }
  }

  return totalSeconds;
}
export default parseTime;
