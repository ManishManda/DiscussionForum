var title = document.getElementById("title");
var editor = document.getElementById("editor");
var urlstring = window.location.search;

/*populating  createarticlepage with existing data for edititng
getting data from DB
*/
if (urlstring != "") {
  var editxhr = new XMLHttpRequest();
  editxhr.open("GET", "http://localhost:3000/articles" + urlstring);
  editxhr.responseType = "json";
  try {
    editxhr.send();
    editxhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          title.value = this.response[0].title;
          editor.innerHTML = this.response[0].content;
          console.log(this.response);
        } else {
          document.write("something went wrong");
          alert("error has occured");
        }
      }
    };
  } catch {
    document.write("error has occured");
  }
}
/**
 * submitting created article and sending data to json-server
 * @param {object} e eventobject of submitbtn of article
 * @return {}
 */
function submitArticle(e) {
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
    var xhr = new XMLHttpRequest();
    var obj = {};
    var date = new Date();
    obj["title"] = title.value;
    obj["content"] = editor.value;
    obj["date"] = date.toDateString();
    if (urlstring != "") {
      xhr.open(
        "put",
        "http://localhost:3000/articles/" + urlstring.substring(4)
      );
    } else {
      xhr.open("post", "http://localhost:3000/articles");
    }
    xhr.setRequestHeader("content-type", "application/json");
    try {
      xhr.send(JSON.stringify(obj));
      xhr.responseType = "json";
      xhr.onload = function () {
        window.location.href =
          "/pages/viewarticle.html?id=" + this.response["id"];
      };
    } catch {
      alert("error has occured");
      document.write("something went wrong");
    }
  }
}
/**
 *function to display no of characters left
 * @param {htmlelement textarea} val
 */
function displayCharacterLeft(val) {
  var characterleftinfo = document.getElementById("characterleft");
  characterleftinfo.textContent =
    "No of characters left -" + (1000 - val.value.length).toString();
}
