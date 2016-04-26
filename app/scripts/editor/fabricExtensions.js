fabric.Object.prototype.link = '';

//Create Fabric Video Class
fabric.Video = fabric.util.createClass(fabric.Image, {
	type: 'video',
  initialize: function (element, options) {
            options || (options = {});
            this.callSuper('initialize', options);
            console.log('inittt');
            if (typeof element === 'object') {
              console.log('this is an object');
              this._initElement(element, options);
              this._initConfig(options);
            } else {
              var videoEl = document.createElement("video");
              videoEl.loop = true;
              videoEl.controls = true;
              console.log(videoEl);
              console.log(element);
              videoEl.innerHTML = '<source src="'+ element +'">';
              console.log(videoEl);
              this._initElement(videoEl, options);
              this._initConfig(options);

              //Auto Play Video
              videoEl.play();
              fabric.util.requestAnimFrame(function render() {
                canvas.renderAll();
                fabric.util.requestAnimFrame(render);
              });
            }
            
        },
  toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            media: {
              video: this.media.video,
              youtubeId: this.media.youtubeId
            },
            link: this.link
        });
    },
  _render: function (ctx) {
            this.callSuper('_render', ctx);
        }
});

//Video
fabric.Video.fromURL = function(url, youtubeId, callback, imgOptions) {
    fabric.util.loadImage(url, function(img) {
      callback && callback(new fabric.Video(img,{
        media: {
          video: url,
          youtubeId: youtubeId
        }
      }, imgOptions));
    }, null, imgOptions && imgOptions.crossOrigin);
  };


fabric.Video.fromObject = function(objects, callback) {
  var v = new fabric.Video(objects.media.video, {
    width: objects.width,
    height: objects.height,
    scaleX: objects.scaleX,
    scaleY: objects.scaleY,
    angle: objects.angle,
    top: objects.top,
    left: objects.left,
    media: {
      video: objects.media.video,
      youtubeId: objects.media.youtubeId
    }
  });
  //Bind
  bindEvents(v);
  //Programmatically Select Newly Added Object
  canvas.setActiveObject(v);
  //Refresh log
  return v;
};

//Create Fabric Slider Class
fabric.Slider = fabric.util.createClass(fabric.Rect, {
  type: 'slider',
  initialize: function (options) {
            options || (options = {});
            this.callSuper('initialize', options);
            console.log('inittt');
        },
  toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            id: this.id,
            fill: this.fill,
            slides: this.slides,
            link: this.link,
            pattern: this.pattern,
            patternSourceCanvas: this.patternSourceCanvas,
            filename: this.filename
        });
    },
  _render: function (ctx) {
            this.callSuper('_render', ctx);
        }
});

//Slider
fabric.Slider.fromArray = function(elements, callback, options) {
  //Define if the first Object is Video
  var firstObj = elements[0].src;
  var extension = firstObj.split('.').pop();

  if (extension.match(/^(gif|png|jpg|jpeg|tiff|svg)$/)) {
    new fabric.Image.fromURL(firstObj, function(img) {
      var patternSourceCanvas = new fabric.StaticCanvas();
      console.log(img);
      img.setHeight(patternSourceCanvas.height);
      img.setWidth(patternSourceCanvas.width);
      patternSourceCanvas.setBackgroundImage(img);
      patternSourceCanvas.renderAll();
      console.log(patternSourceCanvas.getElement());
      var pattern = new fabric.Pattern({
        source: patternSourceCanvas.getElement(),
        repeat: 'no-repeat'
      });

      callback && callback(new fabric.Slider({
        fill: pattern,
        width: img.width,
        height: img.height,
        left: options.left,
        top: options.top,
        slides: elements,
        link: options.link,
        id: generator.generate(),
        pattern: pattern,
        patternSourceCanvas: patternSourceCanvas,
        filename: elements[0].filename
      }));
    }, null, options && options.crossOrigin);
  } else if (extension.match(/^(mp4|avi|ogg|ogv|webm)$/)) {
    //Add Single Video
    var patternSourceCanvas = new fabric.StaticCanvas();
    var vw, vh;
    var video = new fabric.Video(elements[0].src, {
      media: {
        video: elements[0].src
      }
    });
    var videoEl = video.getElement();
    var pattern = new fabric.Pattern({
        source: patternSourceCanvas.getElement(),
        repeat: 'no-repeat'
      });
    patternSourceCanvas.add(video);
    patternSourceCanvas.renderAll();
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
    callback && callback(new fabric.Slider({
        fill: pattern,
        width: patternSourceCanvas.width,
        height: patternSourceCanvas.height,
        left: options.left,
        top: options.top,
        slides: elements,
        link: options.link,
        id: generator.generate(),
        pattern: pattern,
        patternSourceCanvas: patternSourceCanvas,
        filename: elements[0].filename
      }));
  } else {
    console.log('不支援此檔案格式，請重試');
  }
}

fabric.Slider.fromObject = function(objects, callback, options) {
  //Define if the first Object is Video
  var firstObj = objects.slides[0].src;
  var extension = firstObj.split('.').pop();

  if (extension.match(/^(gif|png|jpg|jpeg|tiff|svg)$/)) {
    new fabric.Image.fromURL(firstObj, function(img) {
      var patternSourceCanvas = new fabric.StaticCanvas();
      console.log(img);
      img.setHeight(patternSourceCanvas.height);
      img.setWidth(patternSourceCanvas.width);
      patternSourceCanvas.setBackgroundImage(img);
      patternSourceCanvas.renderAll();
      console.log(patternSourceCanvas.getElement());
      var pattern = new fabric.Pattern({
        source: patternSourceCanvas.getElement(),
        repeat: 'no-repeat'
      });

      callback && callback(new fabric.Slider({
        width: objects.width,
        height: objects.height,
        scaleX: objects.scaleX,
        scaleY: objects.scaleY,
        top: objects.top,
        left: objects.left,
        slides: objects.slides,
        link: objects.link,
        fill: pattern,
        id: objects.id,
        pattern: pattern,
        patternSourceCanvas: patternSourceCanvas,
        filename: objects.slides[0].filename
      }));
    }, null, options && options.crossOrigin);
  } else if (extension.match(/^(mp4|avi|ogg|ogv|webm)$/)) {
    //Add Single Video
    var patternSourceCanvas = new fabric.StaticCanvas();
    var vw, vh;
    var video = new fabric.Video(firstObj, {
      media: {
        video: firstObj
      }
    });
    var videoEl = video.getElement();
    var pattern = new fabric.Pattern({
        source: patternSourceCanvas.getElement(),
        repeat: 'no-repeat'
      });
    patternSourceCanvas.add(video);
    patternSourceCanvas.renderAll();
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
    callback && callback(new fabric.Slider({
      width: objects.width,
      height: objects.height,
      scaleX: objects.scaleX,
      scaleY: objects.scaleY,
      top: objects.top,
      left: objects.left,
      slides: objects.slides,
      fill: pattern,
      id: objects.id,
      link: objects.link,
      pattern: pattern,
      patternSourceCanvas: patternSourceCanvas,
      filename: objects.slides[0].filename
    }));
  } else {
    console.log('不支援此檔案格式，請重試');
  }
};
fabric.Slider.async = true;


var generator = new IDGenerator();

function IDGenerator() {
	this.length = 8;
	this.timestamp = +new Date;

	var _getRandomInt = function( min, max ) {
		return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
	}

	this.generate = function() {
		var ts = this.timestamp.toString();
		var parts = ts.split( "" ).reverse();
		var id = "";
	 
		for( var i = 0; i < this.length; ++i ) {
		var index = _getRandomInt( 0, parts.length - 1 );
		id += parts[index];	 
		}

		return id;
	}
}

function findObj(id) {
	for(var i=0;i<canvas._objects.length; i++) {
		if (canvas._objects[i].id === id) {
			return canvas._objects[i];
			// console.log(canvas._objects[i]);
		} else {
			console.log(canvas._objects[i]);
		}
	}
}


//Create Fabric Clock Class
fabric.Clock = fabric.util.createClass(fabric.Text, {
  type: 'clock',
  initialize: function (text, options) {
            options || (options = {});
            this.callSuper('initialize', text, options);
            console.log('inittt');
        },
  toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            format: this.format,
            link: this.link
        });
    },
  _render: function (ctx) {
            this.callSuper('_render', ctx);
        }
});

fabric.Clock.fromObject = function(objects, callback) {
  var v = new fabric.Clock(objects.text, {
    fontSize: objects.fontSize,
    fontFamily: objects.fontFamily,
    fontWeight: objects.fontWeight,
    format: objects.format,
    left: objects.left,
    top: objects.top
  });
  //Bind
  bindEvents(v);
  //Programmatically Select Newly Added Object
  canvas.setActiveObject(v);
  //Refresh log
  return v;
};

//Create Fabric Marquee Class
fabric.Marquee = fabric.util.createClass(fabric.IText, {
  type: 'marquee',
  initialize: function (text, options) {
            options || (options = {});
            this.callSuper('initialize', text, options);
            console.log('inittt');
        },
  toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            link: this.link,
            marquee: this.marquee
        });
    },
  _render: function (ctx) {
            this.callSuper('_render', ctx);
        }
});

fabric.Marquee.fromObject = function(objects, callback) {
  //revive Marquee
  var i = 0;
  var v = new fabric.Marquee(objects.text, {
    text: objects.text,
    fontSize: objects.fontSize,
    fontFamily: objects.fontFamily,
    fontStyle: objects.fontStyle,
    marquee: objects.marquee,
    left: objects.left,
    top: objects.top,
  });
  v.setControlsVisibility({
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
  //Bind
  bindEvents(v);
  //Programmatically Select Newly Added Object
  canvas.setActiveObject(v);
  //Transition
  setTimeout(function(){marquee(objects,i);},objects.marquee.leastTime*1000);

  function marquee(str, i) {
    if (i >= objects.marquee.string.length-1) {
      i = 0;
    } else {
      i++;
    }
    v.setText(objects.marquee.string[i]);
    canvas.renderAll();
    setTimeout(function(){marquee(objects,i);},objects.marquee.leastTime*1000);
  }
  //Refresh log
  return v;
};

//Create Fabric USB Class
fabric.Usbframe = fabric.util.createClass(fabric.Group, {
  type: 'usbframe',
  initialize: function (objects, options) {
            options || (options = {});
            
            this.callSuper('initialize', objects, options);
            console.log('inittt');
        },
  toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            link: this.link
        });
    },
  _render: function (ctx) {
            this.callSuper('_render', ctx);
        }
});

fabric.Usbframe.fromObject = function(objects, callback) {
  console.log(objects);
  var bg = new fabric.Rect({
        originX: objects.objects[0].originX,
        originY: objects.objects[0].originY,
        fill: objects.objects[0].fill,
        width: objects.objects[0].width,
        height: objects.objects[0].height,
        scaleX: objects.objects[0].scaleX,
        scaleY: objects.objects[0].scaleY,
        left: objects.objects[0].left,
        top: objects.objects[0].top,
        padding: 0,
        strokeWidth: 0
      });

    var text = new fabric.Text(objects.objects[1].text, {
        originX: objects.objects[1].originX,
        originY: objects.objects[1].originY,
        width: objects.objects[1].width,
        left: objects.objects[1].top,
        top: objects.objects[1].left,
        scaleX: objects.objects[1].scaleX,
        scaleY: objects.objects[1].scaleY,
        fontSize: objects.objects[1].fontSize,
        fontFamily: objects.objects[1].fontFamily,
        textAlign: objects.objects[1].textAlign,
        fill: objects.objects[1].fill
      });

  var v = new fabric.Usbframe([bg,text],{
      originX: objects.originX,
      originY: objects.originY,
      left: objects.left,
      top: objects.top,
      width: objects.width,
      height: objects.height,
      scaleX: objects.scaleX,
      scaleY: objects.scaleY,
      padding: 0,
      strokeWidth: 0
    });
  //Bind
  bindEvents(v);
  //Programmatically Select Newly Added Object
  canvas.setActiveObject(v);
  //Refresh log
  console.log(v);
  return v;
};

//Create Fabric Webview Class
fabric.Webview = fabric.util.createClass(fabric.Group, {
  type: 'webview',
  initialize: function (objects, options) {
            options || (options = {});
            
            this.callSuper('initialize',objects, options);
            console.log('inittt');
        },
  toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            link: this.link,
            view: this.view
        });
    },
  _render: function (ctx) {
            this.callSuper('_render', ctx);
        }
});

fabric.Webview.fromObject = function(objects, callback) {
  console.log(objects);
  var bg = new fabric.Rect({
        originX: objects.objects[0].originX,
        originY: objects.objects[0].originY,
        fill: objects.objects[0].fill,
        width: objects.objects[0].width,
        height: objects.objects[0].height,
        scaleX: objects.objects[0].scaleX,
        scaleY: objects.objects[0].scaleY,
        left: objects.objects[0].left,
        top: objects.objects[0].top,
        padding: 0,
        strokeWidth: 0
      });

    var text = new fabric.Text(objects.objects[1].text, {
        originX: objects.objects[1].originX,
        originY: objects.objects[1].originY,
        width: objects.objects[1].width,
        left: objects.objects[1].top,
        top: objects.objects[1].left,
        scaleX: objects.objects[1].scaleX,
        scaleY: objects.objects[1].scaleY,
        fontSize: objects.objects[1].fontSize,
        fontFamily: objects.objects[1].fontFamily,
        textAlign: objects.objects[1].textAlign,
        fill: objects.objects[1].fill
      });

  var v = new fabric.Webview([bg,text],{
      originX: objects.originX,
      originY: objects.originY,
      left: objects.left,
      top: objects.top,
      width: objects.width,
      height: objects.height,
      scaleX: objects.scaleX,
      scaleY: objects.scaleY,
      padding: 0,
      strokeWidth: 0
    });
  //Bind
  bindEvents(v);
  //Programmatically Select Newly Added Object
  canvas.setActiveObject(v);
  //Refresh log
  console.log(v);
  return v;
};

//Create Fabric Weather Class
fabric.Weather = fabric.util.createClass(fabric.Group, {
  type: 'weather',
  initialize: function (objects,options) {
            options || (options = {});
            this.callSuper('initialize',objects, options);

            console.log('inittt');
        },
  toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            link: this.link,
            location: this.location
        });
    },
  _render: function (ctx) {
            this.callSuper('_render', ctx);
        }
});
fabric.Weather.fromObject = function (object, callback) {
    fabric.util.enlivenObjects(object.objects, function (enlivenedObjects) {
        delete object.objects;
        callback && callback(new fabric.Weather(enlivenedObjects, object));
    });
};

fabric.Weather.async = true;