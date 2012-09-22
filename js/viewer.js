
            $(document).ready(function() {



                // Load bookmarks for the specified user when the #load-bookmarks form is submitted
                $('#load-bookmarks').submit(function() {
                    var username = $('#username').val();
                    var theHtml='';
                    var tag = $('#phototag').val();
                    // alert(tag);
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


                    return false;
                });
            });