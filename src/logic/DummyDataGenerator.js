export default function dummyDataGenerator(
  updateReadingStateFunction,
  intervalFrequency,
) {
  let intervalFunction;

  function getRandomValue(range, valueToSubtract = 0) {
    return Math.round(Math.random() * range - valueToSubtract);
  }

  function generateDummyReadings() {
    return {
      peep: getRandomValue(10),
      peakPressure: getRandomValue(100, 100),
      patientRate: getRandomValue(220),
      vte: getRandomValue(700),
      inspiratoryTime: getRandomValue(3),
      expiratoryTime: getRandomValue(5).toFixed(1),
      oxygen: getRandomValue(100),
      flow: getRandomValue(30, 10),
    };
  }

  function startGenerating() {
    intervalFunction = setInterval(() => {
      const newReadings = generateDummyReadings();
      updateReadingStateFunction(newReadings);
    }, intervalFrequency);
  }

  function stopGenerating() {
    clearInterval(intervalFunction);
  }

  return {
    startGenerating,
    stopGenerating,
  };
}
