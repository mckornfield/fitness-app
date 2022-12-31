document.getElementById("save-button").addEventListener("click", (e) => {
  updateParams();
});

function updateParams() {
  if ("URLSearchParams" in window) {
    const searchParams = new URLSearchParams(window.location.search);
    const elements = document.getElementsByTagName("td");
    const content = Array.from(elements).map((e) => e.textContent);
    console.log(content);
    searchParams.set("workout", content.join("~"));
    var newRelativePathQuery =
      window.location.pathname + "?" + searchParams.toString();
    history.pushState(null, "", newRelativePathQuery);
  }
}

function readParams() {
  const searchParams = new URLSearchParams(window.location.search);
  const workoutAsString = searchParams.get("workout");
  if (!workoutAsString) {
    return;
  }
  const splitWorkout = workoutAsString.split("~");
  // Cheating, based on script import order
  console.log(splitWorkout);

  const removeLinks = document.getElementsByClassName("row-remove");
  Array.from(removeLinks).forEach((e) => e.click());
  for (let i = 0; i * 3 < splitWorkout.length; i++) {
    addRow();
    const elements = document.getElementsByTagName("td");
    const rowIndex = getRowIndex(i);
    const exerciseName = splitWorkout[rowIndex];
    const exerciseTime = splitWorkout[rowIndex + 1];

    elements[rowIndex].textContent = exerciseName;
    elements[rowIndex + 1].textContent = exerciseTime;
  }
}
readParams();
