document.getElementById("edit-button").addEventListener("click", () => {
  const elements = document.getElementsByTagName("td");
  Array.from(elements).forEach((e) => {
    if (e.className != "read-only-cell") {
      e.contentEditable = e.contentEditable == "true" ? "false" : "true";
    }
  });
  const addButton = document.getElementById("add-button");
  if (addButton.style.display == "none") {
    addButton.style.display = "";
  } else {
    addButton.style.display = "none";
  }
  const removeRowElements = document.getElementsByClassName("row-remove");
  Array.from(removeRowElements).forEach((e) => {
    if (e.style.display == "none") {
      e.style.display = "block";
    } else {
      e.style.display = "none";
    }
  });
});

function prepareRemoveLinks() {
  const removeLinks = document.getElementsByClassName("row-remove");
  Array.from(removeLinks).forEach((link) =>
    link.addEventListener("click", (e) => {
      const rowToRemove = e.target.parentElement.parentElement;
      document.getElementById("table-body").removeChild(rowToRemove);
    })
  );
}

prepareRemoveLinks();

function addRow() {
  const table = document.getElementById("table-body");
  const newRow = table.insertRow();
  newRow.innerHTML = `<td width="80%" contenteditable='true'></td>
    <td contenteditable='true'></td>
    <td class="read-only-cell"><a class="row-remove" href="javascript:void(0);">❌</a></td>`;
  prepareRemoveLinks();
}
document.getElementById("add-button").addEventListener("click", addRow);

// Bulk Edit functionality
let isBulkEditMode = false;

function tableToBulkEdit() {
  const tbody = document.getElementById("table-body");
  const rows = tbody.getElementsByTagName("tr");
  const lines = [];

  for (let row of rows) {
    const cells = row.getElementsByTagName("td");
    const exerciseName = cells[0].textContent.trim();
    const duration = cells[1].textContent.trim();
    lines.push(`${exerciseName} ${duration}`);
  }

  return lines.join("\n");
}

function bulkEditToTable(text) {
  const lines = text.trim().split("\n");
  const tbody = document.getElementById("table-body");

  // Clear existing rows
  const removeLinks = document.getElementsByClassName("row-remove");
  Array.from(removeLinks).forEach((e) => e.click());

  // Track last valid duration to use as placeholder
  let lastValidDuration = "30";

  // Add new rows from bulk edit
  for (let line of lines) {
    if (line.trim() === "") continue;

    // Find the last space to split exercise name and duration
    const lastSpaceIndex = line.lastIndexOf(" ");
    let exerciseName, duration;

    if (lastSpaceIndex === -1) {
      // No space found, treat entire line as exercise name
      exerciseName = line.trim();
      duration = lastValidDuration;
    } else {
      exerciseName = line.substring(0, lastSpaceIndex).trim();
      const durationPart = line.substring(lastSpaceIndex + 1).trim();
      // Check if duration is a valid number
      if (isNaN(durationPart) || durationPart === "") {
        exerciseName = line;
        duration = lastValidDuration;
      } else {
        exerciseName = line.substring(0, lastSpaceIndex).trim();
        duration = durationPart;
        // Update last valid duration for future rows
        lastValidDuration = duration;
      }
    }

    // Add the row
    addRow();
    const elements = document.getElementsByTagName("td");
    const lastRowIndex = elements.length - 3; // Last row's first cell
    elements[lastRowIndex].textContent = exerciseName;
    elements[lastRowIndex + 1].textContent = duration;
  }
}

function toggleBulkEdit() {
  const table = document.getElementById("exercise-table");
  const textarea = document.getElementById("bulk-edit-textarea");
  const editButton = document.getElementById("edit-button");
  const addButton = document.getElementById("add-button");
  const saveButton = document.getElementById("save-button");
  const bulkEditButton = document.getElementById("bulk-edit-button");

  if (!isBulkEditMode) {
    // Switch to bulk edit mode
    const bulkText = tableToBulkEdit();
    textarea.value = bulkText;

    table.style.display = "none";
    textarea.style.display = "block";
    editButton.style.display = "none";
    addButton.style.display = "none";
    saveButton.style.display = "none";
    bulkEditButton.textContent = "Table View";

    isBulkEditMode = true;
  } else {
    // Switch back to table mode
    const bulkText = textarea.value;
    bulkEditToTable(bulkText);

    table.style.display = "table";
    textarea.style.display = "none";
    editButton.style.display = "";
    addButton.style.display = "none"; // Keep hidden per normal mode
    saveButton.style.display = "";
    bulkEditButton.textContent = "Bulk Edit";

    isBulkEditMode = false;
  }
}

document.getElementById("bulk-edit-button").addEventListener("click", toggleBulkEdit);
