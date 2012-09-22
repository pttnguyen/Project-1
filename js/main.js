$(document).ready(function() {
  
  $('#fetch').submit(function() {

    var t = $('#term').val();
    // alert(t);
	
    var theHtml="";
	
	$("#poster").empty();
	$('#term').val() == "";
	$('#term').blur()
	
    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
              {tags: t, tagmode: "any", format: "json"},
              function(data) {
                $.each(data.items, function(i,item) {
                  theHtml += '<li class="thumb"><div class="del" style="cursor: pointer;" onClick="$(this).parent().remove();">x</div><a href="' + item.media.m.replace("_m", "") + '" target="_blank">';
                  theHtml += '<img height="75px" width="auto" title="' + item.title +
                    '" src="' + item.media.m.replace("_m", "") + '" alt="' + item.title + '" />';
                  theHtml += '</a></li>';
                });
                $("#poster").append(theHtml);
              });
  return false;
  
	});
	
$(function() {
  $("#poster, #new-trail ul").sortable({
	connectWith: ".connectedSortable",
	scroll: true,
	revert: true
			});
				});

				
  });

// Create an empty global object where we can store settings for connecting to Delicious
var delicious = {};

$(document).ready(function() {

  $('#save-trail').submit(function() {

    // Store the username and password to send with each request
    // This isn't the best security practice, but we do it here
    // in the interest of brevity
    delicious.username = $('#save-username').val();
    delicious.password = $('#save-password').val();
    delicious.trail_name = $('#save-trail-name').val();
    if (delicious.trail_name == "") {
      alert("trail name is required!");
      return false;
    }
    if (delicious.username == "") {
      alert("Username is required!");
      return false;
    }
    if (delicious.password == "") {
      alert("Password is required!");
      return false;
    }
    $('#new-trail h2').text(delicious.trail_name || 'My New Trail');


    delicious.stepNum = 0;
    $('<div class="deleteme"></div>').html('<img src="progress_bar.gif" />')
      .appendTo('#login');

    saveTrail();
    return false;
  });

  // Allow the user to rearrange the list of bookmarks in the new trail
  // $('#new-trail ul').sortable();

});


function deleter () {
  $('#tabs div#login').fadeOut(1000);
}

function creating () {
  $('#tabs div#creator').fadeIn(1000);
}



function saveTrail () {
  // We need to keep track of which bookmark number we are saving, so we
  // can use the `step:2` syntax that we have established
  // When the user submitted the form we started with stepNum = 0,
  // so we can increment it each time we call saveTrail
  delicious.stepNum++;

  // Change spaces in the trail name to underscores to follow our trail syntax
  // By default, the .replace() method doesn't replace ALL the occurrances
  // of a string, so we are using the global flag in our regular expression
  // to replace everything. The global flag is set with the "g" after
  // the regular expression (/ /g)
  var newTrailName = 'trail:' + $('#new-trail h2').text().toLowerCase().replace(/ /g, '_');

  // Get the first bookmark to save, which is the first element of the #new-trail list
  var bookmark = $('#new-trail li:first');

  // Assemble the data to send to Delicious
  var postData = {
    url: bookmark.find('a img').attr('src'),
    description: bookmark.find('a img').attr('title'),
    extended: bookmark.data('extended'),
    tags: newTrailName + ',' + 'step:' + delicious.stepNum,
    method: 'posts/add',
    username: delicious.username,
    password: delicious.password
  };

  // Send the data to Delicious through a proxy and handle the response
  // Use $.post if the script is located on the same server
  // Otherwise, use $.get to avoid cross-domain problems
  // $.post('delicious_proxy.php',
  $.getJSON("http://courses.ischool.berkeley.edu/i290-iol/f12/resources/trailmaker/delicious_proxy.php?callback=?",
            postData,
            function(rsp){
              if (rsp.result_code === "access denied") {
                alert('The provided Delicious username and password are incorrect.');
                $('.deleteme').remove();
              } else if (rsp.result_code === "something went wrong") {
                alert("Couldn't save the trail!");
                $('.deleteme').remove();
                setTimeout(deleter, 200);
                setTimeout(creating, 2000);
              } else if (rsp.result_code === "done") {
                // Bookmark was saved properly
                $('#new-trail li:first').remove(); // Remove the line for the bookmark we just saved
                if ($('#new-trail li').length > 0) {
                  // Save the next bookmark in the trail in 1000ms (1 second)
                  // We have to wait this period of time to comply with the
                  // terms of the Delicious API. If we don't we may have access denied.
                  setTimeout(saveTrail, 1000);
                } else {
                  // We're done saving the trail
                  window.delicious_password = null;
                  $('.deleteme').remove();
                  setTimeout(deleter, 200);
                  window.location = "viewer.html"

                }
              }
            });
}

$(document).ready(function(){
  $('#tabs div.tab').hide();
  $('#tabs div#creator').fadeIn(500);
  $('#tabs ul li:first').addClass('active');

  $('#login-button').click(function(){

    if ($('#new-trail li').length == 0) {
      alert("You must create a trail before saving!");
      return false;
    }

    $('#tabs ul li').removeClass('');
    $(this).parent().addClass('');

    $("#login").fadeIn(1000);
    $("#save-trail-name").focus();

    return false;
  });

  $('#save-cancel').click(function() {
    $("#login").fadeOut(1000);
    return false;
  });

});
