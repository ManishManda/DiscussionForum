var count;
var viewlist = document.getElementById("viewlist");
var commentobj;

//getting all comments of all articles using iife
(function (callback) {
  var xhrobj = new XMLHttpRequest();
  xhrobj.open("GET", "http://localhost:3000/comments");
  xhrobj.response = "application/json";
  xhrobj.send();
  xhrobj.onload = function () {
    //storing all comments of articles in commentobj
    commentobj = JSON.parse(xhrobj.response);
    callback();
  };
})(getArticleList);

//gets the articles data from db
function getArticleList() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:3000/articles");
  xhr.responseType = "json";
  xhr.send();
  xhr.onload = function () {
    console.log(this.response);
    for (var obj of this.response) {
      count = 0;
      //looping through get count of comments of a specific article
      for (var i of commentobj) {
        num = Number.parseInt(i.userId);
        if (num == obj.id) {
          count++;
        }
      }
      viewlist.innerHTML +=
        "<div class='articlediv'>" +
        "<div class='articledata' onclick=viewArticle(event) id=" +
        obj.id +
        ">" +
        "<a href=# id=" +
        obj.id +
        ">" +
        obj.title +
        "</a >" +
        "<p>" +
        obj.content +
        "</p>" +
        "</div>" +
        "<div class='commentdiv'>" +
        "<img src='css/resources/img/comment.png' id=" +
        obj.id +
        "/>" +
        "<sup><b>" +
        count +
        "</b></sup>" +
        "</div>";
    }
  };
  xhr.onerror = function (error) {
    viewlist.write("Data not found" + error);
  };
}

//to view article defined at 37
function viewArticle(e) {
  console.log(e.target.id);
  if (e.target.tagName == "A")
    window.location.href = "/pages/viewarticle.html?id=" + e.target.id;
}
