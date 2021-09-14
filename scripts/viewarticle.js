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
urlstring = window.location.search;
var commentobj;
//synchronoulsy calling to get comments data from DB and storing commentobj
(function () {
  var xhrobj = new XMLHttpRequest();
  xhrobj.open(
    "GET",
    "http://localhost:3000/comments?userId=" + urlstring.substring(4)
  );

  xhrobj.send();
  xhrobj.onload = function () {
    commentobj = JSON.parse(this.response);
    constructComments(commentobj);
  };
})();
//builds comment section

//sending xhrrequest to getarticlesdata
var xhr = new XMLHttpRequest();
xhr.open("GET", "http://localhost:3000/articles" + urlstring);
xhr.responseType = "json";
xhr.send();
xhr.onload = function () {
  var content = document.getElementById("content");
  var title = document.getElementById("title");
  title.textContent = this.response[0].title.toUpperCase();
  content.textContent = this.response[0].content;
  details.textContent = "Posted on  " + this.response[0].date;
};

//addcomment+sending xhr to store added comment
/**
 * @param  {} e
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
      commentlist.innerHTML += createCommentElement(response);
      addCommentForm.reset();
    };
  }
}

//function to delete articles
function deletePage() {
  var delxhr = new XMLHttpRequest();
  delxhr.open(
    "delete",
    "http://localhost:3000/articles/" + urlstring.substring(4)
  );
  delxhr.send();
  window.location.href = "/index.html" + urlstring;
}

//function to edit article
function editPage() {
  window.location.href = "createarticle.html" + urlstring;
}

//functionto givereply to existingcomment
function replymethod(e) {
  e.target.disabled = true;
  e.target.parentNode.innerHTML +=
    "<form class = replyform id=" +
    e.target.parentNode.id +
    "><span id=replyvalidate style='color:red'></span><br><input type=text id=textbox placeholder=Name><br>" +
    "<textarea placeholder=comment rows=5 id=replytextarea></textarea>" +
    "<input type=button value=Post class =replytextbtn onclick= postReply(event,constructComments)>" +
    "<input type=button class =replytextbtn value=Cancel onclick=cancelReply(event)></form>";
}
function cancelReply(e) {
  console.log(e);
  var btn = e.target.parentNode.previousElementSibling;
  console.log(btn);
  btn.disabled = false;
  console.log(btn.disabled);
  e.target.parentNode.remove();
}
function postReply(e) {
  var replyname = document.getElementById("textbox").value;
  e.preventDefault();
  var replyvalidate = document.getElementById("replyvalidate");
  console.log("i am in replyname", replyname);
  var reply = e.target.previousElementSibling.value;
  var id = e.target.parentNode.id;
  var replaceComment;
  var comment;
  if (replyname == "" || reply == "") {
    replyvalidate.innerHTML = "<br>**All fields required";
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

//construct comment section in webpage
function constructComments(commentobj) {
  var str = "";
  console.log(commentobj);
  for (var obj of commentobj) {
    commentlist.innerHTML +=
      "<br><li id=" +
      obj.id +
      "><div class=commentdiv id=" +
      obj.id +
      "><pre><h3 style='padding-left:20px;padding-top:10px'>" +
      capitalize(obj.name) +
      "  -" +
      obj.date +
      "</h3></pre><p style='padding-left:20px'>" +
      obj.content +
      "</p>" +
      "<input type=button class=replybtn value=Reply onclick=replymethod(event)></div>" +
      "<ul>" +
      (function () {
        if (obj.replies.length != 0) {
          str = "";
          for (var x of obj.replies) {
            str +=
              "<li id=" +
              x.replyId +
              ">" +
              "<div class=commentdiv><pre><h3 style='padding-left:20px;padding-top:10px'>" +
              capitalize(x.name) +
              "  -" +
              x.date +
              "</h3></pre><p style='padding-left:20px'>" +
              x.reply +
              "</p>" +
              "</div></li>";
          }
          return str;
        } else {
          return "";
        }
      })() +
      "</ul></li>";
  }
}
//creates html view of comment on webpage
function createCommentElement(obj) {
  return (
    "<br><li id=" +
    obj.id +
    "><div class=commentdiv id=" +
    obj.id +
    "><pre><h3 style='padding-left:20px;padding-top:10px'>" +
    capitalize(obj.name) +
    "  -" +
    obj.date +
    "</h3></pre><p style='padding-left:20px'>" +
    obj.content +
    "</p>" +
    "<input type=button class=replybtn value=Reply onclick=replymethod(event)></div><ul></ul>"
  );
}

//creates htmlview of replycomment on webpage
function createReplyElement(x) {
  return (
    "<li id=" +
    x.replyId +
    ">" +
    "<div class=commentdiv><pre><h3 style='padding-left:20px;padding-top:10px'>" +
    capitalize(x.name) +
    "  -" +
    x.date +
    "</h3></pre><p style='padding-left:20px'>" +
    x.reply +
    "</p>" +
    "</div></li>"
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
