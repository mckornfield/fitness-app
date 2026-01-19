document.getElementById("save-button").addEventListener("click", (e) => {
  updateParams();
});

async function compressString(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const stream = new Blob([data]).stream();
  const compressedStream = stream.pipeThrough(new CompressionStream("gzip"));
  const compressedData = await new Response(compressedStream).arrayBuffer();

  // Convert to base64 URL-safe encoding
  const base64 = btoa(String.fromCharCode(...new Uint8Array(compressedData)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function updateParams() {
  if ("URLSearchParams" in window) {
    const searchParams = new URLSearchParams(window.location.search);
    const elements = document.getElementsByTagName("td");

    const content = Array.from(elements).map((e) => e.textContent);
    const workoutString = content.join("~");

    // Compress the workout data
    const compressed = await compressString(workoutString);
    searchParams.set("workout", "c:" + compressed); // "c:" prefix indicates compressed

    const restValue = document.getElementById("rest").value;
    searchParams.set("rest", restValue);

    const rounds = document.getElementById("rounds").value;
    searchParams.set("rounds", rounds);
    var newRelativePathQuery =
      window.location.pathname + "?" + searchParams.toString();

    history.pushState(null, "", newRelativePathQuery);
    updatePageTitle();
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

function updatePageTitle() {
  const tableBody = document.getElementById("table-body");
  const rows = tableBody.getElementsByTagName("tr");

  if (rows.length === 0) {
    document.title = "MattK's Workout App";
    return;
  }

  const exerciseNames = [];
  for (let i = 0; i < Math.min(3, rows.length); i++) {
    const cells = rows[i].getElementsByTagName("td");
    if (cells.length > 0 && cells[0].textContent.trim()) {
      exerciseNames.push(cells[0].textContent.trim());
    }
  }

  if (exerciseNames.length > 0) {
    document.title = exerciseNames.join(", ");
    if (rows.length > 3) {
      document.title += ", ...";
    }
  } else {
    document.title = "MattK's Workout App";
  }
}

async function decompressString(compressedBase64) {
  // Convert base64 URL-safe back to regular base64
  const base64 = compressedBase64.replace(/-/g, '+').replace(/_/g, '/');
  // Pad with = if needed
  const padded = base64 + '=='.substring(0, (4 - base64.length % 4) % 4);

  const binaryString = atob(padded);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const stream = new Blob([bytes]).stream();
  const decompressedStream = stream.pipeThrough(new DecompressionStream("gzip"));
  const decompressedData = await new Response(decompressedStream).arrayBuffer();
  const decoder = new TextDecoder();
  return decoder.decode(decompressedData);
}

function populateWorkoutTable(workoutAsString) {
  const splitWorkout = workoutAsString.split("~");
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

async function readParams() {
  const searchParams = new URLSearchParams(window.location.search);
  const workoutParam = searchParams.get("workout");
  if (!workoutParam) {
    return;
  }

  let workoutAsString;

  // Check if data is compressed (starts with "c:" prefix)
  if (workoutParam.startsWith("c:")) {
    try {
      const compressed = workoutParam.substring(2); // Remove "c:" prefix
      workoutAsString = await decompressString(compressed);
    } catch (error) {
      console.error("Failed to decompress workout data, falling back to uncompressed:", error);
      // Fallback to treating it as uncompressed
      workoutAsString = workoutParam;
    }
  } else {
    // Old uncompressed format
    workoutAsString = workoutParam;
  }

  populateWorkoutTable(workoutAsString);

  document.getElementById("rest").value =
    parseInt(searchParams.get("rest")) || 0;
  document.getElementById("rounds").value =
    parseInt(searchParams.get("rounds")) || 0;
  updatePageTitle();
}
readParams();
