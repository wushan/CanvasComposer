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
                $(this).siblings('ul').addClass('active');
                $(this).siblings('ul').on('click','a', function(){
                  var location = $('#weatherCity option:selected').val();
                  CanvasEditor.Artboard.Multimedia.weather(location);
                });
              },
    lockAll: function(event) {
                //
              },
    disposeAll: function(event) {
                CanvasEditor.Artboard.dispose();
              },
    artboardSettings: function(event) {
                $('#canvassetting').fadeTo('fast',0.9);
              },
    saveState: function(event) {
                logObj();
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

};
