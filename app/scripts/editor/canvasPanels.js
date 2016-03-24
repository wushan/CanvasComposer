CanvasComposer.canvasPanels = function(){
  //Canvas Panel
  $("#canvasWidth").on("change paste keyup", function() {
     //Refresh Canvas Size
     canvas.setWidth($(this).val());
     canvas.renderAll();
     //Fit Artboard
     CanvasComposer.initCanvas.fit();
     //Set Canvas tip tags
    $(".sizeTag .tag.width span").html($(this).val());
  });

  $("#canvasHeight").on("change paste keyup", function() {
     //Refresh Canvas Size
     canvas.setHeight($(this).val());
     canvas.renderAll();
     //Fit Artboard
     CanvasComposer.initCanvas.fit();
     //Set Canvas tip tags
    $(".sizeTag .tag.height span").html($(this).val());
  });

  $("#canvas-select").change(function(){
    //Refresh Canvas Size
    var presetWidth = $('#canvas-select option:selected').attr('data-width'),
        presetHeight = $('#canvas-select option:selected').attr('data-height');
    $("#widthValue").val(presetWidth);
    $("#heightValue").val(presetHeight);
    canvas.setWidth(presetWidth);
    canvas.setHeight(presetHeight);
    canvas.renderAll();
    //Fit Artboard
    CanvasComposer.initCanvas.fit();
    //Set Canvas tip tags
    $(".sizeTag .tag.width span").html(presetWidth);
    $(".sizeTag .tag.height span").html(presetHeight);
  });

  $(".layoutpresets").on('click', 'a', function(){
    if ($(this).attr('data-src') != '' || $(this).attr('data-src') != undefined) {
      $(this).parent().siblings().children('a').removeClass('active');
      $(this).addClass('active');
      //Check if there is already an object exist
      if (canvas._objects.length > 0) {
        var confirmation = confirm("讀取預設版型會移除目前畫面中的所有物件，是否確定讀取？");
        var confirmationBtn;
        if (confirmation == true) {
            CanvasComposer.Artboard.dispose();
            CanvasComposer.Load.FromPresets($(this).attr('data-src'), function(res){
              console.log(res);
              $('#canvassetting').fadeOut('fast');
            });
        } else {
            return;
        }
      } else {
        CanvasComposer.Load.FromPresets($(this).attr('data-src'), function(res){
          console.log(res);
          $('#canvassetting').fadeOut('fast');
        });
      }
    } else {
      alert('Error loading preset.');
    }
  })
}