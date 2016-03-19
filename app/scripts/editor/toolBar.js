(function(){
  //toolBar Actions

  //Init toolBar Component

  var actions = {
    addRect:   function (event) {
                  Artboard.addRect();
                },
    addCircle: function (event) {
                  Artboard.addCircle();
                },
    addText: function (event) {
                  Artboard.addText();
                },
    addClock: function(event) {
                //
              },
    lockAll: function(event) {
                //
              },
    disposeAll: function(event) {
                Artboard.dispose();
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

}());
