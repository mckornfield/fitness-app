document.getElementById("save-button").addEventListener("click", (e) => {
  updateParams();
});

function updateParams() {
  if ("URLSearchParams" in window) {
    const searchParams = new URLSearchParams(window.location.search);
    const elements = document.getElementsByTagName("td");
    const content = Array.from(elements).map((e) => e.textContent);
    console.log(content);
    searchParams.set("workout", content);
    var newRelativePathQuery =
      window.location.pathname + "?" + searchParams.toString();
    history.pushState(null, "", newRelativePathQuery);
  }
}

function readParams() {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.get()
}
