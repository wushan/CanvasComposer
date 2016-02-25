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
    $('.js-library').on('click', function(){
      $('#mediaLibrary').addClass('active');
      selected.length = 0;
      $('#mediaLibrary .selection').empty();
      $('#mediaLibrary .resources a').removeClass('active');
    })
    $('#mediaLibrary .js-close').on('click', function(){
      $('#mediaLibrary').removeClass('active');
    })
    var selected = [];
    $('#mediaLibrary .resources').on('click','a',function(){
      $(this).toggleClass('active');
      var filename,
          src,
          count,
          continued,
          resourceid,
          targetid;
      
      src = $(this).attr('data-src');
      filename = $(this).find('.filename').html();
      resourceid = $(this).attr('data-resourceid');
      continued = "5";

      // $('.settings-container .selection li').each(function(){
      //   targetid = $(this).attr('data-resourceid');
      //   if ( targetid != undefined ) {
      //     selected.push(targetid);
      //     console.log(selected);
      //   }
      // })
      var $item = "<li data-resourceid="+ resourceid +"><div class='order'><div class='continued'><input type='number' value='" + continued + "'></div></div><div class='description'><div class='filename'>" + filename + "</div></div></li>";
      if (in_array(selected, resourceid)) {
        $('.settings-container .selection li').each(function(){
          var targetid = $(this).attr('data-resourceid');
          if (targetid === resourceid) {
            //Remove self
            $(this).remove();
            //Remove this id in Array
            var index = getIdx(selected, 'id', targetid);
            if (index > -1) {
              selected.splice(index, 1);
            }
            
            console.log(selected);
          }
        })
      } else {
        $('.settings-container .selection').append($item);
        var ooo = {'id':resourceid, 'src':src, 'continued': continued};
        selected.push(ooo);
        console.log(selected);
      }
    })
    function getIdx(list, key, val){
      return _.chain(list).pluck(key).indexOf(val).value();
    }
    function in_array(array, id) {
        for(var i=0;i<array.length;i++) {
          console.log(array[i]);
            if(array[i].id === id)
              return true;
        }
        return false;
    }
    //Send Object to Fabricjs
    $('.js-sendToObj').on('click', function(){
      if (selected.length === 1) {
        var resource = selected[0].src;
        $('#mediaValue').val(resource);
        var obj = canvas.getActiveObject();
        var newImage = resource;
        console.log(newImage);
        if (obj == null) {
          alert('未選取任何物件');

        } else {
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
        }
        $(this).parents('#mediaLibrary').removeClass('active');
      } else if (selected.length > 1){
        //If Array
        var obj = canvas.getActiveObject();
        // var selectedObjs = [];
        if (obj == null) {
          alert('未選取任何物件');

        } else {
          obj.remove();
        }
        Artboard.addMedia(selected);
        canvas.renderAll();
        obj.center();
        obj.setCoords();
        logObj();
        $(this).parents('#mediaLibrary').removeClass('active');
        
      } else {
        alert('未選擇任何素材');
      }
    })
    // $('#mediaLibrary .resources').on('click', 'a', function(){
    //   var resource = $(this).attr('data-src');
    //   $('#mediaValue').val(resource);
    //   console.log('got one');
    //   var obj = canvas.getActiveObject();
      
    //   var newImage = resource;-
    //   console.log(newImage);
    //   if (obj == null) {
    //     alert('未選取任何物件');

    //   } else {
    //     if (obj._element !== undefined && obj._element.localName === "video") {
    //       obj.getElement().pause();
    //       obj.remove();
    //     } else {
    //       obj.remove();
    //     }
    //     Artboard.addMedia(newImage);
    //     canvas.renderAll();
    //     obj.center();
    //     obj.setCoords();
    //     logObj();
    //   }
      
    //   $(this).parents('#mediaLibrary').removeClass('active');
    // })
    

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
    addMedia : function(objImage) {
      if (objImage === '' || objImage === undefined) {
        //Default image
        objImage = 'images/uploads/abc.png';
      } else {
      }

      //Check if it is an Slide Array
      if (Object.prototype.toString.call( objImage ) === '[object Array]') {
        //Add Image ((Multiple))
        // console.log(objImage.length);
        var id,
            continued = 0,
            src;
        var index = 0;
        var leastTime,
            counter;
        //Create Image Object with first SRC
        var extension = objImage[0].src.split('.').pop();
        var media;
        console.log(extension);

        if (extension.match(/^(gif|png|jpg|jpeg|tiff|svg)$/)) {
          //If is image file
          console.log('match');
          var padding = 0;
          media = new fabric.Image.fromURL(objImage[0].src, function(oImg) {
            

            var patternSourceCanvas = new fabric.StaticCanvas();
            patternSourceCanvas.add(oImg);

            var pattern = new fabric.Pattern({
              source: function() {
                patternSourceCanvas.setDimensions({
                  width: oImg.getWidth() + padding,
                  height: oImg.getHeight() + padding
                });
                return patternSourceCanvas.getElement();
              },
              repeat: 'no-repeat'
            });
            var frame = new fabric.Rect({
                left: canvas.getWidth()/2-oImg.getWidth()/2,
                top: canvas.getHeight()/2-oImg.getHeight()/2,
                fill: pattern,
                width: oImg.getWidth() + padding,
                height: oImg.getHeight() + padding
              })
            canvas.add(frame);
            frame.toObject = (function(toObject) {
              return function() {
                return fabric.util.object.extend(toObject.call(this), {
                  id: 1,
                  media: {
                    slides : objImage,
                    video: this.media.video
                  }
                });
              };
            })(frame.toObject);

            canvas.renderAll();

            //Bind
            bindEvents(frame);
            //Programmatically do the image slide
            //Exeacute
            objSlider(index, objImage, oImg, frame, pattern, patternSourceCanvas );
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
          canvas.add(video);
          video.getElement().play();
          video.toObject = (function(toObject) {
              return function() {
                return fabric.util.object.extend(toObject.call(this), {
                  media: {
                    slides : this.media.slides,
                    video: objImage
                  }
                });
              };
            })(video.toObject);
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
        ///////////////////////////////////
        
        
        function objSlider(index, objImage, oImg, frame, pattern, patternSourceCanvas ){
          counter = clearInterval(counter);
          console.log(pattern.source());

          // setDimensions({width: 10, height:10});
          if (index === objImage.length) {
            index = 0;
          }
          // patternSourceCanvas.renderAll();
          // canvas.renderAll();
          // oImg.scaleToWidth(frame.getWidth());
          patternSourceCanvas.setDimensions({
            width: frame.getWidth() + padding,
            height: frame.getHeight() + padding
          });
          patternSourceCanvas.renderAll();
          canvas.renderAll();
          

          oImg.setSrc(objImage[index].src, function(objBack){
            oImg.scaleToWidth(frame.getWidth());
            patternSourceCanvas.renderAll();
            canvas.renderAll();
            //Refresh log
            logObj();
          });
          console.log(oImg);
          /////////////End Media
          leastTime = objImage[index].continued*1000;
          console.log(leastTime);
          index++;
          counter = setInterval(function(){objSlider(index, objImage, oImg, frame, pattern, patternSourceCanvas )}, leastTime);
        }

        
      } else {
        //Add Image or Video ((Single))
        //extension
        var extension = objImage.split('.').pop();
        var media;
        console.log(extension);
        var youtubeId = validateYouTubeUrl(objImage);

        if (youtubeId != false) {
          //If It is from Youtube
          YoutubeVideo(youtubeId, function(video){
            console.log(video.title);
            var webm = video.getSource("video/webm", "medium");
            console.log("WebM: " + webm.url);
            var mp4 = video.getSource("video/mp4", "medium");
            console.log("MP4: " + mp4.url);

          });
        } else {

        }
        
        if (extension.match(/^(gif|png|jpg|jpeg|tiff|svg)$/)) {
          //Add Single Image
          Multimedia.image(objImage);
        } else if (extension.match(/^(mp4|avi|ogg|ogv|webm)$/)) {
          //Add Single Video
          Multimedia.video(objImage);
        } else {
          console.log('不支援此檔案格式，請重試');
        }
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

//Add Media
var Multimedia = (function (){
  return {
    image : function(source) {
      //Add Single Image
      var media = new fabric.Image.fromURL(source, function(oImg) {
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
              id: 1,
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
    },
    video : function(source) {
      //Add Single Video
      //if is video file
      console.log('match video');
      //Set InitRadius for Videos 16:9
      var vw;
      var vh;

      var videoEl = document.createElement("video");
      videoEl.loop = true;
      videoEl.controls = true;
      console.log(videoEl);
      videoEl.innerHTML = '<source src="'+ source +'">';

      var video = new fabric.Image(videoEl, {});

      canvas.add(video);
      videoEl.onloadeddata = function() {
        vw = this.videoWidth;
        vh = this.videoHeight;
        video.setWidth(vw);
        video.setHeight(vh);
        video.center();
        video.setCoords();
        canvas.renderAll();
      };
      //Auto Play Video
      video.getElement().play();
      video.toObject = (function(toObject) {
          return function() {
            return fabric.util.object.extend(toObject.call(this), {
              media: {
                video: source
              }
            });
          };
        })(video.toObject);
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
    slider : function() {
      //Add Mixed Slider
    },
    clock : function() {
      //Add Clock Object
    },
    iframe : function() {
      //Get Screen Shot Only
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
    console.log(obj.toObject());
    var width,
        height,
        radius,
        left,
        top,
        angle,
        type,
        media,
        preview;

    width = obj.width*obj.scaleX;
    height = obj.height*obj.scaleY;
    radius = obj.radius;
    left = obj.left;
    top = obj.top;
    angle = obj.angle;
    type = obj.type;
    //混合物件
    if (type === "image") {
      if (obj.toObject().media.video != '') {
        media = obj.toObject().media.video;
        preview = "<video controls autoplay muted><source src=" + obj.toObject().media.video + "></source></video>";
        console.log(media);
      } else if ( obj.toObject().media.slides.length != 0 ) {
        media = obj.toObject().media.slides;
        preview = "";
      } else if ( obj.toObject().src != ''){
        media = obj.toObject().src;
        preview = "<img src=" + obj.toObject().src + ">";
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
    $('.attributes-wrapper .mediaPreview').html(preview);
    logObj();
  },
  clean: function(obj){
    $('.attributes-wrapper input').val('');
    $('.attributes-wrapper .mediaPreview').empty();
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
