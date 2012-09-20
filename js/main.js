var delicious = {};

$(document).ready(function() {

  $("#poster, #new-trail ul").sortable({
	connectWith: ".connectedSortable",
    revert: true
  });

  $('#fetch').submit(function() {

    var t = $('#term').val();

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

  $('#save-trail').submit(function() {
    // Let's ask the user for a name for the trail
    // We are storing the name that the user enters as the text of the
    // h2 in the #new-trail div
    // The || syntax here lets us specify a default value
    $('#new-trail h2').text(prompt('Enter a name for your trail:') || 'My New Trail');

    // Store the username and password to send with each request
    // This isn't the best security practice, but we do it here
    // in the interest of brevity
    delicious.username = $('#save-username').val();
    delicious.password = $('#save-password').val();
    delicious.stepNum = 0;

    saveTrail();
    return false;
  });

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
      url: bookmark.find('a').attr('href'),
      description: bookmark.find('a').text(),
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
    $.getJSON("http://courses.ischool.berkeley.edu/i290-4/f09/resources/delicious_proxy.php?callback=?", 
              postData,
              function(rsp){
                if (rsp.result_code === "access denied") {
                  alert('The provided Delicious username and password are incorrect.');
                } else if (rsp.result_code === "something went wrong") {
                  alert('There was an unspecified error communicating with Delicious.');
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
                    delicious.password = null;
                    alert ("Your trail has been saved!");
                  }
                }
              });
  }

});
