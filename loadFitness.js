const exerciseTracker = {
    index: 0,
    exerciseName: null,
    exerciseTimeLimit: 0,
    timeInExercise: 0,
    timePassed: 0,
    intervalId: null,
}

function updateExercise(index) {
    const elements = document.getElementsByTagName("td")
    const rowIndex = index * 3
    if (elements.length < rowIndex) {
        clearInterval(exerciseTracker.intervalId)
        const WORKOUT_FINISHED = "Workout over!"
        window.speechSynthesis.speak(WORKOUT_FINISHED)
        exerciseTracker.index = 0
        exerciseTracker.exerciseTimeLimit = 0
        alert(WORKOUT_FINISHED)
        return false
    }
    const exerciseName = elements[rowIndex].textContent
    const exerciseTimeLimit = elements[rowIndex + 1].textContent
    if (isNaN(exerciseTimeLimit) || isNaN(parseFloat(exerciseTimeLimit))) {
        alert(`The time in seconds for row ${index + 1} exercise '${exerciseName}' is not a number, got '${exerciseTimeLimit}'`)
        clearInterval(exerciseTracker.intervalId)
        return false
    }
    exerciseTracker.exerciseName = exerciseName
    exerciseTracker.exerciseTimeLimit = parseFloat(exerciseTimeLimit)
    exerciseTracker.timeInExercise = 0
    document.getElementById("current-workout").innerText = exerciseName
    document.getElementById("time-left").innerText = `${exerciseTimeLimit}s`
    return true
}

function advanceTimer() {
    exerciseTracker.timePassed++
    exerciseTracker.timeInExercise++
    const { exerciseTimeLimit, timeInExercise } = exerciseTracker
    document.getElementById("time-left").innerText = `${exerciseTimeLimit - timeInExercise}s`
    // Get next exercise
    if (timeInExercise >= exerciseTracker.exerciseTimeLimit) {
        exerciseTracker.index++
        updateExercise(exerciseTracker.index)
    }
    console.log(exerciseTracker)
}

document.getElementById("play-button").addEventListener("click", (e) => {
    if (exerciseTracker.intervalId) {
        clearInterval(exerciseTracker.intervalId)
        exerciseTracker.intervalId = null
    } else {
        let startSucceeded = false
        if (exerciseTracker.exercise == null) {
            startSucceeded = updateExercise(0)
        }
        if (startSucceeded) {
            exerciseTracker.intervalId = setInterval(advanceTimer, 1000)
        }
    }
})
