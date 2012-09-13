$(function() {
  // there's the gallery and the trail.  The gallery is the source of images,
  // and the trail is the destination.
  var $gallery = $("#gallery"),
  $trail = $("#new-trail");

  // let the gallery items be draggable
  $("li", $gallery).draggable({
    cancel: "a.ui-icon", // clicking an icon won't initiate dragging
    revert: "invalid", // when not dropped, the item will revert back to its initial position
    containment: $("#demo-frame").length ? "#demo-frame" : "document", // stick to demo-frame if present
    helper: "clone",
    cursor: "move"
  });

  // let the trail be droppable, accepting the gallery items
  $trail.droppable({
    accept: "#gallery > li",
    activeClass: "ui-state-highlight",
    drop: function(event, ui) {
      addImage(ui.draggable);
    }
  });

  // For now, let the gallery be droppable as well, accepting items from the
  // trail.  Not sure if this is how the final behavior will work or not.
  $gallery.droppable({
    accept: "#new-trail li",
    activeClass: "custom-state-active",
    drop: function(event, ui) {
      replaceImage(ui.draggable);
    }
  });

  function addImage($item) {
    $item.fadeOut(function() {
      var $list = $("ul", $trail).length ?
        $("ul", $trail) :
        $("<ul class='gallery ui-helper-reset'/>").appendTo($trail);
      $item.appendTo($list).fadeIn(function() {
        $item.find("img");
      });
    });
  }

  function replaceImage($item) {
    $item.fadeOut(function() {
      $item
        .find("a.ui-icon-refresh")
        .remove()
        .end()
        .find("img")
        .end()
        .appendTo($gallery)
        .fadeIn();
    });
  }
});
