CanvasComposer.toolBar = function(){
  //toolBar Actions  
  var actions = {
    addRect:   function (event) {
                  CanvasComposer.Artboard.addRect();
                },
    addUsb:   function (event) {
                  CanvasComposer.Artboard.addUsb();
                },
    addWeb: function(event) {
              CanvasComposer.Artboard.addWeb();
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
                  $(document).mouseup(function (e){
                    var container = $(".marquee-settings-inner");

                    if (!container.is(e.target) // if the target of the click isn't the container...
                        && container.has(e.target).length === 0) // ... nor a descendant of the container
                    {
                        container.parent().removeClass('active');
                    }
                  });
                },
    addClock: function(event) {
                // CanvasComposer.Artboard.Multimedia.clock();
                $(this).parent().siblings().children('a, ul').removeClass('active');
                //Trigger Submenu
                $(this).toggleClass('active');
                var sub = $(this).siblings('ul');
                sub.toggleClass('active');
              },
    addWeather: function(event) {
                $(this).parent().siblings().children('a, ul').removeClass('active');
                //Trigger Submenu
                $(this).toggleClass('active');
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
                $('#canvassetting').fadeToggle();
                $(document).mouseup(function (e){
                    var container = $("#sidebar");

                    if (!container.is(e.target) // if the target of the click isn't the container...
                        && container.has(e.target).length === 0) // ... nor a descendant of the container
                    {
                        container.find($('#canvassetting')).hide();
                    }
                });
              },
    saveState: function(event) {
                // CanvasComposer.Save.toSvg();
                // CanvasComposer.Save.toPng();
                // CanvasComposer.Save.toObj();
                // Alert after save
                //SELECT SAVE TYPE
                $(this).toggleClass('active');
                var sub = $(this).siblings('ul');
                sub.toggleClass('active');
              },
    savePng: function(event) {
      CanvasComposer.Save.toPng();
    },
    saveSvg: function(event) {
      CanvasComposer.Save.toSvg();
    },
    saveJSON: function(event) {
      CanvasComposer.Save.toObj();
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
