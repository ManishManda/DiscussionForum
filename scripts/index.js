var count;
var viewlist = document.getElementById("viewlist");
var commentobj;
var laoding = document.getElementById("#load");

/**
 * getting all comments of all articles using iife
 * @param {function} callback- getArticlelist function
 */
window.onload = () => {
  viewlist.innerHTML =
    "<center><h3 style=padding-top:200px>Loading.....</h3></center>";
  var requestOptions = {
    method: "GET",
  };
  fetch("http://localhost:3000/comments", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      commentobj = result;
      console.log(commentobj);
    })
    .then(getArticleList());
};

/**
 * gets the articles data from database using xhr and html is constucted
 * @param {}
 */

function getArticleList() {
  var requestOptions = {
    method: "GET",
  };
  fetch("http://localhost:3000/articles", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      viewlist.innerHTML = "";
      for (var obj of result) {
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
        viewlist.innerHTML += `<div class='articlediv'>
          <div class='articledata' onclick=viewArticle(event) id=
         ${obj.id} 
          >
          <a href=# id= 
          ${obj.id} 
          > 
          ${obj.title} 
          </a >
          <p>
          ${obj.content} 
          </p> 
          </div>
          <div class='commentdiv'>
          <img src=css/resources/img/comment.png id=
          ${obj.id} 
          />
          <sup><b>
          ${count.length}
          </b></sup>
          </div>`;
      }
    });
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
