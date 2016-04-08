CanvasComposer.toolBar = function(){
  //toolBar Actions  
  var actions = {
    addRect:   function (event) {
                  CanvasComposer.Artboard.addRect();
                },
    addCircle: function (event) {
                  CanvasComposer.Artboard.addCircle();
                },
    addText: function (event) {
                  CanvasComposer.Artboard.addText();
                },
    addMarquee: function (event) {
                  //Trigger Settings
                  $('#marquee-settings').addClass('active');
                },
    addClock: function(event) {
                CanvasComposer.Artboard.Multimedia.clock();
              },
    addWeather: function(event) {
                //Trigger Submenu
                var sub = $(this).siblings('ul');
                sub.toggleClass('active');
              },
    lockAll: function(event) {
                //
              },
    reset: function(event) {
                CanvasComposer.Artboard.reset();
              },
    delete: function(event) {
                event.preventDefault(); event.stopPropagation();
                CanvasComposer.Artboard.removeObject();
              },
    disposeAll: function(event) {
                CanvasComposer.Artboard.dispose();
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
                // CanvasComposer.Save.toSvg();
                // CanvasComposer.Save.toPng();
                CanvasComposer.Save.toObj();
                // Alert after save
                
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
    CanvasComposer.Artboard.Multimedia.weather(location);
    //Deactive myself
    $(this).parents('ul').removeClass('active');
  });

};
