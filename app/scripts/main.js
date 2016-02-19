//Extend Attributes for Image Array
fabric.Object.prototype.media = {
  'slides' : [],
  'video' : ''
}

//Setting Up Canvas
var canvas = new fabric.Canvas('c', {
  selectionColor: 'blue',
  selectionLineWidth: 2,
  width: 800,
  height: 600
  // ...
});
var container = document.getElementById('artboard');
var paintArea = document.getElementById('canvas');
// canvas.wrapperEl.style.transform = "scale(.8)";
artboardScale();
function artboardScale() {
  var aspectRatio = canvas.width/canvas.height;
  var ratioW = canvas.width/container.clientWidth,
      ratioH = canvas.height/container.clientHeight;

  console.log('W:' + ratioW);
  console.log('H:' + ratioH);
  var motive;
  if (ratioW >= ratioH) {
    if (ratioW > 1) {
      ratioW = container.clientWidth/canvas.width;
      motive = ratioW*ratioW;
      console.log(ratioW);
      if (motive > 1) {
        motive = 1;
      }
      paintArea.style.transform = "scale(" + motive + ")";
      paintArea.style.transformOrigin = "25% 25%";
    } else {
      motive = 1;
      paintArea.style.transform = "scale(" + motive + ")";
      paintArea.style.transformOrigin = "25% 25%";
    }
  } else if (ratioW < ratioH){
    if (ratioH > 1) {
      ratioH = container.clientHeight/canvas.height;
      motive = ratioH*ratioH;
      console.log(ratioH);
      if (motive > 1) {
        motive = 1;
      }
      paintArea.style.transform = "scale(" + motive + ")";
      paintArea.style.transformOrigin = "45% 25%";
    } else {
      motive = 1;
      paintArea.style.transform = "scale(" + motive + ")";
      paintArea.style.transformOrigin = "25% 25%";
    }
  }
}

$(window).resize(function(){
  artboardScale();
})


//Listener
  //Canvas Attrs Control
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

  //Object Attr Control
    //Media
    $('#mediaValue').on("keyup", function() {
      console.log('got one');
      var obj = canvas.getActiveObject();
      if (obj.type === 'rect') {
        var newImage = $(this).val();
        console.log(newImage);
        obj.remove();
        Artboard.addMedia(newImage);
        
        // var newImage = canvas.getActiveObject();
        // console.log(newImage);
        // newImage.setSrc($(this).val(), function(oImg){
        //   canvas.renderAll();
        // })
      } else {
        obj.setSrc($(this).val(), function(oImg){
          canvas.renderAll();
        })
      }
    });

    //Size

    $('.objectSize').on("change paste keyup", function() {
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
      canvas.renderAll();
    });

    





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

var Artboard = (function (){
  return {
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
      //Programmatically Select Newly Added Object
      canvas.setActiveObject(rect);
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
      // video.crossOrigin = "";
      // video.perPixelTargetFind = true;
      canvas.add(video);
      video.getElement().play();

      //Bind
      bindEvents(video);
      //Programmatically Select Newly Added Object
      canvas.setActiveObject(video);
      //Refresh log
      logObj();

      fabric.util.requestAnimFrame(function render() {
        canvas.renderAll();
        fabric.util.requestAnimFrame(render);
      });
    },
    addMedia : function(objImage) {
      console.log('obj:' + objImage);
      // var newImage = objImage;
      if (objImage === '' || objImage === undefined) {
        objImage = 'images/uploads/abc.png';
        console.log(objImage);
      } else {
        console.log(objImage);
      }
      //Add Image/Video
      var media = new fabric.Image.fromURL(objImage, function(oImg) {
        oImg.set({
          'left': canvas.getWidth()/2-oImg.width/2,
          'top': canvas.getHeight()/2-oImg.height/2
        });
        canvas.add(oImg);
        oImg.toObject = (function(toObject) {
          return function() {
            return fabric.util.object.extend(toObject.call(this), {
              media: {
                slides : this.media.slides,
                video: this.media.video
              }
            });
          };
        })(oImg.toObject);
        canvas.renderAll();
        //Bind
        bindEvents(oImg);
        //Programmatically Select Newly Added Object
        canvas.setActiveObject(oImg);
        //Refresh log
        logObj();
      });
    },
    dispose : function() {
      // canvas.deactivateAllWithDispatch();
      canvas.clear();
      //Refresh log
      logObj();
    },
    removeObject: function() {
      var obj = canvas.getActiveObject();
      if (obj._element !== undefined && obj._element.localName === "video") {
        obj.getElement().pause();
        obj.remove();
      } else {
        obj.remove();
      }

    },
    reset : function() {
      // var size = canvas.getActiveObject().getOriginalSize();
      var obj = canvas.getActiveObject();
      obj.setScaleX('1');
      obj.setScaleY('1');
      canvas.renderAll();
    }
  }
} ());

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
    case 'js-add-media':
      Artboard.addMedia();
      break;
    case 'js-add-video':
      Artboard.addVideo();
      break;
  }
})

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

function bindEvents(obj) {
  obj.on('selected', function() {
    console.log('selected');
    $('.objectControl').addClass('active');
    instantMeta.log(obj);
  });
  //deselect
  canvas.on('before:selection:cleared', function() {
    console.log('deselected');
    $('.objectControl').removeClass('active');
    instantMeta.clean();
  });

  //Scaling
  obj.on('scaling', function() {
    console.log('scaling');
    instantMeta.log(obj);
  });
  //Moving
  obj.on('moving', function() {
    console.log('moving');
    instantMeta.log(obj);
  });
  //Rotating
  obj.on('rotating', function() {
    console.log('rotating');
    instantMeta.log(obj);
  });
}

var instantMeta = {
  log: function(obj){
    console.log(obj);
    var width,
        height,
        radius,
        left,
        top,
        angle,
        type,
        media;

    width = obj.width*obj.scaleX;
    height = obj.height*obj.scaleY;
    radius = obj.radius;
    left = obj.left;
    top = obj.top;
    angle = obj.angle;
    type = obj.type;
    //混合物件
    if (type === "image") {
      if (obj.media.video != '') {
        media = obj.media.video;
      } else if ( obj.media.slides.length != 0 ) {
        media = obj.media.slides;
      } else if ( obj.toObject().src != ''){
        media = obj.toObject().src;
      } else {
        alert('Type Error');
      }
    }
    // media = obj.media.video;

    $('.attributes-wrapper .type input').val(type);
    $('.attributes-wrapper .width input').val(width);
    $('.attributes-wrapper .height input').val(height);
    $('.attributes-wrapper .radius input').val(radius);
    $('.attributes-wrapper .angle input').val(angle);
    $('.attributes-wrapper .top input').val(top);
    $('.attributes-wrapper .left input').val(left);
    $('.attributes-wrapper .media input').val(media);
    logObj();
  },
  clean: function(obj){
    $('.attributes-wrapper input').val('');
    console.log('clean');
  }
}
// function instantMeta(obj) {
  
// }

function logObj() {
  $('#console .shapeobj .content').html(JSON.stringify(canvas.toJSON()));
  $('#console .canvasobj .content').html(JSON.stringify(canvas));

  // fabric.log(canvas.toJSON());
}
