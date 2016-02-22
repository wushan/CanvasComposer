//Extend Attributes for Fabric Objects
  fabric.Object.prototype.media = {
    'slides' : [],
    'video' : ''
  }

//*Setting Up Canvas
  var canvas = new fabric.Canvas('c', {
                selectionColor: 'blue',
                selectionLineWidth: 2,
                width: 800,
                height: 600
                // ...
              }),
              grid = 50,
              threshold = grid * 0.2;
  // draw grid
  // for (var i = 0; i < (canvas.width / grid); i++) {
  //     canvas.add(new fabric.Line([ i * grid, 0, i * grid, canvas.width], { stroke: '#ccc', selectable: false }));
  //     canvas.add(new fabric.Line([ 0, i * grid, canvas.width, i * grid], { stroke: '#ccc', selectable: false }));
  // }

  canvas.on('object:moving', snapMoveToGrid);
  canvas.on('object:scaling', snapScaleToGrid);
  canvas.on('object:moving', fixBoundaries);
  canvas.on('object:scaling', fixBoundaries);
  function roundToGrid(value) {
     return Math.round(value / grid) * grid;  
  }

  function fixBoundaries(options){
      if (!options.target) return;
      var t = options.target,
          update = false,
              tBounds = {
                  left: t.left,
                  right: t.left + t.width * t.scaleX,
                  top: t.top,
                  bottom: t.top + t.height * t.scaleY
              },
              cBounds = {
                  left: 0,
                  top: 0,
                  right: canvas.getWidth(),
                  bottom: canvas.getHeight()
              },
          coords = {};
          
      if (tBounds.left < cBounds.left) {
           update = true;
           coords.left = cBounds.left;
      }
      
      if (tBounds.top < cBounds.top) {
           update = true;
           coords.top = cBounds.top;
      }
      
      if (tBounds.right > cBounds.right) {
           update = true;
           coords.left = tBounds.left - (tBounds.right - cBounds.right);
      }
      
      if (tBounds.bottom > cBounds.bottom) {
           update = true;
           coords.top = tBounds.top - (tBounds.bottom - cBounds.bottom);
      }
      
      if (update) {
          t.set(coords);
          canvas.renderAll();
      }
      
      return options;
  }

  function snapMoveToGrid(ev) {
      var t = ev.target,
          w = t.width * t.scaleX,
          h = t.height * t.scaleY,
          snap = {   // Closest snapping points
              top: roundToGrid(t.top),
              left: roundToGrid(t.left),
              bottom: roundToGrid(t.top + h),
              right: roundToGrid(t.left + w)
          },
          dist = {   // Distance from snapping points
              top: Math.abs(snap.top - t.top),
              left: Math.abs(snap.left - t.left),
              bottom: Math.abs(snap.bottom - t.top - h),
              right: Math.abs(snap.right - t.left - w)
          };
      
      if (dist.bottom < dist.top) {
          if (dist.bottom > threshold)
              snap.top = t.top; // don't snap
          else
              snap.top = snap.bottom - h;
      }
      else if (dist.top > threshold)
          snap.top = t.top; // don't snap
      
      if (dist.right < dist.left) {
          if (dist.right > threshold)
              snap.left = t.left; // don't snap
          else
              snap.left = snap.right - w;
      }
      else if (dist.left > threshold)
          snap.left = t.left; // don't snap
      
      t.set({
          top: snap.top,
          left: snap.left
      });
  }

  function snapScaleToGrid(options) {
      var target = options.target,
          w = target.getWidth(),
          h = target.getHeight(),
          snap = {   // Closest snapping points
              top: roundToGrid(target.top),
              left: roundToGrid(target.left),
              bottom: roundToGrid(target.top + h),
              right: roundToGrid(target.left + w)
          },
          dist = {   // Distance from snapping points
              top: Math.abs(snap.top - target.top),
              left: Math.abs(snap.left - target.left),
              bottom: Math.abs(snap.bottom - target.top - h),
              right: Math.abs(snap.right - target.left - w)
          },
          attrs = {
              scaleX: target.scaleX,
              scaleY: target.scaleY,
              top: target.top,
              left: target.left
          };
      
      switch(target.__corner) {
          case 'tl':
              if (dist.left < dist.top && dist.left < threshold) {
                  attrs.scaleX = (w - (snap.left - target.left)) / target.width;
                  attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
                  attrs.top = target.top + (h - target.height * attrs.scaleY);
                  attrs.left = snap.left;
              }
              else if (dist.top < threshold) {
                  attrs.scaleY = (h - (snap.top - target.top)) / target.height;
                  attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
                  attrs.left = attrs.left + (w - target.width * attrs.scaleX);
                  attrs.top = snap.top;
              }
              break;
          case 'mt':
              if (dist.top < threshold) {
                  attrs.scaleY = (h - (snap.top - target.top)) / target.height;
                  attrs.top = snap.top;
              }
              break;
          case 'tr':
              if (dist.right < dist.top && dist.right < threshold) {
                  attrs.scaleX = (snap.right - target.left) / target.width;
                  attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
                  attrs.top = target.top + (h - target.height * attrs.scaleY);
              }
              else if (dist.top < threshold) {
                  attrs.scaleY = (h - (snap.top - target.top)) / target.height;
                  attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
                  attrs.top = snap.top;
              }
              break;
          case 'ml':
              if (dist.left < threshold) {
                  attrs.scaleX = (w - (snap.left - target.left)) / target.width;
                  attrs.left = snap.left;
              }
              break;
          case 'mr':
              if (dist.right < threshold)
                  attrs.scaleX = (snap.right - target.left) / target.width;
              break;
          case 'bl':
              if (dist.left < dist.bottom && dist.left < threshold) {
                  attrs.scaleX = (w - (snap.left - target.left)) / target.width;
                  attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
                  attrs.left = snap.left;
              }
              else if (dist.bottom < threshold) {
                  attrs.scaleY = (snap.bottom - target.top) / target.height;
                  attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
                  attrs.left = attrs.left + (w - target.width * attrs.scaleX);
              }
              break;
          case 'mb':
              if (dist.bottom < threshold)
                  attrs.scaleY = (snap.bottom - target.top) / target.height;
              break;
          case 'br':
              if (dist.right < dist.bottom && dist.right < threshold) {
                  attrs.scaleX = (snap.right - target.left) / target.width;
                  attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
              }
              else if (dist.bottom < threshold) {
                  attrs.scaleY = (snap.bottom - target.top) / target.height;
                  attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
              }
              break;
      }
      
      target.set(attrs);
  }
//*End Canvas Restrictions

//Scale Canvas to fit viewport
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


//Panel Inputs Control
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
    //Media //Bind OnChange to avoid 'undefined'
    $('#mediaValue').on("change keyup", function() {
      console.log('got one');
      var obj = canvas.getActiveObject();
      
        var newImage = $(this).val();
        console.log(newImage);
        if (obj._element !== undefined && obj._element.localName === "video") {
          obj.getElement().pause();
          obj.remove();
        } else {
          obj.remove();
        }
        Artboard.addMedia(newImage);
        canvas.renderAll();
        obj.center();
        obj.setCoords();
        logObj();
    });

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
      canvas.renderAll();
    });

//Refresh canvas size
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
    // addCircle : function(){
    //   var circle = new fabric.Circle({
    //     left: canvas.getWidth()/2-initRadius/2,
    //     top: canvas.getHeight()/2-initRadius/2,
    //     fill: 'rgba(0,0,0,0.33)',
    //     radius: initRadius/2
    //   });
    //   circle.perPixelTargetFind = true;
    //   canvas.add(circle);
    //   //Bind
    //   bindEvents(circle);
    //   //Refresh log
    //   logObj();
    // },
    // addTriangle : function(){
    //   var triangle = new fabric.Triangle({
    //     left: canvas.getWidth()/2-initRadius/2,
    //     top: canvas.getHeight()/2-initRadius/2,
    //     fill: 'rgba(0,0,0,0.33)',
    //     width: initRadius,
    //     height: initRadius
    //   });
    //   //Set Perpixel Movement
    //   triangle.perPixelTargetFind = true;
    //   canvas.add(triangle);
    //   //Bind
    //   bindEvents(triangle);
    //   //Refresh log
    //   logObj();
    // },
    
    addMedia : function(objImage) {
      console.log('obj:' + objImage);
      // var newImage = objImage;
      if (objImage === '' || objImage === undefined) {
        //default image
        objImage = 'images/uploads/abc.png';
        console.log(objImage);
      } else {
        console.log(objImage);
      }
      //Add Image or Video
        //extension
        var extension = objImage.split('.').pop();
        var media;
        console.log(extension);

        if (extension.match(/^(gif|jpg|jpeg|tiff|svg)$/)) {
          //If is image file
          console.log('match');
          media = new fabric.Image.fromURL(objImage, function(oImg) {
            oImg.set({
              'left': canvas.getWidth()/2-oImg.width/2,
              'top': canvas.getHeight()/2-oImg.height/2
            });
            canvas.add(oImg);
            oImg.center();
            oImg.setCoords();
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
            // console.log(media);
            canvas.renderAll();

            //Bind
            bindEvents(oImg);
            //Programmatically Select Newly Added Object
            canvas.setActiveObject(oImg);
            //Refresh log
            logObj();
          });
        } else if (extension.match(/^(mp4|avi|ogg|ogv|webm)$/)) {
          //if is video file
          console.log('match video');
          //Set InitRadius for Videos 16:9
          var w = initRadius*1.6;
          var h = initRadius*0.9;

          var videoEl = document.createElement("video");
          videoEl.loop = true;
          videoEl.controls = true;
          console.log(videoEl);
          videoEl.innerHTML = '<source src="'+ objImage +'">';

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
        } else {
          console.log('不支援此檔案格式，請重試');
        }
    },
    dispose : function() {
      // canvas.deactivateAllWithDispatch();
      var obj;
      for (var i=0; i<canvas._objects.length; i++) {
        // obj = canvas._objects[i];
        if (canvas._objects[i]._element !== undefined && canvas._objects[i]._element.localName === "video") {
          canvas._objects[i].getElement().pause();
        } else {
          console.log( 'error' );
        }
      }
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
      // reset to original size
      obj.setScaleX('1');
      obj.setScaleY('1');
      //align to center of the canvas
      obj.center();
      obj.setCoords();
      canvas.renderAll();
    }
  }
} ());

//Get Objects
canvas.getObjects();
//Information
console.log(canvas.getWidth());

//Bind Keys
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

//Keyboard
var map = {8: false, 91: false};
$(document).keydown(function(e) {
    if (e.keyCode in map) {
        map[e.keyCode] = true;
        if (map[8] && map[91]) {
          Artboard.removeObject();
        }
    }
}).keyup(function(e) {
    if (e.keyCode in map) {
        map[e.keyCode] = false;
    }
});

// $("html").keydown(function(e) {
//     e.keyCode; // this value
//     console.log(typeof e.keyCode);
// });

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
