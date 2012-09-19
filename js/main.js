$(document).ready(function() {

  $('#search').submit(function() {
    var t = $('#term').val();
    var theHtml="";
    $("ul#poster").html("");

    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
              {tags: t, tagmode: "any", format: "json"},
              function(data) {
                $.each(data.items, function(i,item) {
                  theHtml += '<li><a href="' + item.media.m + '" target="_blank">';
                  theHtml += '<img height="40" width="auto" title="' + item.title +
                    '" src="' + item.media.m + '" alt="' + item.title + '" />';
                  theHtml += '</a></li>';
                });
                $("ul#poster").append(theHtml);
              });
    $('#poster li').draggable({ revert: true} );
    return false;
  });
});
