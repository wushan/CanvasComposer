//init Slider
/////////////////////////
// var imageset = [];
//     imageset[0] = {src: 'http://twimg.edgesuite.net/images/thumbnail/other/f4d3e017ac4a72d6d24d087197b2eba7.jpg', continued: 5};
//     imageset[1] = {src: 'http://stories.gettyimages.com/wp-content/uploads/2015/08/GettyImages-557187411-11.jpg', continued: 3};
//     imageset[2] = {src: 'http://twimg.edgesuite.net/images/thumbnail/other/c3f2a6e793af2ab3ac2b99a1d353fc8f.jpg', continued: 5};
// var imgtest = 'http://twimg.edgesuite.net/images/thumbnail/other/c3f2a6e793af2ab3ac2b99a1d353fc8f.jpg';
// console.log(imageset);



///////////////////////////////////////
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
        Multimedia.slider(objImage);
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
    slider : function(imageset) {
      //Add Mixed Slider
      var slider = new fabric.Image.fromURL(imageset[0].src, function(res){
  

      //Create Static Canvas
      var patternSourceCanvas = new fabric.StaticCanvas();
      patternSourceCanvas.add(res);

      //Create Pattern via res
      var pattern = new fabric.Pattern({
        source: function() {
          //Set Static Canvas Dimension
          patternSourceCanvas.setDimensions({
            width: res.getWidth(),
            height: res.getHeight()
          });
          return patternSourceCanvas.getElement();
        },
        repeat: 'no-repeat'
      });
      //Create Frame
      var frame = new fabric.Slider({
        left: canvas.getWidth()/2-res.getWidth()/2,
        top: canvas.getHeight()/2-res.getHeight()/2,
        fill: pattern,
        width: res.getWidth(),
        height: res.getHeight()
      })

      canvas.add(frame);

      frame.toObject = (function(toObject) {
        return function() {
          return fabric.util.object.extend(toObject.call(this), {
            slides: [imageset]
          });
        };
      })(frame.toObject);
      console.log(frame);
      canvas.renderAll();
      var i = 0;
      var leastTime = imageset[0].continued*1000;
      // var counter;
      var counter = setInterval(function(){objectSlider(i)}, leastTime);
      // objectSlider(i);
      function objectSlider(i) {
        counter = clearInterval(counter);
        console.log(imageset);
        if (i === imageset.length) {
          i = 0;
        }
        
        console.log(i);
        // console.log(patternSourceCanvas);
        // console.log(patternSourceCanvas._objects[0].getElement());
        var element = patternSourceCanvas._objects[0];
        element.remove();
        var media = new fabric.Image.fromURL(imageset[i].src, function(oImg) {
          // oImg.set({
          //   'left': canvas.getWidth()/2-oImg.width/2,
          //   'top': canvas.getHeight()/2-oImg.height/2
          // });
          patternSourceCanvas.add(oImg);
          console.log(pattern);
          // pattern.source(patternSourceCanvas.setDimensions({
          //   width: oImg.getWidth()*oImg.getScaleX(),
          //   height: oImg.getHeight()*oImg.getScaleY()
          // }));
          patternSourceCanvas.setDimensions({
            width: frame.getWidth(),
            height: frame.getHeight()
          })
          oImg.scaleToWidth(frame.getWidth());
          console.log(patternSourceCanvas);
          console.log(patternSourceCanvas.getWidth());
          console.log(frame.getWidth());
          console.log(frame);
          console.log(oImg.getWidth());
          patternSourceCanvas.renderAll();
          canvas.renderAll();
        });
        // console.log(i);
        // element.setSrc(imageset[i].src);
        // element.scaleToWidth(frame.getWidth());

        leastTime = imageset[i].continued*1000;
        console.log(leastTime);
        // element.src = 'http://www.sony.net/Products/di/common/images/products/lenses/lineup/detail/sel55f18z/photo_4.jpg';
        
        
        counter = setInterval(function(){objectSlider(i)}, leastTime);
        i++;
      }
      // counter = clearInterval(counter);
      //Bind
      bindEvents(frame);
      //Programmatically Select Newly Added Object
      canvas.setActiveObject(frame);
      //Refresh log
      logObj();
    });
    },
    clock : function() {
      //Add Clock Object
    },
    iframe : function() {
      //Get Screen Shot Only
    }
  }
} ());
