
CanvasComposer.Artboard = {
  addRect : function(){
      var rect = new fabric.Rect({
        left: canvas.getWidth()/2-initRadius/2,
        top: canvas.getHeight()/2-initRadius/2,
        fill: '#'+Math.floor(Math.random()*16777215).toString(16),
        width: initRadius,
        height: initRadius,
        padding: 0,
        strokeWidth: 0
      });
      rect.toObject = (function(toObject) {
        return function() {
          return fabric.util.object.extend(toObject.call(this), {
            link: this.link
          });
        };
      })(rect.toObject);
      rect.perPixelTargetFind = true;
      canvas.add(rect);
      //Bind
      bindEvents(rect);
      //Programmatically Select Newly Added Object
      canvas.setActiveObject(rect);
      //Refresh log
      
    },
  addUsb : function(){
    var bg = new fabric.Rect({
        fill: '#333333',
        width: initRadius*2,
        height: initRadius*2,
        left: 0,
        top: 0,
        padding: 0,
        strokeWidth: 0,
        originX: 'center',
        originY: 'center'
      });
    var text = new fabric.Text('<USB Frame>', {
        left: 0,
        top: 0,
        fontSize: '14',
        fontFamily: 'Open sans',
        textAlign: 'center',
        fill: '#cccccc',
        originX: 'center',
        originY: 'center'
      });

    var group = new fabric.Usbframe([bg,text],{
        left: canvas.getWidth()/2-initRadius/2,
        top: canvas.getHeight()/2-initRadius/2,
        padding: 0,
        strokeWidth: 0
      });
      
      group.toObject = (function(toObject) {
        return function() {
          return fabric.util.object.extend(toObject.call(this), {
            link: this.link
          });
        };
      })(group.toObject);
      group.perPixelTargetFind = true;
      canvas.add(group);
      //Bind
      bindEvents(group);
      //Programmatically Select Newly Added Object
      canvas.setActiveObject(group);
      //Refresh log
  },
  addWeb : function(url){
    if (url == undefined) {
      url = 'http://www.google.com';
    }
    var bg = new fabric.Rect({
        // left: canvas.getWidth()/2-initRadius/2,
        // top: canvas.getHeight()/2-initRadius/2,
        fill: '#333333',
        width: initRadius*2,
        height: initRadius*2,
        left: 0,
        top: 0,
        padding: 0,
        strokeWidth: 0,
        originX: 'center',
        originY: 'center'
      });

    var text = new fabric.Text('<WebView>', {
        left: 0,
        top: 0,
        fontSize: '14',
        fontFamily: 'Open sans',
        textAlign: 'center',
        fill: '#cccccc',
        originX: 'center',
        originY: 'center'
      });

    var group = new fabric.Webview([bg,text],{
        left: 0,
        top: 0
      });
      
    group.toObject = (function(toObject) {
      return function() {
        return fabric.util.object.extend(toObject.call(this), {
          webview: url,
          link: this.link
        });
      };
    })(group.toObject);
    
    group.perPixelTargetFind = true;
    canvas.add(group);
    //Bind
    bindEvents(group);
    //Programmatically Select Newly Added Object
    canvas.setActiveObject(group);
    //Refresh log
  },
  addCircle : function(){
    var circle = new fabric.Circle({
      left: canvas.getWidth()/2-initRadius/2,
      top: canvas.getHeight()/2-initRadius/2,
      fill: '#'+Math.floor(Math.random()*16777215).toString(16),
      radius: initRadius/2
    });
    circle.toObject = (function(toObject) {
      return function() {
        return fabric.util.object.extend(toObject.call(this), {
          link: this.link
        });
      };
    })(circle.toObject);
    circle.perPixelTargetFind = true;
    canvas.add(circle);
    //Bind
    bindEvents(circle);
    //Programmatically Select Newly Added Object
    canvas.setActiveObject(circle);
    //Refresh log
    
  },
  addText : function(){
    var text = new fabric.Textbox('預設文字',{
      //options
      left: 200,
      top: 200,
      width: 300,
      height: 300,
      fontSize: 24
    })
    text.toObject = (function(toObject) {
      return function() {
        return fabric.util.object.extend(toObject.call(this), {
          link: this.link
        });
      };
    })(text.toObject);
    canvas.add(text);
    //Bind
    bindEvents(text);
    //Programmatically Select Newly Added Object
    canvas.setActiveObject(text);    
  },
  addMarquee: function(str){
    // var str = [{string:'台灣人瘋臉書，你知道全台最有人氣粉絲團是哪位嗎？', leastTime: '6', transitionType: 'default', transitionPeriod: '2'}, {string:'具惠善安宰賢姊弟戀達陣！下月完婚(4551)', leastTime: '6', transitionType: 'default', transitionPeriod: '2'}, {string:'安海瑟威當媽媽已1周　產下健康男嬰(20213)', leastTime: '6', transitionType: 'default', transitionPeriod: '2'}];
    //Always Create Text Object from first string.
    var i = 0;
    var text = new fabric.Marquee(str.string[i],{
      //options
      left: canvas.getWidth()/2,
      top: canvas.getHeight()/2,
      lockScalingX: true,
      lockScalingY: true,
      fontSize: '24'
    })
    text.setControlsVisibility({
      bl: false,
      br: false,
      mb: false,
      ml: false,
      mr: false,
      mt: false,
      tl: false,
      tr: false,
      mtr: true
    });
    text.toObject = (function(toObject) {
      return function() {
        return fabric.util.object.extend(toObject.call(this), {
          link: this.link,
          marquee: str
        });
      };
    })(text.toObject);
    canvas.add(text);
    //Bind
    bindEvents(text);
    //Programmatically Select Newly Added Object
    canvas.setActiveObject(text);

    //Transition
    setTimeout(function(){marquee(str,i);},str.leastTime*1000);

    function marquee(str, i) {
      if (i >= str.string.length-1) {
        i = 0;
      } else {
        i++;
      }
      text.setText(str.string[i]);
      canvas.renderAll();
      setTimeout(function(){marquee(str,i);},str.leastTime*1000);
    }
  },
  addMedia : function(objImage) {
    //Check if it is an Slide Array
    if (objImage.length > 1) {
      var imageSet = objImage;
      //If objImage is an Array
      CanvasComposer.Artboard.Multimedia.slider(imageSet);
    } else if (objImage.length === 1){
      //Add Image or Video ((Single))
      //extension
      var extension = objImage[0].src.split('.').pop();
      var media;
      var youtubeId = validateYouTubeUrl(objImage[0].src);
      if (youtubeId != false) {
        //If It is from Youtube
        var thumbnail = getThumbnails(youtubeId, function(thumb){
          console.log(thumb);
          //Add Single Image
          CanvasComposer.Artboard.Multimedia.video(thumb, youtubeId);
        });
      } else {
        if (extension.match(/^(gif|png|jpg|jpeg|tiff|svg)$/)) {
          //Add Single Image
          CanvasComposer.Artboard.Multimedia.image(objImage[0].src);
          console.log(objImage[0].src);
        } else if (extension.match(/^(mp4|avi|ogg|ogv|webm)$/)) {
          //Add Single Video
          CanvasComposer.Artboard.Multimedia.video(objImage[0].src);
        } else {
          console.log('不支援此檔案格式，請重試');
        }
      }
    }
  },
  dispose : function() {
    var obj;
    for (var i=0; i<canvas._objects.length; i++) {
      // obj = canvas._objects[i];
      if (canvas._objects[i]._element !== undefined && canvas._objects[i]._element.localName === "video") {
        canvas._objects[i].getElement().pause();
      }
    }
    canvas.clear();
    //Refresh log
    
  },
  duplicateObject: function() {
    var obj = canvas.getActiveObject();
    canvas.add(obj.clone());
    canvas.renderAll();
  },
  lockObject: function() {
    var obj = canvas.getActiveObject();
    if (obj.lockMovementY === true) {
      obj.lockMovementY = false;
      obj.lockMovementX = false;
      obj.lockRotation = false;
      obj.lockScalingX = false;
      obj.lockScalingY = false;
    } else {
      obj.lockMovementY = true;
      obj.lockMovementX = true;
      obj.lockRotation = true;
      obj.lockScalingX = true;
      obj.lockScalingY = true;
    }
  },
  removeObject: function() {

      if(canvas.getActiveGroup()){
        canvas.getActiveGroup().forEachObject(function(o){
          if (o._element !== undefined && o._element.localName === "video") {
            o.getElement().pause();
            canvas.remove(o);
          } else {
            canvas.remove(o);
          }
        });
        canvas.discardActiveGroup().renderAll();
      } else {
        var singleObj = canvas.getActiveObject();
        if (singleObj._element !== undefined && singleObj._element.localName === "video") {
            singleObj.getElement().pause();
            canvas.remove(singleObj);
          } else {
            canvas.remove(singleObj);
          }
        
      };


    // var obj = canvas.getActiveObject();
    // console.log('oooooooooo');
    // console.log(obj);
    // if ( obj == null ) {
    //   obj = canvas.getActiveGroup();
    //   console.log(obj);
    //   obj.remove();
    // }
    // if (obj._element !== undefined && obj._element.localName === "video") {
    //   obj.getElement().pause();
    //   obj.remove();
    // } else {
    //   obj.remove();
    // }

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

//Add Media
CanvasComposer.Artboard.Multimedia = {
    image : function(source) {
      //Add Single Image
      var media = new fabric.Image.fromURL(source, function(oImg) {
        console.log(oImg);
        oImg.set({
          'left': canvas.getWidth()/2-oImg.width/2,
          'top': canvas.getHeight()/2-oImg.height/2
        });
        oImg.crossOrigin="anonymous";
        //Scale Superlarge Elements to fit the Current Canvas Size
        //Do Some Math
        var ratioW = oImg.getWidth()/canvas.getWidth();
        var ratioH = oImg.getHeight()/canvas.getHeight();
        if (ratioW >= ratioH) {
          if (ratioW > 1) {
            oImg.scaleToWidth(canvas.getWidth()*0.9); //Decrese 10%   
          } else {
            //
          }
        } else {
          if (ratioH > 1) {
            oImg.scaleToHeight(canvas.getHeight()*0.9); //Decrese 10%
          } else {
            //
          }
        }
        // if (oImg.getWidth()/canvas.getWidth()) {
        //   oImg.scaleToWidth(canvas.getWidth());
        // }
        canvas.add(oImg);
        oImg.center();
        oImg.setCoords();
        oImg.toObject = (function(toObject) {
          return function() {
            return fabric.util.object.extend(toObject.call(this), {
              link: this.link
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
        
      });
    },
    video : function(source, youtubeId) {
      if ( youtubeId != undefined ) {
        console.log(source);
        var media = new fabric.Video.fromURL(source, youtubeId , function(oImg) {
          oImg.set({
            'left': canvas.getWidth()/2-oImg.width/2,
            'top': canvas.getHeight()/2-oImg.height/2

          });
          console.log(oImg.toObject());
          media.toObject = (function(toObject) {
            return function() {
              return fabric.util.object.extend(toObject.call(this), {
                link: this.link,
                media: {
                  video: this.video,
                  youtubeId: youtubeId
                }
              });
            };
          })(media.toObject);
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
          
        });
      } else {
        //Add Single Video
        //if is video file
        console.log('match video');
        //Set InitRadius for Videos 16:9
        var vw;
        var vh;
        var video = new fabric.Video(source, {
          media: {
            video: source
          }
        });
        var videoEl = video.getElement();
        canvas.add(video);
        console.log(videoEl);
        console.log(video);
        videoEl.onloadeddata = function() {
          vw = this.videoWidth;
          vh = this.videoHeight;
          video.setWidth(vw);
          video.setHeight(vh);
          video.center();
          video.setCoords();
          canvas.renderAll();
          console.log(this);
          console.log(vw);
          //Auto Play Video
          video.getElement().play();
          video.toObject = (function(toObject) {
              return function() {
                return fabric.util.object.extend(toObject.call(this), {
                  media: {
                    video: source
                  },
                  link : this.link
                });
              };
            })(video.toObject);
          //Bind
          bindEvents(video);
          //Programmatically Select Newly Added Object
          canvas.setActiveObject(video);
          //Refresh log
          

          fabric.util.requestAnimFrame(function render() {
            canvas.renderAll();
            fabric.util.requestAnimFrame(render);
          });
        };
      }
    },
    slider : function(imageset) {
        var i=0;
        var counter;
        var leastTime;
        var obj;
        //First Image

        //POV
        new fabric.Slider.fromArray(imageset, function(res){
          var patternSourceCanvas = res.patternSourceCanvas;
          var pattern = res.pattern;
          
          //已建立 slider 物件
          canvas.add(res);
          canvas.renderAll();
          // Bind
          bindEvents(res);
          //Programmatically Select Newly Added Object
          canvas.setActiveObject(res);
          res.setCoords();
          //Refresh log
          
          leastTime = res.slides[0].continued*1000;
          var id = res.id;
          setTimeout(function(){bgRelacer(i,res,id)}, leastTime);
          function bgRelacer(i, res, id) {
            i++;
            if (i === res.slides.length ) {
              i=0;
            }
            //Next
            var extension = res.slides[i].src.split('.').pop();
            if (extension.match(/^(gif|png|jpg|jpeg|tiff|svg)$/)) {
              new fabric.Image.fromURL(res.slides[i].src, function(img){
                img.setHeight(patternSourceCanvas.height);
                img.setWidth(patternSourceCanvas.width);
                for (var x=0; x<patternSourceCanvas._objects.length; x++) {
                  // obj = canvas._objects[i];
                  if (patternSourceCanvas._objects[x]._element !== undefined && patternSourceCanvas._objects[x]._element.localName === "video") {
                    patternSourceCanvas._objects[x].getElement().pause();
                  } else {
                    console.log( 'error' );
                  }
                }
                patternSourceCanvas.clear();
                patternSourceCanvas.setBackgroundImage(img);
                patternSourceCanvas.renderAll();
                // patternSourceCanvas.renderAll();
                pattern = new fabric.Pattern({
                          source: patternSourceCanvas.getElement(),
                          repeat: 'no-repeat'
                        });

                res.setFill(pattern);
                canvas.renderAll();
              })

              leastTime = res.slides[i].continued*1000;
              setTimeout(function(){bgRelacer(i,res,id)}, leastTime);
            } else if (extension.match(/^(mp4|avi|ogg|ogv|webm)$/)) {
              //Add Single Video
              var vw, vh;
              var video = new fabric.Video(res.slides[i].src, {
                media: {
                  video: res.slides[i].src
                }
              });
              var videoEl = video.getElement();
              for (var x=0; x<patternSourceCanvas._objects.length; x++) {
                // obj = canvas._objects[i];
                if (patternSourceCanvas._objects[x]._element !== undefined && patternSourceCanvas._objects[x]._element.localName === "video") {
                  patternSourceCanvas._objects[x].getElement().pause();
                } else {
                  console.log( 'error' );
                }
              }
              patternSourceCanvas.clear();
              patternSourceCanvas.add(video);
              console.log(patternSourceCanvas.getContext());
              patternSourceCanvas.renderAll();
              // patternSourceCanvas.renderAll();
              
              
              console.log(videoEl);
              console.log(video);
              videoEl.onloadeddata = function() {
                vw = this.videoWidth;
                vh = this.videoHeight;
                video.setWidth(patternSourceCanvas.width);
                video.setHeight(patternSourceCanvas.height);
                video.center();
                video.setCoords();
                canvas.renderAll();
              };
              fabric.util.requestAnimFrame(function render() {
                patternSourceCanvas.renderAll();
                fabric.util.requestAnimFrame(render);
              });

              leastTime = res.slides[i].continued*1000;
              setTimeout(function(){bgRelacer(i,res,id)}, leastTime);
            } else {
              console.log('不支援此檔案格式，請重試');
            }
            
          }
      }, {
       left: 150,
       top: 100
      });
    },
    clock : function(format) {
      var time;
      //Determin TimeStamp Type
      var timeFormat = function(format){
        console.log(format);
        switch (format) {
          case '0':
            time = moment().format();
            return time;
            break;
          case '1':
            time = moment().format("MMMM Do YYYY, h:mm:ss a");
            return time;
            break;
          case '2':
            time = moment().format("dddd");
            return time;
            break;
          case '3':
            time = moment().format("MMM Do YY");
            return time;
            break;
          case '4':
            time = moment().format('LLL');
            return time;
            break;
          case '5':
            time = moment().format('LLLL');
            return time;
            break;
          case '6':
            time = moment().format('LT');
            return time;
            break;
          case '7':
            time = moment().format('LTS');
            return time;
            break;
        }
      }
      moment.locale('zh-tw');
      console.log(time);
      //Add Clock Object
      var clock = new fabric.Clock(timeFormat(format),{
        fontSize: '36',
        fontFamily: 'Open sans',
        fontWeight: 400
      });
      
      clock.toObject = (function(toObject) {
        return function() {
          return fabric.util.object.extend(toObject.call(this), {
            format: format,
            link: this.link
          });
        };
      })(clock.toObject);

      canvas.add(clock);
      //Bind
      bindEvents(clock);
      //Programmatically Select Newly Added Object
      canvas.setActiveObject(clock);
      //Refresh log
      // setTimeout(function(){bgRelacer(i,res,id)}, leastTime);
      setInterval(function(){clock.setText(timeFormat(format));canvas.renderAll();}, 1000);

    },
    weather: function(location) {
      Weather.translate(location, function(res){
        var conditionText = res.conditionText;
        var conditionImg = res.conditionImg;
        var temp = res.temp;
        var city = res.city;
        var country = res.country;
        console.log(conditionText);
        
        var fImg = new fabric.Image.fromURL( 'images/components/conditions/svg/'+conditionImg, function(oImg) {
          oImg.scaleToWidth(60);
          oImg.set({
            'left': 0,
            'top': 30

          });
          
          var fText = new fabric.Text(conditionText, {
            left: 70,
            top: 50,
            fontSize: '18',
            fontFamily: 'Open sans'
          });
          var fTemp = new fabric.Text(temp, {
            left: 0,
            top: 90,
            fontSize: '60',
            fontFamily: 'Open sans',
            fontWeight: 300
          });
          var fLocation = new fabric.Text(city, {
            left: 0,
            top: 0,
            fontSize: '18',
            fontFamily: 'Open sans'
          });
          var weather = new fabric.Weather([fText,fTemp,fLocation,oImg], {
            left: 0,
            top: 0
          });

          weather.toObject = (function(toObject) {
            return function() {
              return fabric.util.object.extend(toObject.call(this), {
                location: location,
                link: this.link
              });
            };
          })(weather.toObject);

          canvas.add(weather);
          //Bind
          bindEvents(weather);
          //Programmatically Select Newly Added Object
          canvas.setActiveObject(weather);
        });
        
      });
    }
};
