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
    if (elements.length < index * 2) {
        alert("Workout over!")
        exerciseTracker.index = 0
        exerciseTracker.exerciseTimeLimit = 0
        clearInterval(exerciseTracker.intervalId)
    }
    const exerciseName = elements[index * 2].textContent
    const exerciseTimeLimit = elements[index * 2 + 1].textContent
    if (isNaN(exerciseTimeLimit) || isNaN(parseFloat(exerciseTimeLimit))) {
        alert(`The time in seconds for exercise '${exerciseName}' is not a number, got '${exerciseTimeLimit}'`)
        clearInterval(exerciseTracker.intervalId)
    }
    exerciseTracker.exerciseName = exerciseName
    exerciseTracker.exerciseTimeLimit = parseFloat(exerciseTimeLimit)
    exerciseTracker.timeInExercise = 0
}

function advanceTimer() {
    exerciseTracker.timePassed++
    exerciseTracker.timeInExercise++
    // Get next exercise
    if (exerciseTracker.timeInExercise > exerciseTracker.exerciseTimeLimit) {
        exerciseTracker.index++
        updateExercise(exerciseTracker.index)
    }
    console.log(exerciseTracker)
}

document.getElementById("play-button").addEventListener("click", () => {
    if (exerciseTracker.intervalId) {
        clearInterval(exerciseTracker.intervalId)
        exerciseTracker.intervalId = null
    } else {
        if (exerciseTracker.exercise == null) {
            updateExercise(0)
        }
        exerciseTracker.intervalId = setInterval(advanceTimer, 1000)
    }
})

document.getElementById("edit-button").addEventListener("click", () => {
    const elements = document.getElementsByTagName("td")
    Array.from(elements).forEach(e => {
        console.log(e.contentEditable)
        e.contentEditable = e.contentEditable == "true" ? "false" : "true"
        console.log(e.contentEditable)
    })
})
