let exerciseTracker = {
  index: 0,
  exerciseName: null,
  exerciseTimeLimit: 0,
  timeInExercise: 0,
  timePassed: 0,
  intervalId: null,
  inRest: true,
  roundNumber: 1,
};

const exerciseReset = structuredClone(exerciseTracker);

const REST_NAME = "Rest";

let wakeLock = null;

function say(text) {
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

function getRowIndex(index) {
  return index * 3; // Number of columns
}

function updateExercise(index) {
  const elements = document.getElementsByTagName("td");
  const rowIndex = getRowIndex(index);
  if (rowIndex >= elements.length) {
    return false;
  }
  let exerciseName = elements[rowIndex].textContent;
  let exerciseTimeLimit = elements[rowIndex + 1].textContent;
  if (isNaN(exerciseTimeLimit) || isNaN(parseFloat(exerciseTimeLimit))) {
    alert(
      `The time in seconds for row ${
        index + 1
      } exercise '${exerciseName}' is not a number, got '${exerciseTimeLimit}'`
    );
    clearInterval(exerciseTracker.intervalId);
    return false;
  }
  const restValue = parseInt(document.getElementById("rest").value);
  // Perform rest conditionally
  if (!exerciseTracker.inRest && restValue > 0) {
    exerciseName = REST_NAME;
    exerciseTimeLimit = restValue;
  }
  exerciseTracker.exerciseName = exerciseName;
  exerciseTracker.exerciseTimeLimit = parseFloat(exerciseTimeLimit);
  exerciseTracker.timeInExercise = 0;

  // Update display
  document.getElementById("current-workout").innerText = exerciseName;
  document.getElementById("time-left").innerText = `${exerciseTimeLimit}s`;

  const numRounds = getNumRounds();
  if (numRounds > 0) {
    document.getElementById(
      "round-counter"
    ).innerText = `(Round ${exerciseTracker.roundNumber}/${numRounds})`;
  }
  say(exerciseName);
  exerciseTracker.inRest = !exerciseTracker.inRest;
  return exerciseName != REST_NAME;
}

function clearWakeLock() {
  if (wakeLock) {
    wakeLock.release().then(() => {
      wakeLock = null;
      console.log("released lock!");
    });
  }
}

function countDownTimer() {
  if (exerciseTracker.index == -1) {
    return;
  }
  exerciseTracker.timePassed++;
  exerciseTracker.timeInExercise++;
  const { exerciseTimeLimit, timeInExercise } = exerciseTracker;

  const timeLeft = parseInt(exerciseTimeLimit - timeInExercise);
  if (timeLeft < 0) {
    return;
  }
  document.getElementById("time-left").innerText = `${timeLeft}s`;

  // Say every multiple of 30, and 2,1, but not 0
  if ((timeLeft % 30 == 0 || timeLeft < 3) && timeLeft > 0) {
    say(timeLeft);
  }
}

function getNumRounds() {
  const numRounds = parseInt(document.getElementById("rounds").value);
  return numRounds || 0;
}

function advanceTimer() {
  //  if (!document.hasFocus()) {
  //    return;
  //  }
  countDownTimer();
  if (exerciseTracker.timeInExercise >= exerciseTracker.exerciseTimeLimit) {
    const shouldAdvance = updateExercise(exerciseTracker.index + 1);
    if (shouldAdvance) {
      exerciseTracker.index++;
    }
    const elements = document.getElementsByTagName("td");
    const rowIndex = getRowIndex(exerciseTracker.index + 1);
    console.log(exerciseTracker);
    if (!shouldAdvance && rowIndex >= elements.length) {
      const numRounds = getNumRounds();
      if (numRounds > 0 && numRounds > exerciseTracker.roundNumber) {
        say(`Round ${exerciseTracker.roundNumber} Done`);
        exerciseTracker.roundNumber = exerciseTracker.roundNumber + 1;
        // Sentinel value to indicate we need to restart
        exerciseTracker.index = -1;
        exerciseTracker.timeInExercise = -1;
        exerciseTracker.exerciseTimeLimit = -1;
        exerciseTracker.inRest = true;
        return;
      }
      clearInterval(exerciseTracker.intervalId);
      const WORKOUT_FINISHED = "Workout over!";
      say(WORKOUT_FINISHED);
      reset();
      document.getElementById("play-button").innerText = "Play";
      clearWakeLock();
    }
  }
}

function reset() {
  clearInterval(exerciseTracker.intervalId);
  exerciseTracker = structuredClone(exerciseReset);

  document.getElementById("current-workout").innerText = "";
  document.getElementById("time-left").innerText = "";
  document.getElementById("play-button").innerText = "Play";
  document.getElementById("round-counter").innerText = "";
}

document.getElementById("reset-button").addEventListener("click", reset);

document.getElementById("play-button").addEventListener("click", (e) => {
  clearWakeLock();
  if (e.target.innerText == "Play") {
    e.target.innerText = "Pause";
    wakeLock = navigator.wakeLock.request("screen").then((newWakeLock) => {
      wakeLock = newWakeLock;
      console.log("lock acquired!");
    });
  } else {
    e.target.innerText = "Play";
  }
  if (exerciseTracker.intervalId) {
    clearInterval(exerciseTracker.intervalId);
    exerciseTracker.intervalId = null;
  } else {
    let startSucceeded = false;
    if (exerciseTracker.exerciseName == null) {
      startSucceeded = updateExercise(0);
    } else {
      startSucceeded = true;
    }
    if (startSucceeded) {
      exerciseTracker.intervalId = setInterval(advanceTimer, 1000);
    }
  }
});
