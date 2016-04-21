CanvasComposer.attrPanels = function(){
  function drag_start(event) {
      var style = window.getComputedStyle(event.target, null);
      event.dataTransfer.setData("text/plain",
      (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY));
  } 
  function drag_over(event) { 
      event.preventDefault(); 
      return false; 
  } 
  function drop(event) { 
      console.log(event);
      var offset = event.dataTransfer.getData("text/plain").split(',');
      var dm = document.getElementById('config');
      dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
      dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
      console.log(dm);
      event.preventDefault();
      return false;
  }

  var dm = document.getElementById('config'); 
  dm.addEventListener('dragstart',drag_start,false); 
  document.body.addEventListener('dragover',drag_over,false); 
  document.body.addEventListener('drop',drop,false);

  


//Top Panel
$('.objectControl').on('click', 'button', function(){
  var className = $(this).attr('class');
  switch(className){
    case 'js-delete':
      CanvasComposer.Artboard.removeObject();
      break;
    case 'js-reset':
      CanvasComposer.Artboard.reset();
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
      color = color.toHexString();
      if (obj.type === "textbox" || obj.type === "i-text" || obj.type === "marquee") {
        obj.setTextBackgroundColor(color);
        console.log(color);
      } else {
        obj.setFill(color);
      }
      canvas.renderAll();
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
      //Turn the Spectrum Object to Hex String
      color = color.toHexString();
      if (obj.type === "textbox" || obj.type === "i-text" || obj.type === "marquee") {
        obj.setColor(color);
      } else {
        //
      }
      // obj.backgroundColor(color);
      canvas.renderAll();
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
//Get an Google Font List

(function (){
  $.getJSON( "https://www.googleapis.com/webfonts/v1/webfonts?sort=alpha&key=AIzaSyDvbHbq0AAW3irCwjSdbNKtklKSAia_SZ8", function() {
  console.log( "success" );
})
  .done(function(data) {
    console.log( "second success" );
    var fontName;
    var option = $('<option></option>');
    console.log(data.items.length); //733 ?
    console.log(data);
    for (var i=0;i<data.items.length; i++) {
      fontName = data.items[i].family;
      // console.log(option);
      $('#objectFontFamily').append($("<option>",{
                      value: fontName,
                      text: fontName
      }))
    }

  })
  .fail(function(err) {
    console.log(err);
  })
  .always(function() {
    console.log( "complete" );
  });
}())

//Global
var fontFamilies = new Array;

$('#objectFontFamily').on('change', function(){
  console.log('triggered');
  var selected = $(this).val();
  var obj = canvas.getActiveObject();
  obj.setFontFamily(selected);
  obj.setCoords();
  canvas.renderAll();

  fontFamilies.push(selected);
  console.log(fontFamilies);
  //Load Fonts
  fontLoader(fontFamilies);

});
function fontLoader(name){
  WebFontConfig = {
    loading: function() {
      console.log('loading');
    },
    active: function() {
      console.log('active');
    },
    inactive: function() {
      console.log('ahh');
    }
  };
  WebFont.load({ google: {families: name}});
}
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
});
}