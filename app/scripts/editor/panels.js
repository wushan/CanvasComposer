//Canvas Panel
  $("#canvasWidth").on("change paste keyup", function() {
     //Refresh Canvas Size
     canvas.setWidth($(this).val());
     canvas.renderAll();
     //Fit Artboard
     artboardScale();
     //Set Canvas tip tags
    $(".sizeTag .tag.width span").html($(this).val());
  });

  $("#canvasHeight").on("change paste keyup", function() {
     //Refresh Canvas Size
     canvas.setHeight($(this).val());
     canvas.renderAll();
     //Fit Artboard
     artboardScale();
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
    artboardScale();
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
            Artboard.dispose();
            loadPresetsFromJSON($(this).attr('data-src'));
        } else {
            return;
        }
      } else {
        loadPresetsFromJSON($(this).attr('data-src'));
      }
    } else {
      alert('Error loading preset.');
    }
  })

  function loadPresetsFromJSON(src) {
    $.getJSON(src, function(data){
      console.log('success');
    }).done(function(data){
      console.log('done');
      console.log(data);
      canvas.loadFromJSON(data, canvas.renderAll.bind(canvas),function(o, object) {
        console.log(o);
        console.log(object);
        if (object.type === 'slider') {
          var i=0;
          var leastTime;
          var patternSourceCanvas = object.patternSourceCanvas;
          var pattern = object.pattern;
          leastTime = object.slides[0].continued*1000;
          var id = object.id;
          setTimeout(function(){bgRelacer(i,object,id)}, leastTime);
          function bgRelacer(i, res, id) {
            i++;
            if (i === res.slides.length ) {
              i=0;
            }
            new fabric.Image.fromURL(res.slides[i].src, function(img){
              // patternSourceCanvas = new fabric.StaticCanvas();
              // console.log(patternSourceCanvas);
              img.setHeight(patternSourceCanvas.height);
              img.setWidth(patternSourceCanvas.width);

              patternSourceCanvas.setBackgroundImage(img);
              patternSourceCanvas.renderAll();
              // patternSourceCanvas.renderAll();
              console.log(patternSourceCanvas.getElement());
              pattern = new fabric.Pattern({
                        source: patternSourceCanvas.getElement(),
                        repeat: 'no-repeat'
                      });

              res.setFill(pattern);
              canvas.renderAll();
            })

            leastTime = res.slides[i].continued*1000;
            setTimeout(function(){bgRelacer(i,res,id)}, leastTime);
          }
        }
        bindEvents(object);
      });
    }).fail(function() {
      console.log( "error" );
    })
  }

//ArtBoard Panel
$('.tools').on('click', 'a', function(){
  var className = $(this).attr('class');
  switch(className){
    case 'js-add-rect':
      Artboard.addRect();
      break;
    case 'js-add-circle':
      Artboard.addCircle();
      break;
    case 'js-add-text':
      Artboard.addText();
      break;
    case 'js-dispose':
      Artboard.dispose();
      break;
    case 'js-setting':
      $('#canvassetting').fadeTo('fast',0.9);
      break;
  }
})
//Top Panel
$('.objectControl').on('click', 'button', function(){
  var className = $(this).attr('class');
  switch(className){
    case 'js-delete':
      Artboard.removeObject();
      break;
    case 'js-reset':
      Artboard.reset();
      break;
  }
})
//Size
$('.objectSize').on("change", function() {
  var objectSize,
      objectWidth,
      objectHeight,
      objectScaleX,
      objectScaleY;
  var obj = canvas.getActiveObject();
  objectWidth = obj.width;
  objectHeight = obj.height;
  objectScaleX = $("#objectWidth").val()/objectWidth;
  objectScaleY = $("#objectHeight").val()/objectHeight;
  obj.setScaleX(objectScaleX);
  obj.setScaleY(objectScaleY);
  obj.setCoords();
  canvas.renderAll();
  logObj();
});

//Scale


//Color
$('#objectColor').spectrum({
    // color: "#ECC",
    showInput: true,
    className: "full-spectrum",
    showInitial: true,
    showPalette: true,
    showSelectionPalette: true,
    maxSelectionSize: 10,
    preferredFormat: "hex",
    localStorageKey: "spectrum.demo",
    move: function (color) {
        
    },
    show: function () {
    
    },
    beforeShow: function () {
    
    },
    hide: function () {
    
    },
    change: function(color) {
      var obj = canvas.getActiveObject();
      if (obj.type === "i-text") {
        obj.setTextBackgroundColor(color);
        console.log(color);
      } else {
        obj.setFill(color);
      }
      // obj.backgroundColor(color);
      canvas.renderAll();
      logObj();
      $('#objectColor').spectrum("hide");
    },
    palette: [
        ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
        "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
        ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
        "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
        ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
        "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
        "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
        "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
        "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
        "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
        "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
        "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
        "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
        "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
    ]
});
//Color
$('#objectTextColor').spectrum({
    // color: "#ECC",
    showInput: true,
    className: "full-spectrum",
    showInitial: true,
    showPalette: true,
    showSelectionPalette: true,
    maxSelectionSize: 10,
    preferredFormat: "hex",
    localStorageKey: "spectrum.demo",
    move: function (color) {
        
    },
    show: function () {
    
    },
    beforeShow: function () {
    
    },
    hide: function () {
    
    },
    change: function(color) {
      var obj = canvas.getActiveObject();
      if (obj.type === "i-text") {
        obj.setFill(color);
      } else {
        //
      }
      // obj.backgroundColor(color);
      canvas.renderAll();
      logObj();
      $('#objectTextColor').spectrum("hide");
    },
    palette: [
        ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
        "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
        ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
        "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
        ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
        "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
        "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
        "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
        "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
        "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
        "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
        "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
        "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
        "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
    ]
});

//Text
$('#objectInput').on("keydown keyup paste change", function() {
  var obj = canvas.getActiveObject();
  obj.set('text', $(this).val());
  obj.setCoords();
  canvas.renderAll();
});

//Font Family
$('#objectFontFamily').on('change', function(){
  var selected = $(this).val();
  var obj = canvas.getActiveObject();
  obj.setFontFamily(selected);
  obj.setCoords();
  canvas.renderAll();
});

//Font Size
$('#objectFontSize').on('change', function(){
  var size = $(this).val();
  var obj = canvas.getActiveObject();
  obj.setFontSize(size);
  obj.setCoords();
  canvas.renderAll();
});

//Link
$('#linkValue').on('keydown keyup change', function(){
  var obj = canvas.getActiveObject();
  var val = $(this).val();
  obj.set('link', val);
  logObj();
});