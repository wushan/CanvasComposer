CanvasComposer.Load = {
  FromPresets : function(src, callback){
    $.getJSON(src, function(data){
      console.log('success');
    }).done(function(data){
      console.log('done');
      console.log(data);
      canvas.loadFromJSON(data, canvas.renderAll.bind(canvas),function(o, object) {
        console.log(o);
        console.log(object);
        canvas.renderAll();
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
        }
        bindEvents(object);
      });
      callback && callback ('Presets Loaded Successful.');
    }).fail(function(err) {
      callback && callback ('Presets loading task Failed.' + err);
    })
  },
  FromJSON: function(data){
    canvas.loadFromJSON(data, canvas.renderAll.bind(canvas),function(o, object) {
      console.log(o);
      console.log(object);
      canvas.renderAll();
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
      }
      bindEvents(object);
    });
  }
}
