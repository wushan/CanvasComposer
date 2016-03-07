fabric.Object.prototype.link = '';

//Create Fabric Video Class
fabric.Video = fabric.util.createClass(fabric.Image, {
	type: 'video',
  initialize: function (element, options) {
            options || (options = {});
            this.callSuper('initialize', options);
            console.log('inittt');

            var videoEl = document.createElement("video");
            videoEl.loop = true;
            videoEl.controls = true;
            console.log(videoEl);
            console.log(element);
            videoEl.innerHTML = '<source src="'+ element +'">';

            this._initElement(videoEl, options);
            this._initConfig(options);

            //Auto Play Video
            videoEl.play();
            fabric.util.requestAnimFrame(function render() {
              canvas.renderAll();
              fabric.util.requestAnimFrame(render);
            });
        },
  toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            media: {
              video: this.media.video
            },
            link: this.link
        });
    },
  _render: function (ctx) {
            this.callSuper('_render', ctx);
        }
});

//Video
fabric.Video.fromURL = function(url, callback, imgOptions) {
    fabric.util.loadImage(url, function(img) {
      callback && callback(new fabric.Video(img, imgOptions));
    }, null, imgOptions && imgOptions.crossOrigin);
  };


fabric.Video.fromObject = function(objects, callback) {
  var v = new fabric.Video(objects.media.video, {
    width: objects.width,
    height: objects.height,
    scaleX: objects.scaleX,
    scaleY: objects.scaleY,
    top: objects.top,
    left: objects.left,
    media: {
      video: objects.media.video
    }
  });
  //Bind
  bindEvents(v);
  //Programmatically Select Newly Added Object
  canvas.setActiveObject(v);
  //Refresh log
  logObj();
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

fabric.Slider.fromObject = function(objects, callback) {
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
	// var i=0;
	// while (i<canvas._objects.length && canvas._objects[i].id === id) {
	// 	console.log(canvas._objects[i]);
	// 	i++;
	// }
	// console.log(canvas);
}
// findObj();

