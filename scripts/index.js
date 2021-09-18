var count;
var viewlist = document.getElementById("viewlist");
var commentobj;
var laoding = document.getElementById("#load");

/**
 * getting all comments of all articles using iife
 * @param {function} callback- getArticlelist function
 */
window.onload = () => {
  var xhrobj = new XMLHttpRequest();
  xhrobj.open("GET", "http://localhost:3000/comments");
  xhrobj.response = "application/json";
  xhrobj.send();
  viewlist.innerHTML =
    "<center style=margin:200px;font-size:30px>Loading......</center>";
  xhrobj.onreadystatechange = function () {
    //storing all comments of articles in commentobj
    if (xhrobj.readyState == 4) {
      viewlist.innerHTML = "";
      if (xhrobj.status == 200) {
        commentobj = JSON.parse(xhrobj.response);
        getArticleList();
      } else {
        document.write(
          "<h3>something went wrong......." + "try again after some time</h3>"
        );
      }
    }
  };
};

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
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        if (xhr.response != "") {
          viewlist.innerHTML = "";
          for (var obj of xhr.response) {
            //looping through get count of comments of a specific article
            var count = commentobj
              .map((element) => {
                num = Number.parseInt(element.userId);
                return num;
              })
              .filter((num) => {
                return num == obj.id;
              });
            console.log(count.length);
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
              count.length +
              "</b></sup>" +
              "</div>";
          }
        } else {
          alert("Create New Article");
          viewlist.innerHTML =
            "<center style=margin:200px;font-size:30px>No articles Found......</center>";
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
