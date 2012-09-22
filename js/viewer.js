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
              $(json).each(function(index) {
                // this.u // url
                // this.d // description
                // this.n // extended notes
                // this.t // array of tags
                theHtml+= '<li class="childElem img"><img src="'+this.u+'" height="250" width="auto"></img></li>';
              });
              $("#trails").append(theHtml);
              $('.coverFlow').coverflow(); //-> Main  ID '#coverFlow'
              //$('.coverFlow').coverflow({_isAutoScroll:true,_buttons:{"p":".previous","n":".next","pause":".pauseAnimation"}});

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
                loadSlideShow(username, tag);
                return false;
              });
            });