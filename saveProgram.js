document.getElementById("save-button").addEventListener("click", (e) => {
  updateParams();
});

function updateParams() {
  if ("URLSearchParams" in window) {
    const searchParams = new URLSearchParams(window.location.search);
    const elements = document.getElementsByTagName("td");

    const content = Array.from(elements).map((e) => e.textContent);
    searchParams.set("workout", content.join("~"));

    const restValue = document.getElementById("rest").value;
    searchParams.set("rest", restValue);

    const rounds = document.getElementById("rounds").value;
    searchParams.set("rounds", rounds);
    var newRelativePathQuery =
      window.location.pathname + "?" + searchParams.toString();

    history.pushState(null, "", newRelativePathQuery);
  }
}

function addRow() {
  const table = document.getElementById("table-body");
  const newRow = table.insertRow();
  newRow.innerHTML = `<td width="80%" contenteditable='true'></td>
      <td contenteditable='true'></td>
      <td class="read-only-cell"><a class="row-remove" href="javascript:void(0);">X</a></td>`;
  prepareRemoveLinks();
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
  document.getElementById("rest").value =
    parseInt(searchParams.get("rest")) || 0;
  document.getElementById("rounds").value =
    parseInt(searchParams.get("rounds")) || 0;
}
readParams();
