var view = document.getElementById("viewarticle");
var userName = document.getElementById("name");
var comment = document.getElementById("commentbody");
var commentlist = document.getElementById("commentlist");
var details = document.getElementById("details");
var reply = document.createElement("a");
var addcommentvalidate = document.getElementById("addcommentvalidate");
var commentvalidate = document.getElementById("commentvalidate");
var submitbtn = document.getElementById("submitbtn");
var addCommentForm = document.getElementById("addcomment");
var viewarticle = document.getElementById("viewarticle");
urlstring = window.location.search;
var commentobj;
//synchronoulsy calling to get comments data from DB and storing commentobj
var requestOptions = {
  method: "GET",
};
fetch(
  "http://localhost:3000/comments?userId=" + urlstring.substring(4),
  requestOptions
)
  .then((response) => response.json())
  .then((result) => {
    commentobj = result;
  })
  .then(getArticles());
//sending xhrrequest to getarticlesdata
function getArticles() {
  var requestOptions = {
    method: "GET",
  };
  fetch("http://localhost:3000/articles" + urlstring, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      var content = document.getElementById("content");
      var title = document.getElementById("title");
      title.textContent = result[0].title.toUpperCase();
      content.textContent = result[0].content;
      details.textContent = "Posted on  " + result[0].date;
      constructComments(commentobj);
    });
}
/**
 * function sends a comment to json-server using xhr and adds comment to
 * global xhr object
 * @param {object} e eventobject
 * @return none
 */
function sendComment(e) {
  e.preventDefault();
  if (userName.value.trim() == "") {
    addcommentvalidate.innerHTML = "<br>**required";
  }
  if (comment.value.trim() == "") {
    commentvalidate.innerHTML = "<br>**required";
  } else {
    commentvalidate.innerHTML = "";
    addcommentvalidate.innerHTML = "";
    var name = userName.value;
    var sendrequest = new XMLHttpRequest();
    var date = new Date();
    var obj = {};
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    obj["name"] = name;
    obj["content"] = comment.value;
    obj["userId"] = urlstring.substring(4);
    obj["date"] = date.toLocaleString("en-US");
    // date.toDateString() + " " + date.getHours() + ":" + date.getMinutes();
    obj["replies"] = [];
    sendrequest.open("post", "http://localhost:3000/comments", true);
    sendrequest.setRequestHeader("content-type", "application/json");
    sendrequest.send(JSON.stringify(obj));
    sendrequest.onload = function () {
      var response = JSON.parse(this.response);

      // updating commentobj with newly added comment
      commentobj.push(response);
      //appending reply comment to existing commentsection
      commentlist.innerHTML += createCommentElement(response) + "<ul></ul>";
      addCommentForm.reset();
    };
  }
}
/**
 * function to delete articles
 * @param {}
 * @returns {}
 */
function deletePage() {
  var delxhr = new XMLHttpRequest();
  delxhr.open(
    "delete",
    "http://localhost:3000/articles/" + urlstring.substring(4)
  );
  delxhr.send();
  window.location.href = "/index.html" + urlstring;
}

/**
 * function to edit article
 * @param {}
 * @return {}
 */
function editPage() {
  window.location.href = "createarticle.html" + urlstring;
}

/**
 * function to construct reply form to existing comment
 * @param {object} e  eventobject
 * @return {}
 */
function replymethod(e) {
  e.target.disabled = true;
  e.target.parentNode.innerHTML += `<form class = replyform id=
    ${e.target.parentNode.id}><span id=replyvalidate style='color:red'></span><br> <input type=text id=textbox placeholder=Name><br>"
    <textarea placeholder=comment rows=5 id=replytextarea></textarea><br> 
    <input type=button value=Post class =replytextbtn onclick= postReply(event,constructComments) style=padding-left:290px; float:right> 
    <input type=button class =replytextbtn value=Cancel onclick=cancelReply(event)></form>`;
}
/**
 * removes dom structure created(replyform)when user presses on cancel btn
 * @param {Object} e  event objext
 * @returns none
 */
function cancelReply(e) {
  console.log(e);
  var btn = e.target.parentNode.previousElementSibling;
  console.log(btn);
  btn.disabled = false;
  console.log(btn.disabled);
  e.target.parentNode.remove();
}
/**
 *functions sends reply of user to server(xhr) and appends comment to existing structure dom
 * @param {Object} e event object
 */
function postReply(e) {
  var replyname = document.getElementById("textbox").value;
  e.preventDefault();
  var replyvalidate = document.getElementById("replyvalidate");
  var reply = document.getElementById("replytextarea").value;
  console.log("i am in replyname", replyname);
  var id = e.target.parentNode.id;
  var replaceComment;
  var comment;
  if (replyname == "" || reply == "") {
    replyvalidate.innerHTML = "  <br>**All fields required";
  } else {
    //constucting replyobj
    var date = new Date();
    var obj = {};
    obj["name"] = replyname;
    obj["reply"] = reply;
    obj["replyid"] = id;
    obj["date"] = date.toLocaleString("en-US");
    console.log(obj);
    // date.toDateString() + " " + date.getHours() + ":" + date.getMinutes();

    //to locate particular comment data from all list of comments i.e fromcommentobj
    for (var comment of commentobj) {
      if (comment.id == id) {
        console.log("i am in this");
        var index = commentobj.indexOf(comment);
        commentobj.splice(index, 1);
        comment["replies"].push(obj);
        replaceComment = comment;
        commentobj.splice(index, 0, replaceComment);
      }
    }
    //using xhr sending post comment to DB
    var postxhr = new XMLHttpRequest();
    postxhr.open("put", "http://localhost:3000/comments/" + id);
    postxhr.setRequestHeader("content-type", "application/json");
    postxhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    postxhr.send(JSON.stringify(replaceComment));
    postxhr.onload = function () {
      console.log(e.target);
      var btn = e.target.parentNode.previousElementSibling;
      console.log(btn);
      btn.disabled = false;

      //appending reply comment to existing commentsection
      e.target.parentNode.parentNode.nextElementSibling.innerHTML +=
        createReplyElement(obj);
      console.log(e.target.parentNode);
      e.target.parentNode.remove();
    };
    postxhr.onerror = function (error) {
      console.log(error);
    };
  }
}

/**construct comment section in webpage
 *
 * @param {object []} commentobj global array of object of comments
 * @returns {}
 */
function constructComments(commentobj) {
  console.log(commentobj);
  for (var obj of commentobj) {
    commentlist.innerHTML +=
      createCommentElement(obj) +
      "<ul>" +
      (function () {
        if (obj.replies.length != 0) {
          return obj.replies
            .map((x) => {
              return createReplyElement(x);
            })
            .join("");
        } else {
          return "";
        }
      })() +
      "</ul></li>";
  }
}

/**
 * creates html view of comment on webpage
 * @param {object} obj
 * @returns {String}  html view of comment
 */
function createCommentElement(obj) {
  return `<br><li id= 
    ${obj.id} "><div class=commentdiv id=
    ${obj.id}
    ><pre><h3 style='padding-left:20px;padding-top:10px'>${capitalize(
      obj.name
    )} -${obj.date}</h3></pre><p style='padding-left:20px'>${obj.content}</p>
    <input type=button class=replybtn value=Reply onclick=replymethod(event)></div>`;
}
/**
 * creates  on webpage htmlview of replycomment
 * @param {Object} x
 * @returns {String} htmlview of replycomment
 */
function createReplyElement(x) {
  return `<li id= 
    ${x.replyId} 
    > 
    <div class=commentdiv><pre><h3 style='padding-left:20px;padding-top:10px'>${capitalize(
      x.name
    )} -${x.date}</h3></pre><p style='padding-left:20px'> 
    ${x.reply} 
    </p> 
    </div></li>`;
}

/**
 * capitalizes the first letter of string and lowercase of other letters
 * @param {String} str name of user who adds comments
 * @returns {String}
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
