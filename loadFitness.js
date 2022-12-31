const exerciseTracker = {
  index: 0,
  exerciseName: null,
  exerciseTimeLimit: 0,
  timeInExercise: 0,
  timePassed: 0,
  intervalId: null,
};

function say(text) {
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}
function updateExercise(index) {
  const elements = document.getElementsByTagName("td");
  const rowIndex = index * 3;
  if (elements.length < rowIndex) {
    clearInterval(exerciseTracker.intervalId);
    const WORKOUT_FINISHED = "Workout over!";
    say(WORKOUT_FINISHED);
    exerciseTracker.index = 0;
    exerciseTracker.exerciseTimeLimit = 0;
    alert(WORKOUT_FINISHED);
    return false;
  }
  const exerciseName = elements[rowIndex].textContent;
  const exerciseTimeLimit = elements[rowIndex + 1].textContent;
  if (isNaN(exerciseTimeLimit) || isNaN(parseFloat(exerciseTimeLimit))) {
    alert(
      `The time in seconds for row ${
        index + 1
      } exercise '${exerciseName}' is not a number, got '${exerciseTimeLimit}'`
    );
    clearInterval(exerciseTracker.intervalId);
    return false;
  }
  exerciseTracker.exerciseName = exerciseName;
  exerciseTracker.exerciseTimeLimit = parseFloat(exerciseTimeLimit);
  exerciseTracker.timeInExercise = 0;
  document.getElementById("current-workout").innerText = exerciseName;
  document.getElementById("time-left").innerText = `${exerciseTimeLimit}s`;
  say(exerciseName);
  return true;
}

function advanceTimer() {
  exerciseTracker.timePassed++;
  exerciseTracker.timeInExercise++;
  const { exerciseTimeLimit, timeInExercise } = exerciseTracker;

  const timeLeft = parseInt(exerciseTimeLimit - timeInExercise);
  if (timeLeft < 0) {
    return;
  }
  document.getElementById("time-left").innerText = `${timeLeft}s`;
  // Get next exercise

  if (timeLeft < 4 && timeLeft > 0) {
    say(timeLeft);
  }
  if (timeLeft == 0) {
    new Audio("beep.mp3").play();
  }
  if (timeInExercise >= exerciseTracker.exerciseTimeLimit) {
    exerciseTracker.index++;
    updateExercise(exerciseTracker.index);
  }
}

document.getElementById("play-button").addEventListener("click", (e) => {
  if (exerciseTracker.intervalId) {
    clearInterval(exerciseTracker.intervalId);
    exerciseTracker.intervalId = null;
  } else {
    let startSucceeded = false;
    if (exerciseTracker.exercise == null) {
      startSucceeded = updateExercise(0);
    }
    if (startSucceeded) {
      exerciseTracker.intervalId = setInterval(advanceTimer, 1000);
    }
  }
});
