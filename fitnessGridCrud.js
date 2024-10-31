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
    <td class="read-only-cell"><a class="row-remove" href="javascript:void(0);">X</a></td>`;
  prepareRemoveLinks();
}
document.getElementById("add-button").addEventListener("click", addRow);
