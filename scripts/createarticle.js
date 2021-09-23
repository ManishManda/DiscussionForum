var title = document.getElementById("title");
var editor = document.getElementById("editor");
var urlstring = window.location.search;
var formarticle = document.getElementById("articleform");

/*populating  createarticlepage with existing data for edititng
getting data from DB
*/
if (urlstring != "") {
  var requestOptions = {
    method: "GET",
  };
  fetch("http://localhost:3000/articles" + urlstring, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      title.value = result[0].title;
      editor.innerHTML = result[0].content;
    })
    .catch(() => document.write("something went wrong"));
}
/**
 * submitting created article and sending data to json-server
 * @param {object} e eventobject of submitbtn of article
 * @return {}
 */
formarticle.addEventListener("submit", (e) => {
  e.preventDefault();
  //selecting span element for displaying info
  var titleinfo = document.getElementById("titlerequired");
  var bodyinfo = document.getElementById("bodyrequired");
  if (title.value.trim() == "") {
    titleinfo.innerHTML = "<br>**required";
  }
  if (editor.value.trim() == "") {
    bodyinfo.innerHTML = "<br>**required";
  } else {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify(obj);
    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
    };
    var obj = {};
    var date = new Date();
    obj["title"] = title.value;
    obj["content"] = editor.value;
    obj["date"] = date.toDateString();
    if (urlstring != "") {
      var url = "http://localhost:3000/articles/" + urlstring.substring(4);
    } else {
      url = "http://localhost:3000/articles";
    }
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        window.location.href =
          "/pages/viewarticle.html?id=" + result.response["id"];
      });
  }
});
/**
 *function to display no of characters left
 * @param {htmlelement textarea} val
 */
editor.addEventListener("keyup", () => {
  var characterleftinfo = document.getElementById("characterleft");
  characterleftinfo.textContent =
    "No of characters left -" + (1000 - editor.value.length).toString();
});
