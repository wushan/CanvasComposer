//Setting Up Canvas
var canvas = new fabric.Canvas('c', {
  selectionColor: 'blue',
  selectionLineWidth: 2,
  width: 800,
  height: 600
  // ...
});

//Listener
$("#widthValue").on("change paste keyup", function() {
   canvas.setWidth($(this).val());
   canvas.renderAll();
});

$("#heightValue").on("change paste keyup", function() {
   canvas.setHeight($(this).val());
   canvas.renderAll();
});

$("#canvas-select").change(function(){
  var presetWidth = $('#canvas-select option:selected').attr('data-width'),
      presetHeight = $('#canvas-select option:selected').attr('data-height');
  $("#widthValue").val(presetWidth);
  $("#heightValue").val(presetHeight);
  canvas.setWidth(presetWidth);
  canvas.setHeight(presetHeight);
  canvas.renderAll();
})



//Refresh canvas size

// // Select
// rect.on('selected', function() {
//   console.log('selected a rectangle');
// });
// //Scaling
// rect.on('scaling', function() {
//   console.log('scaling');
// });
// //Moving
// rect.on('moving', function() {
//   console.log('moving');
// });

var initRadius = 100;

var Artboard = {
  addRect : function(){
    var rect = new fabric.Rect({
      left: canvas.getWidth()/2-initRadius/2,
      top: canvas.getHeight()/2-initRadius/2,
      fill: 'rgba(0,0,0,0.33)',
      width: initRadius,
      height: initRadius
    });
    rect.perPixelTargetFind = true;
    canvas.add(rect);
    //Bind
    bindEvents(rect);
    //Refresh log
    logObj();
  },
  addCircle : function(){
    var circle = new fabric.Circle({
      left: canvas.getWidth()/2-initRadius/2,
      top: canvas.getHeight()/2-initRadius/2,
      fill: 'rgba(0,0,0,0.33)',
      radius: initRadius/2
    });
    circle.perPixelTargetFind = true;
    canvas.add(circle);
    //Bind
    bindEvents(circle);
    //Refresh log
    logObj();
  },
  addTriangle : function(){
    var triangle = new fabric.Triangle({
      left: canvas.getWidth()/2-initRadius/2,
      top: canvas.getHeight()/2-initRadius/2,
      fill: 'rgba(0,0,0,0.33)',
      width: initRadius,
      height: initRadius
    });
    //Set Perpixel Movement
    triangle.perPixelTargetFind = true;
    canvas.add(triangle);
    //Bind
    bindEvents(triangle);
    //Refresh log
    logObj();
  },
  addVideo : function() {
    //Set InitRadius for Videos 16:9
    var w = initRadius*1.6;
    var h = initRadius*0.9;
    var videoEl = document.createElement("video");
    videoEl.loop = true;
    videoEl.controls = true;
    console.log(videoEl);
    videoEl.innerHTML = '<source src="http://www.quirksmode.org/html5/videos/big_buck_bunny.mp4">';

    var video = new fabric.Image(videoEl, {
      left: canvas.getWidth()/2-w/2,
      top: canvas.getHeight()/2-h/2,
      angle: 0,
      width: w,
      height: h
    });
    video.crossOrigin = "";
    video.perPixelTargetFind = true;
    canvas.add(video);
    video.getElement().play();

    //Bind
    bindEvents(video);
    //Refresh log
    logObj();

    fabric.util.requestAnimFrame(function render() {
      canvas.renderAll();
      fabric.util.requestAnimFrame(render);
    });
  },
  dispose : function() {
    // canvas.deactivateAllWithDispatch();
    canvas.clear();
    //Refresh log
    logObj();
  },
  removeObject: function() {
    canvas.getActiveObject().remove();
  }
}

//Get Objects
canvas.getObjects();
//Information
console.log(canvas.getWidth());

//Bind
$('.tools').on('click', 'a', function(){
  var className = $(this).attr('class');
  switch(className){
    case 'js-add-rect':
      Artboard.addRect();
      break;
    case 'js-add-circle':
      Artboard.addCircle();
      break;
    case 'js-add-triangle':
      Artboard.addTriangle();
      break;
    case 'js-dispose':
      Artboard.dispose();
      break;
    case 'js-add-video':
      Artboard.addVideo();
  }
})
$('.objectControl').on('click', 'button', function(){
  var className = $(this).attr('class');
  switch(className){
    case 'js-delete':
      Artboard.removeObject();
      break;
  }
})

function bindEvents(obj) {
  obj.on('selected', function() {
    console.log('selected');
    $('.objectControl').addClass('active');
    instantMeta(obj);
  });
  //deselect
  canvas.on('before:selection:cleared', function() {
    console.log('deselected');
    $('.objectControl').removeClass('active');
    instantMeta(obj);
  });

  //Scaling
  obj.on('scaling', function() {
    console.log('scaling');
    instantMeta(obj);
  });
  //Moving
  obj.on('moving', function() {
    console.log('moving');
    instantMeta(obj);
  });
  //Rotating
  obj.on('rotating', function() {
    console.log('rotating');
    instantMeta(obj);
  });
}

function instantMeta(obj) {
  console.log(obj);
  var width,
      height,
      radius,
      left,
      top,
      angle,
      type;

  width = obj.width*obj.scaleX;
  height = obj.height*obj.scaleY;
  radius = obj.radius;
  left = obj.left;
  top = obj.top;
  angle = obj.angle;
  type = obj.type;

  $('.information .type span').html(type);
  $('.information .width span').html(width);
  $('.information .height span').html(height);
  $('.information .radius span').html(radius);
  $('.information .angle span').html(angle);
  $('.information .position .top span').html(top);
  $('.information .position .left span').html(left);
}

function logObj() {
  $('#console .shapeobj .content').html(JSON.stringify(canvas.toJSON()));
  $('#console .canvasobj .content').html(JSON.stringify(canvas));

  // fabric.log(canvas.toJSON());
}