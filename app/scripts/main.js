var initRadius = 100;

var Artboard = (function (){
  return {
    addRect : function(){
      var rect = new fabric.Rect({
        left: canvas.getWidth()/2-initRadius/2,
        top: canvas.getHeight()/2-initRadius/2,
        fill: '#cccccc',
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
        fill: '#cccccc',
        radius: initRadius/2
      });
      circle.perPixelTargetFind = true;
      canvas.add(circle);
      //Bind
      bindEvents(circle);
      //Programmatically Select Newly Added Object
      canvas.setActiveObject(circle);
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
        //If objImage is an Array
      } else {
        //Add Image or Video ((Single))
        //extension
        var extension = objImage.split('.').pop();
        var media;
        var youtubeId = validateYouTubeUrl(objImage);
        if (youtubeId != false) {
          //If It is from Youtube
          var thumbnail = getThumbnails(youtubeId, function(res){
            console.log(res);
            //Add Single Image
            Multimedia.video(res, youtubeId);
          });
        } else {
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
      instantMeta.log(obj);
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
    video : function(source, youtubeId) {
      if ( youtubeId != undefined ) {
        console.log(source);
        var media = new fabric.Video.fromURL(source, function(oImg) {
          oImg.set({
            'left': canvas.getWidth()/2-oImg.width/2,
            'top': canvas.getHeight()/2-oImg.height/2

          });
          canvas.add(oImg);
          oImg.center();
          oImg.setCoords();
          // console.log(media);
          canvas.renderAll();
          //Bind
          bindEvents(oImg);
          //Programmatically Select Newly Added Object
          canvas.setActiveObject(oImg);
          //Refresh log
          logObj();
        });
      } else {
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

        var video = new fabric.Video(videoEl, {});

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
      }
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
