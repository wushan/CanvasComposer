CanvasEditor.toolBar = function(){
  //toolBar Actions  
  var actions = {
    addRect:   function (event) {
                  CanvasEditor.Artboard.addRect();
                },
    addCircle: function (event) {
                  CanvasEditor.Artboard.addCircle();
                },
    addText: function (event) {
                  CanvasEditor.Artboard.addText();
                },
    addClock: function(event) {
                CanvasEditor.Artboard.Multimedia.clock();
              },
    addWeather: function(event) {
                //Trigger Submenu
                var sub = $(this).siblings('ul');
                sub.toggleClass('active');
              },
    lockAll: function(event) {
                //
              },
    disposeAll: function(event) {
                CanvasEditor.Artboard.dispose();
              },
    artboardSettings: function(event) {
                $('#canvassetting').fadeIn();
                $(document).mouseup(function (e)
                  {
                      var container = $(".canvasconfig-wrapper");

                      if (!container.is(e.target) // if the target of the click isn't the container...
                          && container.has(e.target).length === 0) // ... nor a descendant of the container
                      {
                          container.parent().hide();
                      }
                  });
              },
    saveState: function(event) {
                CanvasEditor.save();
              } 
  };

  $("a[data-action]").on("click", function (event) {
    var link = $(this),
        action = link.data("action");

    event.preventDefault();

    // If there's an action with the given name, call it
    if( typeof actions[action] === "function" ) {
      actions[action].call(this, event);
    }
  });

  $("a[data-action=addWeather]").siblings('ul').on('click','a', function(){
    var location = $('#weatherCity option:selected').val();
    console.log(location);
    CanvasEditor.Artboard.Multimedia.weather(location);
    //Deactive myself
    $(this).parents('ul').removeClass('active');
  });

};
