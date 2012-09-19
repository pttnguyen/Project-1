$(document).ready(function() {
  
  $('#fetch').submit(function() {

    var t = $('#term').val();
    // alert(t);
	
    var theHtml="";
	
	$("#poster").empty();
	$('#term').val() == "";
	
    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
              {tags: t, tagmode: "any", format: "json"},
              function(data) {
                $.each(data.items, function(i,item) {
                  theHtml += '<li class="thumb"><a href="' + item.media.m + '" target="_blank">';
                  theHtml += '<img height="75px" width="auto" title="' + item.title +
                    '" src="' + item.media.m + '" alt="' + item.title + '" />';
                  theHtml += '</a></li>';
                });
                $("#poster").append(theHtml);
              });
  return false;
  
	});
	
	
	
	$(function() {
  $("#poster, #new-trail").sortable({
	connectWith: ".connectedSortable",
	revert: true
	});
		});
	
  });
  

