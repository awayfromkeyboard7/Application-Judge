const codeForm = document.querySelector("#codeForm");
const codetext = document.querySelector("#code");
const language = document.querySelector("#lang");
const problem = document.querySelector("#problemId");
const user = document.querySelector("#user");
const result = document.querySelector("#result");
// const output = document.querySelector("#output");

const HIDDEN_CLASSNAME = "hidden";

function codeSubmit(event) {
  event.preventDefault();
  const code = codetext.value;
  const lang = language.value;
  const problemId = problem.value;
  const userId = user.value;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/judge", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
      userId,
      problemId,
      lang,
      code
  }));
  
  xhr.onload = function() {
    const tf = this.responseText;
    console.log('tf', tf);
    if (tf.success === true) {
      result.innerText = "Success";
      result.style.color = "Green";
      result.classList.toggle(HIDDEN_CLASSNAME);
    } else {
      result.innerText = tf;
      result.style.color = "Red";
      result.classList.toggle(HIDDEN_CLASSNAME);
    }
  };
}

codeForm.addEventListener("submit", codeSubmit);