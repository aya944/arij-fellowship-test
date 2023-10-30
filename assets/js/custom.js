$(document).on("click", "#sidenav-close", function (e) {
  $(".header-content").addClass("close-sidenav");
  $("#sidenav-open").addClass("active-open");
  $("#sidenav-close").addClass("remove-close");
});

$(document).on("click", "#sidenav-open", function (e) {
  $(".header-content").removeClass("close-sidenav");
  $("#sidenav-close").removeClass("remove-close");
  $("#sidenav-open").removeClass("active-open");
});

// function myFunction() {
//      var textUser = document.getElementById('user-text').value;
//   }

// const person = {
//     firstName : "John",
//     lastName  : "Doe",
//     age     : 50,
//     eyeColor  : "blue"
//   };

// calculate start/end
//   const startPos = textUser.value.indexOf(word),
//   endPos = startPos + word.length

// const words = textUser.split(" ");

let validationWords = [
  {
    biasedWord: "Policeman",
    alternativeWord: "Police officer",
  },
  {
    biasedWord: "policewoman",
    alternativeWord: "Police officer",
  },
  {
    biasedWord: "man",
    alternativeWord: "test",
  },
];

let boxArrayValidation = [];
document
  .querySelector("#user-text")
  .addEventListener("paste", (e) => handleMainFunctionality(e, true));
document
  .querySelector("#user-text")
  .addEventListener("input", (e) => handleMainFunctionality(e), false);

function handleMainFunctionality(event, isPaste = false) {
  console.log(event, isPaste)
  const inputValue = event.data;
  var textarea = document.querySelector("#user-text");
  if ((inputValue && inputValue.endsWith(" ")) || isPaste) {
    const codeRegex = /[\{\}\[\]\(\)]/;
    // const textNodes = [...textarea.childNodes];
    let textContent = '';
    if(isPaste) {
      textContent = event.clipboardData.getData("text");
    }else {
      textContent = textarea.innerHTML;
    }
    const textareaStr = textContent.replace(/\s+/g, " ").replace(/&nbsp;/g, "");
    console.log("event", event);
    let wordsSplitTexarea = textareaStr.split(" ");
    let inputTextArea = wordsSplitTexarea;
    // textNodes.forEach(node => {
    //   inputTextArea =
    // });
    if (
      inputTextArea.length > 1 ||
      (inputTextArea.length == 1 &&
        !codeRegex.test(inputTextArea[0]) &&
        inputTextArea[0] !== "")
    ) {
      console.log(inputTextArea, "inputtextarea");
      if (!isPaste) {
        inputTextArea.forEach((word, i) => {
          console.log(word, "word", word.length);
          if (
            word.length > 1 &&
            !word.includes("span") &&
            !word.match(/[&<>"'`=\/]/g) && !isPaste
          ) {
            console.log(word);
            handleApiRequest(word).then((res) => {
              let currentInput = res.input.replace(/[\n\s\u0080-\uFFFF]/g, "");
              let revisedInput = res.revised_article.replace(
                /[\n\s\u0080-\uFFFF]/g,
                ""
              );
              if (currentInput.toLowerCase() !== revisedInput.toLowerCase()) {
                inputTextArea[
                  i
                ] = `<span class="error" id="validate-${i}" data-alt="${revisedInput}"  data-biased="${currentInput}" data-clear="${i}">${word}</span>​&nbsp;`;
                boxArrayValidation.push({
                  text: word,
                  id: `validate-${i}`,
                  alt: revisedInput,
                  uid: i,
                });
                var validatedtext = inputTextArea.join(" ");
                document.querySelector("#user-text").innerHTML = validatedtext;
                handleSideValidationBox(boxArrayValidation); // render validation box based on the errors
                setEndOfContenteditable(document.querySelector("#user-text"));
                handleSpanHover(textarea);
              }
            });
          } 
          // for (let num = 0; num < validationWords.length; num++) {
          //   let x = validationWords[num]
          //   if (
          //     word.toLowerCase() === x.biasedWord.toLowerCase() && !word.includes("span")
          //   ) {
          //     console.log(word, "word")
          //     inputTextArea[i] = `<span class="error" id="validate-${i}" data-alt="${x.alternativeWord}"  data-biased="${x.biasedWord}" data-clear="${i}">${word}</span>`;
          //     boxArrayValidation.push({text:word, id:`validate-${i}`, alt: x.alternativeWord, uid:i})
          //     var validatedtext = inputTextArea.join(" ");
          //     document.querySelector("#user-text").innerHTML = validatedtext;
          //     handleSideValidationBox(boxArrayValidation); // render validation box based on the errors
          //     setEndOfContenteditable(document.querySelector("#user-text"));
          //     // removeUnwantedUnicode(document.querySelector("#user-text"));
          //     break;
          //   }
          // };
        });
      }else {
        console.log("heere")
        handleApiRequest(textContent).then((res) => {
          let oldContent = res.input.split(' ');
          let newContent = res.revised_article.split(' ')
          oldContent.forEach((item,i) => {
            let currentInput = item.replace(/[\n\s\u0080-\uFFFF]/g, "");
            let revisedInput = newContent[i].replace(
              /[\n\s\u0080-\uFFFF]/g,
              ""
            );
            if (currentInput.toLowerCase() !== revisedInput.toLowerCase()) {
              inputTextArea[
                i
              ] = `<span class="error" id="validate-${i}" data-alt="${revisedInput}"  data-biased="${currentInput}" data-clear="${i}">${currentInput}</span>​&nbsp;`;
              boxArrayValidation.push({
                text: currentInput,
                id: `validate-${i}`,
                alt: revisedInput,
                uid: i,
              });
              var validatedtext = inputTextArea.join(" ");
              document.querySelector("#user-text").innerHTML = validatedtext;
              handleSideValidationBox(boxArrayValidation); // render validation box based on the errors
              setEndOfContenteditable(document.querySelector("#user-text"));
              handleSpanHover(textarea);
            }
          })
        });
      }
    } else {
      validationBoxRefresh(0, true);
    }
  }
  handlePartialDelete(textarea);
  handleSpanHover(textarea);
}

function setEndOfContenteditable(contentEditableElement) {
  contentEditableElement.focus();
  var range = document.createRange();
  var selection = window.getSelection();
  range.selectNodeContents(contentEditableElement);

  var lastChild = contentEditableElement.lastChild;
  if (
    lastChild &&
    lastChild.nodeType === Node.ELEMENT_NODE &&
    lastChild.tagName.toLowerCase() === "span"
  ) {
    // Insert a zero-width space after the <span> element
    var zeroWidthSpace = document.createTextNode("\u200B");
    range.setStartAfter(lastChild);
    range.insertNode(zeroWidthSpace);
    range.setStartAfter(zeroWidthSpace);
    range.collapse(true);
  } else {
    range.collapse(false); // Collapse to the end
  }

  selection.removeAllRanges();
  selection.addRange(range);

  contentEditableElement.addEventListener("input", function (event) {
    var range = window.getSelection().getRangeAt(0);
    var currentNode = range.startContainer;
    var offset = range.startOffset;

    if (currentNode.nodeType === Node.TEXT_NODE && offset > 0) {
      var prevChar = currentNode.textContent[offset - 1];

      // Check if the previous character is the zero-width space
      if (prevChar === "\u200B") {
        // Move the cursor one position before the zero-width space and delete it
        range.setStart(currentNode, offset - 1);
        range.setEnd(currentNode, offset);
        range.deleteContents();
      }
    }
  });

  contentEditableElement.addEventListener("keyup", function (event) {
    // Check if the key released is the backspace key (keyCode 8 or key "Backspace")
    if (event.keyCode === 8 || event.key === "Backspace") {
      // If the content is empty, set the cursor to the end
      if (contentEditableElement.innerText === "") {
        var range = document.createRange();
        range.selectNodeContents(contentEditableElement);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  });
}

function handleSideValidationBox(items) {
  const target = document.getElementById("suggestions-container");
  target.innerHTML = "";
  let render;
  if (items.length > 0) {
    items.forEach((item) => {
      render = `
          <div class="lyar-box"></div>
          <div class="box-suggestions" data-target="${item.id}" data-alt="${item.alt}" data-clear="${item.uid}">
                            <div class="head-box">
                              <p class="biased-word">
                                <span class="dot"></span>
                                GENDER BIAS
                              </p>
                            </div>
                            <div class="container">
                                <div class="alternative-sec">
                                  <p class="wrong-word">
                                    ${item.text}
                                  </p>
                                  <img alt="arrow icon" src="../assets/img/arrow-error.png">
                                  <p class="alternative-word">
                                    ${item.alt}
                                  </p>
                              </div>
                              <p>
                                Occupational Reference
                              </p>
                              <div class="footer-box">
                                  <div class="col-add-words-btn">
                                      <img alt="icon" src="../assets/img/add.png">
                                      <p>
                                      Suggest
                                      </p>
                                  </div>
                                  <div class="col-delete-words-btn">
                                      <img alt="bin icon" src="../assets/img/bin.png">
                                  </div>
                              </div>
                            </div>
                          </div>
          `;
      target.append(convertStringToHTML(render));
    });
    replaceAddEventListener();
    deleteAddEventListener();
  }
  const suggestionsCount = document.querySelector(
    ".all-suggestions-number .number"
  );
  suggestionsCount.innerHTML = boxArrayValidation.length;
}

const convertStringToHTML = (htmlString) => {
  const parser = new DOMParser();
  const html = parser.parseFromString(htmlString, "text/html");

  return html.body.querySelector(".box-suggestions");
};

function replaceAddEventListener() {
  const buttons = document.querySelectorAll(".col-add-words-btn");
  buttons.forEach((button) => {
    button.addEventListener("click", handleValidationReplacement);
  });
}

function handleValidationReplacement() {
  const isBox = this.closest(".box-suggestions");
  const isTooltip = document.querySelector(".error-box");
  var targetId, targetEle, targetAlt, clearId;
  if (isBox) {
    targetId = isBox.dataset.target;
    targetEle = document.getElementById(targetId);
    targetAlt = isBox.dataset.alt;
    clearId = isBox.dataset.clear;
  } else {
    targetId = isTooltip.dataset.target;
    targetEle = document.getElementById(targetId);
    targetAlt = isTooltip.dataset.alt;
    clearId = isTooltip.dataset.clear;
  }
  targetEle.classList.remove("error");
  targetEle.replaceWith(targetAlt);
  validationBoxRefresh(clearId);
}

function deleteAddEventListener() {
  const buttons = document.querySelectorAll(".col-delete-words-btn");
  buttons.forEach((button) => {
    button.addEventListener("click", handleValidationDelete);
  });
}

function handleValidationDelete() {
  const isBox = this.closest(".box-suggestions");
  const isTooltip = document.querySelector(".error-box");
  var targetId, targetEle, targetAlt, clearId;
  console.log(isBox, "isBox");
  if (isBox) {
    targetId = isBox.dataset.target;
    targetEle = document.getElementById(targetId);
    clearId = isBox.dataset.clear;
  } else {
    targetId = isTooltip.dataset.target;
    targetEle = document.getElementById(targetId);
    clearId = isTooltip.dataset.clear;
  }
  console.log(targetEle);
  targetEle.classList.remove("error");
  console.log(targetEle);
  targetEle.replaceWith(targetEle.innerHTML);
  validationBoxRefresh(clearId);
}

function validationBoxRefresh(clearId, flushAll = false) {
  console.log(flushAll, "flushaalll");
  if (!flushAll) {
    boxArrayValidation = boxArrayValidation.filter((i) => {
      return i.uid !== parseInt(clearId);
    });
  } else {
    boxArrayValidation = [];
  }
  console.log(boxArrayValidation);
  handleSideValidationBox(boxArrayValidation);
}

function handlePartialDelete(parent) {
  parent.querySelectorAll("span").forEach((i) => {
    if (i.dataset.biased) {
      if (i.innerHTML.toLowerCase() !== i.dataset.biased.toLowerCase()) {
        i.replaceWith(i.innerHTML);
        setEndOfContenteditable(document.querySelector("#user-text"));
        validationBoxRefresh(i.dataset.clear);
      }
    }
  });
  // console.log(parent)
  // this.replaceWith(this.innerHTML);
}

function handleSpanHover(parent) {
  console.log(parent)
  let hoverElements = parent && parent.querySelectorAll(".error");
  let boxTooltip = document.querySelector(".error-box");
  console.log(hoverElements, "SAdsa")
  let isHovering = false;
  hoverElements.forEach((i) => {
    i.addEventListener("mouseenter", () => {
      console.log("SAdklsamdlksamdlksa")
      if (isHovering) {
        const hoverElementRect = i.getBoundingClientRect();
        boxTooltip.style.top = `${hoverElementRect.bottom + window.scrollY}px`; // Position the box just below the text
        boxTooltip.style.left = `${hoverElementRect.left}px`;
        boxTooltip.dataset.target = i.id;
        boxTooltip.dataset.alt = i.dataset.alt;
        boxTooltip.dataset.clear = i.dataset.clear;
        boxTooltip.style.display = "block";
      }
    });
    i.addEventListener("mouseleave", () => {
      if (!isMouseOverElement(boxTooltip)) {
        boxTooltip.style.display = "none";
      }
    });
    i.addEventListener("click", (e) => {
      $(".box-suggestions").removeClass("active");
      let ele = document.querySelector(`[data-target="${i.id}"]`);
      ele.classList.add("active");
    });
  });
  // Helper function to check if the mouse is over an element
  function isMouseOverElement(element) {
    const elementRect = element.getBoundingClientRect();
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    return (
      mouseX >= elementRect.left &&
      mouseX <= elementRect.right &&
      mouseY >= elementRect.top &&
      mouseY <= elementRect.bottom
    );
  }

  parent.addEventListener("mouseenter", () => {
    isHovering = true;
  });

  parent.addEventListener("mouseleave", () => {
    isHovering = false;
    boxTooltip.style.display = "none";
  });
}

async function handleApiRequest(word) {
  const response = await fetch("http://3.125.250.102/debias", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ article: word }),
  });
  return await response.json();
}
