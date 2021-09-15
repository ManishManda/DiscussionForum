var count;
var viewlist = document.getElementById("viewlist");
var commentobj;
var laoding = document.getElementById("loading");

/**
 * getting all comments of all articles using iife
 * @param {function} callback- getArticlelist function
 */

(function (callback) {
  var xhrobj = new XMLHttpRequest();
  xhrobj.open("GET", "http://localhost:3000/comments");
  xhrobj.response = "application/json";
  xhrobj.send();
  viewlist.innerHTML =
    "<center style=margin:200px;font-size:30px>Loading......</center>";
  xhrobj.onreadystatechange = function () {
    //storing all comments of articles in commentobj
    if (this.readyState == 4) {
      viewlist.innerHTML = "";
      if (this.status == 200) {
        commentobj = JSON.parse(xhrobj.response);
        callback();
      } else {
        document.write(
          "<h3>something went wrong......." + "try again after some time</h3>"
        );
      }
    }
  };
})(getArticleList);

/**
 * gets the articles data from database using xhr and html is constucted
 * @param {}
 */

function getArticleList() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:3000/articles");
  xhr.responseType = "json";
  xhr.send();
  viewlist.innerHTML =
    "<center style=margin:200px;font-size:30px>Loading......</center>";
  xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        viewlist.innerHTML = "";
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
      } else {
        document.write(
          "<h3>something went wrong......." + " try after some time</h3>"
        );
      }
    }
  };
}

/**
 *to view article defined at 37 in html
 * @param  {Object} e event object
 * @return {}
 */

function viewArticle(e) {
  console.log(e.target.id);
  if (e.target.tagName == "A")
    window.location.href = "/pages/viewarticle.html?id=" + e.target.id;
}
