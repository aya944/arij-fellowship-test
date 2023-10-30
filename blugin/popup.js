document.addEventListener("DOMContentLoaded", function () {
    const changeColorButton = document.getElementById("changeColorButton");
  
    changeColorButton.addEventListener("click", function () {
      const randomColor = getRandomColor();
      chrome.tabs.executeScript({
        code: `document.body.style.backgroundColor = '${randomColor}';`
      });
    });
  });
  
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }