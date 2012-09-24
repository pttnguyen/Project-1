function getURLParameter(name) {
  str = RegExp(name + '=' + '(.+?)(&|$)').exec(location.search);
  if (str==null)
    return null;
  return decodeURI(str[1]);
}

function loadSlideShow(username, tag) {
  var theHtml='';

  // This cross-domain request requires that you use '?callback=?' because it is done using JSONP
  $('ul').empty();

  $.getJSON('http://feeds.delicious.com/v2/json/' + username + '/'+tag+'?callback=?',
            function(json){
              if(json.length == 0)
              {
                alert("Sorry no matching results found, try another username or tag");
              }

              json.sort(function(a, b) {
                var re = new RegExp("step:[0-9]*$", "gi");
                var astep = a.t.filter(function (a) { return re.test(a); });
                var bstep = b.t.filter(function (a) { return re.test(a); });
                if (astep.length != 1 || bstep.length != 1) {
                  console.log("WARNING: malformed trail doesn't contain step!")
                  return 0;
                }
                astep = astep[0].split(":")[1];
                bstep = bstep[0].split(":")[1];
                return (astep < bstep) ? -1 : (astep > bstep) ? 1 : 0;
              });

              $(json).each(function(index) {
                // this.u // url
                // this.d // description
                // this.n // extended notes
                // this.t // array of tags
                var u = this.u
                var chkimg = u.substr(u.length - 3);
                if(chkimg == 'jpg')
                {
                  theHtml+= '<li class="childElem img"><img src="'+this.u+'" height="250" width="auto"></img></li>';
                }
                chkimg="";
                
              });
              if(theHtml =="" && json.length>0)
              {
                alert ("Sorry no jpg images found with this tag");
              }
              else
              {
                $("#trails").append(theHtml);
                $('.coverFlow').coverflow(); //-> Main  ID '#coverFlow'
              //$('.coverFlow').coverflow({_isAutoScroll:true,_buttons:{"p":".previous","n":".next","pause":".pauseAnimation"}});
              }
            });
}

var delicious = {};

            $(document).ready(function() {
              // See if any arguments came in on the URL
              delicious.username = getURLParameter("username");
              delicious.tag = getURLParameter("tag");
              if (!delicious.username || !delicious.username) {
                // we require both arguments or neither
                delicious.username = null;
                delicious.tag = null;
              } else {
                $('#username').val(delicious.username);
                $('#phototag').val(delicious.tag);
                loadSlideShow(delicious.username, delicious.tag);
              }

              // Load bookmarks for the specified user when the #load-bookmarks form is submitted
              $('#load-bookmarks').submit(function() {
                var username = $('#username').val();
                var tag = $('#phototag').val();
                if(username=="" || tag=="")
                {
                  alert("You must enter a username and tag");

                }
              

                loadSlideShow(username, tag);
                return false;
              });

              $('#mainpage-button').click(function() {
                window.location.href = 'index.html';
                return false;
              });




            });