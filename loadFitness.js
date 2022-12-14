document.getElementById("play-button").addEventListener("click", () => {
    const words = document.getElementById("stuff-to-say").textContent
    const utterance = new SpeechSynthesisUtterance(words);
    speechSynthesis.speak(utterance);
})