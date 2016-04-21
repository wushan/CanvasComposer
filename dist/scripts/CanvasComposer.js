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
            
        });
    },
  _render: function (ctx) {
            this.callSuper('_render', ctx);
        }
});

//Create Fabric Marquee Class
fabric.Marquee = fabric.util.createClass(fabric.Text, {
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
//全域
var canvas,
	grid,
	threshold,
	initRadius = 100;
  
//區域
var CanvasComposer = {
	init: function(data, options){
		console.log(this);
		this.loadView();
		$(document).on("files-loaded", function () {
			if (typeof data === 'object') {
        CanvasComposer.initCanvas.initWithData(data, options);
        //讀取
			} else if (data == 'new'){
				CanvasComposer.initCanvas.init();
			}
		    CanvasComposer.toolBar();
		    CanvasComposer.Contextmenu();
		    CanvasComposer.HotKeys();
		    CanvasComposer.attrPanels();
        CanvasComposer.canvasPanels();
		    CanvasComposer.MediaLibrary();
        CanvasComposer.inboundLinks();
        CanvasComposer.Marquee();
        // CanvasComposer.Load();

		})
	},
	Save: {
    toObj: function(){
      var currentCanvas = JSON.stringify(canvas);
      console.log(currentCanvas);
    },
    toPng: function(){
      //Prevent saving image with a selected control points(borders).
      canvas.deactivateAll().renderAll();
      var png = canvas.toDataURL('png');
      //CROSS ORIGIN ISSUE
      window.open(png);
    },
    toSvg: function(){
      var svg = canvas.toSVG({suppressPreamble: true});
      console.log(svg);
    }
  }
};

function getThumbnails(id , callback) {
  var url = "https://www.googleapis.com/youtube/v3/videos?id=" + id + "&part=snippet&key=AIzaSyCjiWPLJdE-QbakmKin__3rDqOKLgKyCRY"
  $.getJSON(url,function(){
    console.log('success');
  }).done(function(res){
    console.log(res);
    var thumbnails;
    if (res.items[0].snippet.thumbnails.standard.url != '') {
      thumbnails = res.items[0].snippet.thumbnails.standard.url;
    } else {
      thumbnails = res.items[0].snippet.thumbnails.default.url;
    }
    return callback(thumbnails);
  }).fail(function(error){
    console.log(error);
  })
}



function validateYouTubeUrl(url) {
    if (url != undefined || url != '') {        
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        var mp4,
            webm;
        if (match && match[2].length == 11) {
            return match[2]; 
        } else {
            return false;
        }
    }
}
// CanvasComposer.init();
// CanvasComposer.loadView();
CanvasComposer.loadView = function(){
	var wrapper = $('#canvaseditor');
	//Generate View Components
	var templates = (function ($, host) {
	    // begin to load external templates from a given path and inject them into the DOM
	    return {
	        // use jQuery $.get to load the templates asynchronously
	        load: function (templateArray, target, event) {
	            var defferArray = [];
	            $.each(templateArray, function (idx, url) {
	                var loader = $.get(url)
	                    .success(function (data) {
	                    // on success, add the template to the targeted DOM element
	                    $(target).append(data);
	                })
	                defferArray.push(loader);
	            })

	            $.when.apply(null, defferArray).done(function () {
	                $(host).trigger(event);
	            });
	        }
	    };
	})(jQuery, document);

	
	
	$(function () {
	    var templateArray = ["templates/sidebar.html", "templates/artboard.html", "templates/config.html", "templates/contextmenu.html", "templates/library.html", "templates/inbounds.html", "templates/marquee-settings.html"]
	    templates.load(templateArray, wrapper, "files-loaded");
	});
}
CanvasComposer.initCanvas = {
  init: function(){
    //*Setting Up Canvas
    canvas = new fabric.Canvas('c', {
                  width: 800,
                  height: 600
                  // ...
                }),
                grid = 50,
                threshold = grid * 0.2;
    // Draw grids
    // for (var i = 0; i < (canvas.width / grid); i++) {
    //     canvas.add(new fabric.Line([ i * grid, 0, i * grid, canvas.width], { stroke: '#ccc', selectable: false }));
    //     canvas.add(new fabric.Line([ 0, i * grid, canvas.width, i * grid], { stroke: '#ccc', selectable: false }));
    // }

    canvas.on('object:moving', snapMoveToGrid);
    // canvas.on('object:scaling', snapScaleToGrid);
    // canvas.on('object:moving', fixBoundaries);
    // canvas.on('object:scaling', fixBoundaries);

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
  },
  initWithData: function(data, options){
    //*Setting Up Canvas
    canvas = new fabric.Canvas('c', {
                  width: options.width,
                  height: options.height
                  // ...
                }),
                grid = 50,
                threshold = grid * 0.2;
    // Draw grids
    // for (var i = 0; i < (canvas.width / grid); i++) {
    //     canvas.add(new fabric.Line([ i * grid, 0, i * grid, canvas.width], { stroke: '#ccc', selectable: false }));
    //     canvas.add(new fabric.Line([ 0, i * grid, canvas.width, i * grid], { stroke: '#ccc', selectable: false }));
    // }

    canvas.on('object:moving', snapMoveToGrid);
    canvas.on('object:scaling', snapScaleToGrid);
    canvas.on('object:moving', fixBoundaries);
    canvas.on('object:scaling', fixBoundaries);
    
    //Load From JSON
    // if (data != 'undefined' || data != null) {

    // } else {
    //   console.log(data);
    // }
    CanvasComposer.Load.FromJSON(data, function(res){
      console.log(res);
    })

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
  },
  fit: function(){
    //Scale Canvas to fit viewport
    var container = document.getElementById('artboard');
    var paintArea = document.getElementById('canvas');
    // canvas.wrapperEl.style.transform = "scale(.8)";
    var artboardScale = (function(){
      var aspectRatio = canvas.width/canvas.height;
      //Ratio = Canvas 寬(實際px) 與 artboard 寬的比值
      var ratioW = canvas.width/container.clientWidth,
          ratioH = canvas.height/container.clientHeight;

      console.log('Canvas 實際寬度是視窗寬度的: ' + ratioW + ' 倍');
      console.log('Canvas 實際高度是視窗寬度的: ' + ratioH + ' 倍');
      var motive;
      //若寬度比值大於或等於高度比值 (代表此矩形為橫式或正方形)
      if (ratioW >= ratioH) {
        //橫式或正方形情況下，Canvas 實際寬度大於視窗寬度 (必須 scale 縮減)
        if (ratioW > 1) {
          ratioW = container.clientWidth/canvas.width;
          //再縮減 80% 以避免 canvas 貼邊。
          motive = ratioW*0.8;
          console.log(ratioW);
          if (motive > 1) {
            motive = 1;
          }
          paintArea.style.transform = "scale(" + motive + ")";
          // paintArea.style.transformOrigin = "25% 25%";
        } else {
          motive = 1;
          paintArea.style.transform = "scale(" + motive + ")";
          // paintArea.style.transformOrigin = "25% 25%";
        }
      } else if (ratioW < ratioH){
        if (ratioH > 1) {
          ratioH = container.clientHeight/canvas.height;
          //再縮減 80% 以避免 canvas 貼邊。
          motive = ratioH*0.8;
          console.log(ratioH);
          if (motive > 1) {
            motive = 1;
          }
          paintArea.style.transform = "scale(" + motive + ")";
          // paintArea.style.transformOrigin = "45% 25%";
        } else {
          motive = 1;
          paintArea.style.transform = "scale(" + motive + ")";
          // paintArea.style.transformOrigin = "25% 25%";
        }
      }
    }());

    //天才
    function resizedw(){
    // Haven't resized in 100ms!
      CanvasComposer.initCanvas.fit();
    }

    var doit;
    window.onresize = function(){
      clearTimeout(doit);
      doit = setTimeout(resizedw, 100);
    };
  }
}
CanvasComposer.canvasPanels = function(){
  //Canvas Panel
  $("#canvasWidth").on("change paste keyup", function() {
     //Refresh Canvas Size
     canvas.setWidth($(this).val());
     canvas.renderAll();
     //Fit Artboard
     CanvasComposer.initCanvas.fit();
     //Set Canvas tip tags
    $(".sizeTag .tag.width span").html($(this).val());
  });

  $("#canvasHeight").on("change paste keyup", function() {
     //Refresh Canvas Size
     canvas.setHeight($(this).val());
     canvas.renderAll();
     //Fit Artboard
     CanvasComposer.initCanvas.fit();
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
    CanvasComposer.initCanvas.fit();
    //Set Canvas tip tags
    $(".sizeTag .tag.width span").html(presetWidth);
    $(".sizeTag .tag.height span").html(presetHeight);
  });

  $(".layoutpresets").on('click', 'a', function(){
    if ($(this).attr('data-src') != '' || $(this).attr('data-src') != undefined) {
      $(this).parent().siblings().children('a').removeClass('active');
      $(this).addClass('active');
      //Check if there is already an object exist
      if (canvas._objects.length > 0) {
        var confirmation = confirm("讀取預設版型會移除目前畫面中的所有物件，是否確定讀取？");
        var confirmationBtn;
        if (confirmation == true) {
            CanvasComposer.Artboard.dispose();
            CanvasComposer.Load.FromPresets($(this).attr('data-src'), function(res){
              console.log(res);
              $('#canvassetting').fadeOut('fast');
            });
        } else {
            return;
        }
      } else {
        CanvasComposer.Load.FromPresets($(this).attr('data-src'), function(res){
          console.log(res);
          $('#canvassetting').fadeOut('fast');
        });
      }
    } else {
      alert('Error loading preset.');
    }
  })
}
CanvasComposer.toolBar = function(){
  //toolBar Actions  
  var actions = {
    addRect:   function (event) {
                  CanvasComposer.Artboard.addRect();
                },
    addCircle: function (event) {
                  CanvasComposer.Artboard.addCircle();
                },
    addText: function (event) {
                  CanvasComposer.Artboard.addText();
                },
    addMarquee: function (event) {
                  //Trigger Settings
                  $('#marquee-settings').addClass('active');
                  $(document).mouseup(function (e){
                    var container = $(".marquee-settings-inner");

                    if (!container.is(e.target) // if the target of the click isn't the container...
                        && container.has(e.target).length === 0) // ... nor a descendant of the container
                    {
                        container.parent().removeClass('active');
                    }
                });
                },
    addClock: function(event) {
                CanvasComposer.Artboard.Multimedia.clock();
              },
    addWeather: function(event) {
                //Trigger Submenu
                $(this).toggleClass('active');
                var sub = $(this).siblings('ul');
                sub.toggleClass('active');
              },
    lockAll: function(event) {
                //
              },
    reset: function(event) {
                CanvasComposer.Artboard.reset();
              },
    delete: function(event) {
                event.preventDefault(); event.stopPropagation();
                CanvasComposer.Artboard.removeObject();
              },
    disposeAll: function(event) {
                CanvasComposer.Artboard.dispose();
              },
    artboardSettings: function(event) {
                $('#canvassetting').fadeToggle();
                $(document).mouseup(function (e){
                    var container = $("#sidebar");

                    if (!container.is(e.target) // if the target of the click isn't the container...
                        && container.has(e.target).length === 0) // ... nor a descendant of the container
                    {
                        container.find($('#canvassetting')).hide();
                    }
                });
              },
    saveState: function(event) {
                // CanvasComposer.Save.toSvg();
                // CanvasComposer.Save.toPng();
                // CanvasComposer.Save.toObj();
                // Alert after save
                //SELECT SAVE TYPE
                $(this).toggleClass('active');
                var sub = $(this).siblings('ul');
                sub.toggleClass('active');
              },
    savePng: function(event) {
      CanvasComposer.Save.toPng();
    },
    saveSvg: function(event) {
      CanvasComposer.Save.toSvg();
    },
    saveJSON: function(event) {
      CanvasComposer.Save.toObj();
    }
  };

  $("a[data-action]").on("click", function (event) {
    var link = $(this),
        action = link.data("action");

    event.preventDefault();

    // If there's an action with the given name, call it
    if( typeof actions[action] === "function" ) {
      actions[action].call(this, event);
    }
  });

  $("a[data-action=addWeather]").siblings('ul').on('click','a', function(){
    var location = $('#weatherCity option:selected').val();
    console.log(location);
    CanvasComposer.Artboard.Multimedia.weather(location);
    //Deactive myself
    $(this).parents('ul').removeClass('active');
  });

};

CanvasComposer.HotKeys = function(){
    //Keyboard
    var map = {8: false, 91: false, 187: false, 189: false, 40: false, 38:false, 68:false, 17:false, 76:false};
    $(document).keydown(function(e) {
        if (e.keyCode in map) {
            map[e.keyCode] = true;
            //Delete
            if (map[8] && map[91]) {
                e.preventDefault(); e.stopPropagation();
                CanvasComposer.Artboard.removeObject();
                map[8] = false;
            } else
            //BringToFront
            if (map[38] && map[91]){
                e.preventDefault(); e.stopPropagation();
                var obj = canvas.getActiveObject();
                obj.bringToFront();
                map[38] = false;
            }else
            //BringForward
            if (map[187] && map[91]){
                e.preventDefault(); e.stopPropagation();
                var obj = canvas.getActiveObject();
                obj.bringForward();
                map[187] = false;
            } else
            //Send Backwards
            if (map[189] && map[91]){
                e.preventDefault(); e.stopPropagation();
                var obj = canvas.getActiveObject();
                obj.sendBackwards();
                map[189] = false;
            } else
            //Send Bottom
            if (map[40] && map[91]){
                e.preventDefault(); e.stopPropagation();
                var obj = canvas.getActiveObject();
                obj.sendToBack();
                map[40] = false;
            } else
            //Duplicate
            if (map[68] && map[17]){
                e.preventDefault(); e.stopPropagation();
                CanvasComposer.Artboard.duplicateObject();
                map[68] = false;
            } else
            //Lock
            if (map[76] && map[91]){
                e.preventDefault(); e.stopPropagation();
                CanvasComposer.Artboard.lockObject();
                map[76] = false;
            }
            
        }
    }).keyup(function(e) {
        if (e.keyCode in map) {
            map[e.keyCode] = false;
        }
    });
}

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
    var text = new fabric.Marquee(str[i].string,{
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
    setTimeout(function(){marquee(str,i);},str[i].leastTime*1000);

    function marquee(str, i) {
      if (i >= str.length-1) {
        i = 0;
      } else {
        i++;
      }
      text.setText(str[i].string);
      canvas.renderAll();
      setTimeout(function(){marquee(str,i);},str[i].leastTime*1000);
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
    clock : function() {
      //Add Clock Object
      Date.prototype.timeNow = function(){ return ((this.getHours() < 10)?"0":"") + ((this.getHours()>12)?(this.getHours()-12):this.getHours()) +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds() + ((this.getHours()>12)?('PM'):'AM'); };

      var clock = new fabric.Clock(new Date().timeNow(),{
        fontSize: '36',
        fontFamily: 'open-sans',
        fontWeight: 400
      });
      
      clock.toObject = (function(toObject) {
        return function() {
          return fabric.util.object.extend(toObject.call(this), {
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
      setInterval(function(){clock.setText(new Date().timeNow());canvas.renderAll();}, 1000);

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
            fontFamily: 'open-sans'
          });
          var fTemp = new fabric.Text(temp, {
            left: 0,
            top: 90,
            fontSize: '60',
            fontFamily: 'open-sans',
            fontWeight: 300
          });
          var fLocation = new fabric.Text(city, {
            left: 0,
            top: 0,
            fontSize: '18',
            fontFamily: 'open-sans'
          });
          // fLocation.scaleToWidth(fTemp.getWidth());
          // console.log(fLocation.getWidth());
          // console.log(fTemp.getWidth());
          // fText.scaleToWidth(fTemp.getWidth()/fText.getWidth());
          // fLocation.scaleToWidth(fTemp.getWidth()/fLocation.getWidth());
          // console.log(fLocation.getWidth());

          var weather = new fabric.Group([ fText,fTemp,fLocation,oImg], {
            left: 150,
            top: 100
          });
          canvas.add(weather);
          // canvas.add(fText);
          // canvas.add(fTemp);
          // canvas.add(fLocation);
          // canvas.add(oImg);
          //Bind
          bindEvents(weather);
          // bindEvents(fText);
          // bindEvents(fTemp);
          // bindEvents(fLocation);
          // bindEvents(oImg);
          //Programmatically Select Newly Added Object
          canvas.setActiveObject(weather);
        });
        
      });
    },
    iframe : function() {
      //Get Screen Shot Only
    }

};

CanvasComposer.attrPanels = function(){
  function drag_start(event) {
      var style = window.getComputedStyle(event.target, null);
      event.dataTransfer.setData("text/plain",
      (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY));
  } 
  function drag_over(event) { 
      event.preventDefault(); 
      return false; 
  } 
  function drop(event) { 
      console.log(event);
      var offset = event.dataTransfer.getData("text/plain").split(',');
      var dm = document.getElementById('config');
      dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
      dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
      console.log(dm);
      event.preventDefault();
      return false;
  }

  var dm = document.getElementById('config'); 
  dm.addEventListener('dragstart',drag_start,false); 
  document.body.addEventListener('dragover',drag_over,false); 
  document.body.addEventListener('drop',drop,false);

  


//Top Panel
$('.objectControl').on('click', 'button', function(){
  var className = $(this).attr('class');
  switch(className){
    case 'js-delete':
      CanvasComposer.Artboard.removeObject();
      break;
    case 'js-reset':
      CanvasComposer.Artboard.reset();
      break;
  }
})
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

//Scale


//Color
$('#objectColor').spectrum({
    // color: "#ECC",
    showInput: true,
    className: "full-spectrum",
    showInitial: true,
    showPalette: true,
    showSelectionPalette: true,
    maxSelectionSize: 10,
    preferredFormat: "hex",
    localStorageKey: "spectrum.demo",
    move: function (color) {
        
    },
    show: function () {
    
    },
    beforeShow: function () {
    
    },
    hide: function () {
    
    },
    change: function(color) {
      var obj = canvas.getActiveObject();
      color = color.toHexString();
      if (obj.type === "textbox" || obj.type === "i-text" || obj.type === "marquee") {
        obj.setTextBackgroundColor(color);
        console.log(color);
      } else {
        obj.setFill(color);
      }
      canvas.renderAll();
      $('#objectColor').spectrum("hide");
    },
    palette: [
        ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
        "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
        ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
        "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
        ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
        "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
        "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
        "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
        "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
        "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
        "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
        "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
        "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
        "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
    ]
});
//Color
$('#objectTextColor').spectrum({
    // color: "#ECC",
    showInput: true,
    className: "full-spectrum",
    showInitial: true,
    showPalette: true,
    showSelectionPalette: true,
    maxSelectionSize: 10,
    preferredFormat: "hex",
    localStorageKey: "spectrum.demo",
    move: function (color) {
        
    },
    show: function () {
    
    },
    beforeShow: function () {
    
    },
    hide: function () {
    
    },
    change: function(color) {
      var obj = canvas.getActiveObject();
      //Turn the Spectrum Object to Hex String
      color = color.toHexString();
      if (obj.type === "textbox" || obj.type === "i-text" || obj.type === "marquee") {
        obj.setColor(color);
      } else {
        //
      }
      // obj.backgroundColor(color);
      canvas.renderAll();
      $('#objectTextColor').spectrum("hide");
    },
    palette: [
        ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
        "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
        ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
        "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
        ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
        "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
        "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
        "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
        "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
        "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
        "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
        "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
        "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
        "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
    ]
});

//Text
$('#objectInput').on("keydown keyup paste change", function() {
  var obj = canvas.getActiveObject();
  obj.set('text', $(this).val());
  obj.setCoords();
  canvas.renderAll();
});

//Font Family
//Get an Google Font List

(function (){
  $.getJSON( "https://www.googleapis.com/webfonts/v1/webfonts?sort=alpha&key=AIzaSyDvbHbq0AAW3irCwjSdbNKtklKSAia_SZ8", function() {
  console.log( "success" );
})
  .done(function(data) {
    console.log( "second success" );
    var fontName;
    var option = $('<option></option>');
    console.log(data.items.length); //733 ?
    console.log(data);
    for (var i=0;i<data.items.length; i++) {
      fontName = data.items[i].family;
      // console.log(option);
      $('#objectFontFamily').append($("<option>",{
                      value: fontName,
                      text: fontName
      }));
    }
  })
  .fail(function(err) {
    console.log(err);
  })
  .always(function() {
    console.log( "complete" );
  });
}());

//Global
var fontFamilies = new Array;

$('#objectFontFamily').on('change', function(){
  console.log('triggered');
  var selected = $(this).val();
  var obj = canvas.getActiveObject();
  obj.setFontFamily(selected);
  obj.setCoords();
  canvas.renderAll();

  fontFamilies.push(selected);
  console.log(fontFamilies);
  //Load Fonts
  fontLoader(fontFamilies);
});
function fontLoader(name){
  WebFont.load({ google: {families: name}});
}
//Font Size
$('#objectFontSize').on('change', function(){
  var size = $(this).val();
  var obj = canvas.getActiveObject();
  obj.setFontSize(size);
  obj.setCoords();
  canvas.renderAll();
});

//Link
$('#linkValue').on('keydown keyup change', function(){
  var obj = canvas.getActiveObject();
  var val = $(this).val();
  obj.set('link', val);
});
}
CanvasComposer.Contextmenu = function(){
  "use strict";

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //
  // H E L P E R    F U N C T I O N S
  //
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Function to check if we clicked inside an element with a particular class
   * name.
   * 
   * @param {Object} e The event
   * @param {String} className The class name to check against
   * @return {Boolean}
   */
  function clickInsideElement( e, className ) {
    var el = e.srcElement || e.target;
    
    if ( el.classList.contains(className) ) {
      return el;
    } else {
      while ( el = el.parentNode ) {
        if ( el.classList && el.classList.contains(className) ) {
          return el;
        }
      }
    }

    return false;
  }

  /**
   * Get's exact position of event.
   * 
   * @param {Object} e The event passed in
   * @return {Object} Returns the x and y position
   */
  function getPosition(e) {
    var posx = 0;
    var posy = 0;

    if (!e) var e = window.event;
    
    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else if (e.clientX || e.clientY) {
      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    return {
      x: posx,
      y: posy
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //
  // C O R E    F U N C T I O N S
  //
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  
  /**
   * Variables.
   */
  var contextMenuClassName = "context-menu";
  var contextMenuItemClassName = "context-menu__item";
  var contextMenuLinkClassName = "context-menu__link";
  var contextMenuActive = "context-menu--active";

  var taskItemClassName = "task";
  var taskItemInContext;

  var clickCoords;
  var clickCoordsX;
  var clickCoordsY;

  var menu = document.querySelector("#context-menu");
  var menuItems = menu.querySelectorAll(".context-menu__item");
  var menuState = 0;
  var menuWidth;
  var menuHeight;
  var menuPosition;
  var menuPositionX;
  var menuPositionY;

  var windowWidth;
  var windowHeight;

  /**
   * Initialise our application's code.
   */
  function init() {
    contextListener();
    clickListener();
    keyupListener();
    resizeListener();
  }

  /**
   * Listens for contextmenu events.
   */
  function contextListener() {
    document.addEventListener( "contextmenu", function(e) {
      taskItemInContext = clickInsideElement( e, taskItemClassName );

      if ( taskItemInContext ) {
        e.preventDefault();
        toggleMenuOn();
        positionMenu(e);
      } else {
        taskItemInContext = null;
        toggleMenuOff();
      }
    });
  }

  /**
   * Listens for click events.
   */
  function clickListener() {
    document.addEventListener( "click", function(e) {
      var clickeElIsLink = clickInsideElement( e, contextMenuLinkClassName );

      if ( clickeElIsLink ) {
        e.preventDefault();
        menuItemListener( clickeElIsLink );
      } else {
        var button = e.which || e.button;
        if ( button === 1 ) {
          toggleMenuOff();
        }
      }
    });
  }

  /**
   * Listens for keyup events.
   */
  function keyupListener() {
    window.onkeyup = function(e) {
      if ( e.keyCode === 27 ) {
        toggleMenuOff();
      }
    }
  }

  /**
   * Window resize event listener
   */
  function resizeListener() {
    window.onresize = function(e) {
      toggleMenuOff();
    };
  }

  /**
   * Turns the custom context menu on.
   */
  function toggleMenuOn() {
    if ( menuState !== 1 ) {
      menuState = 1;
      menu.classList.add( contextMenuActive );
    }
  }

  /**
   * Turns the custom context menu off.
   */
  function toggleMenuOff() {
    if ( menuState !== 0 ) {
      menuState = 0;
      menu.classList.remove( contextMenuActive );
    }
  }

  /**
   * Positions the menu properly.
   * 
   * @param {Object} e The event
   */
  function positionMenu(e) {
    clickCoords = getPosition(e);
    clickCoordsX = clickCoords.x;
    clickCoordsY = clickCoords.y;

    menuWidth = menu.offsetWidth + 4;
    menuHeight = menu.offsetHeight + 4;

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    if ( (windowWidth - clickCoordsX) < menuWidth ) {
      menu.style.left = windowWidth - menuWidth + "px";
    } else {
      menu.style.left = clickCoordsX + "px";
    }

    if ( (windowHeight - clickCoordsY) < menuHeight ) {
      menu.style.top = windowHeight - menuHeight + "px";
    } else {
      menu.style.top = clickCoordsY + "px";
    }
  }

  /**
   * Dummy action function that logs an action when a menu item link is clicked
   * 
   * @param {HTMLElement} link The link that was clicked
   */
  function menuItemListener( link ) {
    // console.log( "Task ID - " + taskItemInContext.getAttribute("data-id") + ", Task action - " + link.getAttribute("data-action"));
    var action = link.getAttribute("data-action");
    var obj = canvas.getActiveObject();
    switch(action){
      case 'delete':
        CanvasComposer.Artboard.removeObject();
        break;
      case 'duplicate':
        CanvasComposer.Artboard.duplicateObject();
        break;
      case 'layertop':
        obj.bringToFront();
        canvas.renderAll();
        break;
      case 'layerup':
        obj.bringForward();
        canvas.renderAll();
        break;
      case 'layerdown':
        obj.sendBackwards();
        canvas.renderAll();
        break;
      case 'layerbottom':
        obj.sendToBack();
        break;
      case 'lock':
        CanvasComposer.Artboard.lockObject();
        break;
    }
    
    toggleMenuOff();
  }

  /**
   * Run the app.
   */
  init();
}
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

// function getThumbnails(id , callback) {
//   var url = "https://www.googleapis.com/youtube/v3/videos?id=" + id + "&part=snippet&key=AIzaSyCjiWPLJdE-QbakmKin__3rDqOKLgKyCRY"
//   $.getJSON(url,function(){
//     console.log('success');
//   }).done(function(res){
//     console.log(res);
//     var thumbnails;
//     if (res.items[0].snippet.thumbnails.standard.url != '') {
//       thumbnails = res.items[0].snippet.thumbnails.standard.url;
//     } else {
//       thumbnails = res.items[0].snippet.thumbnails.default.url;
//     }
//     return callback(thumbnails);
//   }).fail(function(error){
//     console.log(error);
//   })
// }



// function validateYouTubeUrl(url) {
//     if (url != undefined || url != '') {        
//         var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
//         var match = url.match(regExp);
//         var mp4,
//             webm;
//         if (match && match[2].length == 11) {
//             return match[2]; 
//         } else {
//             return false;
//         }
//     }
// }
function bindEvents(obj) {
  obj.on('selected', function() {
    console.log('selected');
    $('.objectControl').addClass('active');
    //Determine which Config Panel Should be shown
    if (obj.type === 'textbox' || obj.type === 'i-text' || obj.type === 'clock' || obj.type === "marquee") {
      $('.text-attr').show();
      $('.basic-attr').hide();
    } else {
      $('.text-attr').hide();
      $('.basic-attr').show();
    }
    
    $('#config').fadeIn('fast').promise().done(function(){
      $(this).fadeTo('fast',0.9);
    })
    instantMeta.log(obj);
  });
  //deselect
  canvas.on('before:selection:cleared', function() {
    console.log('deselected');
    $('.objectControl').removeClass('active');
    $('#config').fadeOut('fast');
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
  //After Edit
  obj.on('changed', function() {
    console.log('Exited');
    instantMeta.log(obj);
  })
}
CanvasComposer.MediaLibrary = function(){
	var mediaLibrary = $("#mediaLibrary");
	//MediaLibrary
	$('.js-library').on('click', function(){
		mediaLibrary.addClass('active');
		//Load Slides form Slider
		var obj = canvas.getActiveObject();
		if (obj.type === 'slider') {
			//Clean up
			mediaLibrary.find('.selection').empty();
			mediaLibrary.find('.resources a').removeClass('active');
			var resourceid,
					src,
					continued,
					filename,
					targetResource,
					transitionPeriod,
					transitionType;
			var selection = $('.settings-container .selection');
			//push elements back by id
			for (var i=0; i<obj.slides.length; i++) {
				resourceid = obj.slides[i].id;
				src = obj.slides[i].src;
				continued = obj.slides[i].continued;
				filename = obj.slides[i].filename;
				transitionPeriod = obj.slides[i].transitionperiod;
				if (transitionPeriod == '') {
					transitionPeriod = 1;
				}
				transitionType = obj.slides[i].transitiontype;
				// var $item = "<li data-resourceid="+ resourceid +" data-src=" + src + "><div class='order'><div class='continued'><input type='number' value='" + continued + "'></div></div><div class='description'><div class='filename'>" + filename + "</div></div></li>";
				var $item = "<li data-resourceid="+ resourceid +" data-src=" + src + "><div class='controlgroup'><label>持續時間：</label><div class='controls'><div class='row'><div class='grid g-9-12'><div class='order'><div class='continued'><input class='leastTime' type='number' value='" + continued + "'></div></div></div><div class='grid g-3-12'><div class='thumbnail' style='background-image: url(" + src + ");' title='" + filename + "'></div></div></div></div></div><div class='controlgroup'><label>效果：</label><div class='controls'><div class='select-wrapper'><select class='transition-type'><option value='random'>隨機</option><option value='leftright'>由左至右</option><option value='rightleft'>由右至左</option><option value='bottomtop'>由下至上</option><option value='topbottom'>由上至下</option></select></div></div></div><div class='controlgroup'><label>特效時間</label><div class='controls'><input class='transition-period' type='text' placeholder='預設' value='" + transitionPeriod + "'></div></div></li>";
				//Turn this to jQuery Obj
				$item = $($item);
				//Select Transition Type
				$item.find('.transition-type option[value=' + transitionType + ']').attr('selected', true);
				selection.append($item);
				$('#mediaLibrary .resources li').each(function(){
					targetResource = $(this).children('a').attr('data-resourceid');
					if (resourceid === targetResource) {
						$(this).children('a').addClass('active');
					}
				})
			}
		} else {
			//Normally Clean Up Library Selections
			mediaLibrary.find('.selection').empty();
			mediaLibrary.find('.resources a').removeClass('active');
		}
	})

	mediaLibrary.find('.js-close').on('click', function(){
		mediaLibrary.removeClass('active');
	})


	//Resource Selected
	$('#mediaLibrary .resources').on('click','a',function(){
		var filename,
				src,
				count,
				continued,
				resourceid,
				targetid;
		var selection = $('.settings-container .selection');
		src = $(this).attr('data-src');
		filename = $(this).attr('title');
		resourceid = $(this).attr('data-resourceid');
		continued = "3"; //Default
		var $item = "<li data-resourceid="+ resourceid +" data-src=" + src + "><div class='controlgroup'><label>持續時間：</label><div class='controls'><div class='row'><div class='grid g-9-12'><div class='order'><div class='continued'><input class='leastTime' type='number' value='" + continued + "'></div></div></div><div class='grid g-3-12'><div class='thumbnail' style='background-image: url(" + src + ");' title='" + filename + "'></div></div></div></div></div><div class='controlgroup'><label>效果：</label><div class='controls'><div class='select-wrapper'><select class='transition-type'><option value='random'>隨機</option><option value='leftright'>由左至右</option><option value='rightleft'>由右至左</option><option value='bottomtop'>由下至上</option><option value='topbottom'>由上至下</option></select></div></div></div><div class='controlgroup'><label>特效時間</label><div class='controls'><input class='transition-period' type='text' placeholder='預設'></div></div></li>";
		var anchor = $(this);
		if (anchor.hasClass('active')) {
			selection.children('li').each(function(){
				if ( resourceid === $(this).attr('data-resourceid') ) {
					$(this).remove();
					anchor.removeClass('active');
				}
			})
		} else {
			selection.append($item);
			anchor.addClass('active');
		}
	});

	//Send Object to Fabricjs
	$('.js-sendToObj').on('click', function(){
		var resourceid,
				src,
				continued,
				filename,
				transitionPeriod,
				transitionType;
		//先搜集所有內容
		var selected = [];
		var selection = $('.settings-container .selection');

		selection.children('li').each(function(){
			resourceid = $(this).attr('data-resourceid');
			src = $(this).attr('data-src');
			continued = $(this).find('.leastTime').val();
			filename = $(this).find('.filename').html();
			transitionPeriod = $(this).find('.transition-period').val();
			transitionType = $(this).find('.transition-type').val();
			var collected = {'id':resourceid, 'src':src, 'continued': continued, 'filename': filename, 'transitiontype': transitionType, 'transitionperiod': transitionPeriod};
			selected.push(collected);
			console.log(selected);
		})

		selectionConfirmator(selected);
	})

	function selectionConfirmator(selected){
		//如選取多個物件
		if ( selected.length > 1) {
			console.log('an array');
			// 取得當前物件
			var obj = canvas.getActiveObject();
			if (obj == null) {
				alert('未選取任何物件');
			} else {
				//如果是影片物件，先停止播放，然後移除自己
				if (obj._element !== undefined && obj._element.localName === "video") {
					obj.getElement().pause();
					obj.remove();
				} else {
					obj.remove();
				}
				//送出建立新物件要求
				CanvasComposer.Artboard.addMedia(selected);
			}
			mediaLibrary.removeClass('active');
		//選取單一物件
		} else if ( selected.length === 1) {
			console.log('single');
			// 取得當前物件
			var obj = canvas.getActiveObject();
			if (obj == null) {
				alert('未選取任何物件');
			} else {
				//如果是影片物件，先停止播放，然後移除自己
				if (obj._element !== undefined && obj._element.localName === "video") {
					obj.getElement().pause();
					obj.remove();
				} else {
					obj.remove();
				}
				//送出建立新物件要求
				CanvasComposer.Artboard.addMedia(selected);
				console.log(selected);
			}
			mediaLibrary.removeClass('active');
		}
	}
};
CanvasComposer.inboundLinks = function() {
	var inboundList = $('#inboundlist');

	$('.js-inbounds').on('click', function(){
		inboundList.addClass('active');
	});

	$('#inboundlist a[data-rel]').on('click', function(){
		var link = $(this).data("rel");
		var obj = canvas.getActiveObject();
		obj.link = link;
		inboundList.removeClass('active');
		instantMeta.log(obj);
	});

	$('#inboundlist .js-close').on('click', function(){
      inboundList.removeClass('active');
    });

}
var instantMeta = {
  log: function(obj){
    obj = obj.toObject();
    var width,
        height,
        scaleX,
        scaleY,
        radius,
        left,
        top,
        angle,
        type,
        media,
        preview,
        color,
        textcolor,
        text,
        textsize,
        fontfamily,
        link;

    width = obj.width*obj.scaleX;
    height = obj.height*obj.scaleY;
    scaleX = obj.scaleX;
    scaleY = obj.scaleY;
    radius = obj.radius;
    left = obj.left;
    top = obj.top;
    angle = obj.angle;
    type = obj.type;
    link = obj.link;
    if (obj.type === 'textbox' || obj.type === 'i-text') {
        color = obj.textBackgroundColor;
    } else {
      color = obj.fill;
    }
    textcolor = obj.fill;
    text = obj.text;
    textsize = obj.fontSize;
    fontfamily = obj.fontFamily;
    switch (type) {
        case 'image':
            media = obj.src;
            break;
        case 'video':
            media = obj.media.video;
            break;
        case 'slider':
            media = 'mixture';
            break;
    }
    //混合物件 preview
    // if (type === "image") {
    //   if (obj.toObject().media.video != '') {
    //     media = obj.toObject().media.video;
    //     preview = "<video controls autoplay muted><source src=" + obj.toObject().media.video + "></source></video>";
    //     console.log(media);
    //   } else if ( obj.toObject().media.slides.length != 0 ) {
    //     media = obj.toObject().media.slides;
    //     preview = "";
    //   } else if ( obj.toObject().src != ''){
    //     media = obj.toObject().src;
    //     preview = "<img src=" + obj.toObject().src + ">";
    //   } else {
    //     alert('Type Error');
    //   }
    // }
    // media = obj.media.video;

    $('.attributes-wrapper .type input').val(type);
    $('.attributes-wrapper .width input').val(width);
    $('.attributes-wrapper .height input').val(height);
    $('.attributes-wrapper .radius input').val(radius);
    $('.attributes-wrapper .angle input').val(angle);
    $('.attributes-wrapper .top input').val(top);
    $('.attributes-wrapper .left input').val(left);
    $('.attributes-wrapper .media input').val(media);
    // $('.attributes-wrapper .mediaPreview').html(preview);
    $('.attributes-wrapper .scalex input').val(scaleX);
    $('.attributes-wrapper .scaley input').val(scaleY);
    $('.attributes-wrapper .text input').val(text);
    $('.attributes-wrapper .link input').val(link);
    $('.attributes-wrapper .fontsize select option[value=' + textsize + ']').attr('selected',true);
    $('.attributes-wrapper .fontfamily select option[value="' + fontfamily + '"]').attr('selected',true);
    $('#objectColor').spectrum("set", color);
    $('#objectTextColor').spectrum("set", textcolor);

  },
  clean: function(obj){
    $('.attributes-wrapper input').val('');
    $('.attributes-wrapper .mediaPreview').empty();
    console.log('clean');
  }
}
//Weather API Using Yahoo Weather API
var Weather = {
	translate: function(loc, callback){
		var location = loc;
		var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20%3D%20' + location + '&format=json&callback=?';
		$.getJSON(url, function(json) {
			console.log(json);
		  var conditionText = conditionTextDic[json.query.results.channel.item.condition.code.toString()];
		  var conditionImg = conditionImgDic[json.query.results.channel.item.condition.code.toString()];
		  var temp = Math.round((json.query.results.channel.item.condition.temp - 32)*5/9) + "°C";
		  var city = json.query.results.channel.location.city;
		  var country = json.query.results.channel.location.country;
			callback && callback({conditionText, conditionImg, temp, city, country});
		}).fail(function(err) {
		    console.log(err);
		});
		
		var conditionImgDic = {
			"0":"00.svg",
			"1":"01.svg",
			"2":"02.svg",
			"3":"03.svg",
			"4":"04.svg",
			"5":"05.svg",
			"6":"06.svg",
			"7":"07.svg",
			"8":"08.svg",
			"9":"09.svg",
			"10":"10.svg",
			"11":"11.svg",
			"12":"12.svg",
			"13":"13.svg",
			"14":"14.svg",
			"15":"15.svg",
			"16":"16.svg",
			"17":"17.svg",
			"18":"18.svg",
			"19":"19.svg",
			"20":"20.svg",
			"21":"21.svg",
			"22":"22.svg",
			"23":"23.svg",
			"24":"24.svg",
			"25":"25.svg",
			"26":"26.svg",
			"27":"27.svg",
			"28":"28.svg",
			"29":"29.svg",
			"30":"30.svg",
			"31":"31.svg",
			"32":"32.svg",
			"33":"33.svg",
			"34":"34.svg",
			"35":"35.svg",
			"36":"36.svg",
			"37":"37.svg",
			"38":"38.svg",
			"39":"39.svg",
			"40":"40.svg",
			"41":"41.svg",
			"42":"42.svg",
			"43":"43.svg",
			"44":"44.svg",
			"45":"45.svg",
			"46":"46.svg",
			"47":"47.svg",
			"3200":"na.svg"
		};
		var conditionTextDic = {
			"0":"龍捲風",
			"1":"熱帶風暴",
			"2":"颶風",
			"3":"強雷陣雨",
			"4":"雷陣雨",
			"5":"混合雨雪",
			"6":"混合雨雪",
			"7":"混合雨雪",
			"8":"冰凍小雨",
			"9":"細雨",
			"10":"凍雨",
			"11":"陣雨",
			"12":"陣雨",
			"13":"飄雪",
			"14":"陣雪",
			"15":"吹雪",
			"16":"下雪",
			"17":"冰雹",
			"18":"雨雪",
			"19":"多塵",
			"20":"多霧",
			"21":"陰霾",
			"22":"多煙",
			"23":"狂風大作",
			"24":"有風",
			"25":"冷",
			"26":"多雲",
			"27":"晴間多雲",
			"28":"晴間多雲",
			"29":"晴間多雲",
			"30":"晴間多雲",
			"31":"清晰的（夜）",
			"32":"晴朗",
			"33":"晴朗",
			"34":"晴朗",
			"35":"雨和冰雹",
			"36":"炎熱",
			"37":"雷陣雨",
			"38":"零星雷陣雨",
			"39":"零星雷陣雨",
			"40":"零星雷陣雨",
			"41":"大雪",
			"42":"零星陣雪",
			"43":"大雪",
			"44":"多雲",
			"45":"雷陣雨",
			"46":"陣雪",
			"47":"雷陣雨",
			"3200":"資料錯誤"
		};
	}
}

// https://query.yahooapis.com/v1/public/yql?q=select*from weather.forecast where woeid in (select woeid from geo.places(1) where text='taiwan')&format=json
CanvasComposer.Marquee = function(){
	$('#marquee-source').on('change', function(){
		var val = $(this).val();
		//Get the proper form
		$('#' + val).slideDown().promise().done(function(){
			$(this).addClass('active');
			$(this).siblings().slideUp().promise().done(function(){
				$(this).removeClass('active');
			})
		});
	})
	$('.js-addRow').on('click', function(){
		var el = $('.string-list-wrapper .string-item:last-child').clone();
		$('.string-list-wrapper').append(el);
	});
	$('.js-removeRow').on('click', function(){
		$('.string-list-wrapper .string-item:last-child').remove();
	});

	$('.js-sendToMarquee').on('click', function(){
		var marquee = {};
		var marqueeGroup = [];
		var marqueestring,
			marqueeleasttime,
			marqueetype,
			marqueetransitionperiod;
		var marqueedefault = 3;
		var activeTarget = $('.marquee-form.active');
		activeTarget.find('.string-item').each(function(){
			marqueestring = $(this).find('.marquee-string').val();
			marqueeleasttime = $(this).find('.marquee-leasttime').val();
			marqueetype = $(this).find('.marquee-type').val();
			marqueetransitionperiod = $(this).find('.marquee-transitionperiod').val();

			if (marqueestring == '') {
				marqueestring = 'null';
			}
			if (marqueeleasttime == '') {
				marqueeleasttime = marqueedefault;
			}
			if (marqueetype == '') {
				marqueetype = 'default';
			}
			if(marqueetransitionperiod == '') {
				marqueetransitionperiod = marqueedefault;
			}
			marquee = {string: marqueestring, leastTime: marqueeleasttime, transitionType: marqueetype, transitionPeriod: marqueetransitionperiod};
			marqueeGroup.push(marquee);
		});
		console.log(marqueeGroup);
		//Create
		CanvasComposer.Artboard.addMarquee(marqueeGroup);
		$('#marquee-settings').removeClass('active');
	});
	$('#marquee-settings').find('.js-close').on('click', function(){
		$('#marquee-settings').removeClass('active');
	});
};

// Spectrum Colorpicker v1.8.0
// https://github.com/bgrins/spectrum
// Author: Brian Grinstead
// License: MIT

(function (factory) {
    "use strict";

    if (typeof define === 'function' && define.amd) { // AMD
        define(['jquery'], factory);
    }
    else if (typeof exports == "object" && typeof module == "object") { // CommonJS
        module.exports = factory(require('jquery'));
    }
    else { // Browser
        factory(jQuery);
    }
})(function($, undefined) {
    "use strict";

    var defaultOpts = {

        // Callbacks
        beforeShow: noop,
        move: noop,
        change: noop,
        show: noop,
        hide: noop,

        // Options
        color: false,
        flat: false,
        showInput: false,
        allowEmpty: false,
        showButtons: true,
        clickoutFiresChange: true,
        showInitial: false,
        showPalette: false,
        showPaletteOnly: false,
        hideAfterPaletteSelect: false,
        togglePaletteOnly: false,
        showSelectionPalette: true,
        localStorageKey: false,
        appendTo: "body",
        maxSelectionSize: 7,
        cancelText: "cancel",
        chooseText: "choose",
        togglePaletteMoreText: "more",
        togglePaletteLessText: "less",
        clearText: "Clear Color Selection",
        noColorSelectedText: "No Color Selected",
        preferredFormat: false,
        className: "", // Deprecated - use containerClassName and replacerClassName instead.
        containerClassName: "",
        replacerClassName: "",
        showAlpha: false,
        theme: "sp-light",
        palette: [["#ffffff", "#000000", "#ff0000", "#ff8000", "#ffff00", "#008000", "#0000ff", "#4b0082", "#9400d3"]],
        selectionPalette: [],
        disabled: false,
        offset: null
    },
    spectrums = [],
    IE = !!/msie/i.exec( window.navigator.userAgent ),
    rgbaSupport = (function() {
        function contains( str, substr ) {
            return !!~('' + str).indexOf(substr);
        }

        var elem = document.createElement('div');
        var style = elem.style;
        style.cssText = 'background-color:rgba(0,0,0,.5)';
        return contains(style.backgroundColor, 'rgba') || contains(style.backgroundColor, 'hsla');
    })(),
    replaceInput = [
        "<div class='sp-replacer'>",
            "<div class='sp-preview'><div class='sp-preview-inner'></div></div>",
            "<div class='sp-dd'>&#9660;</div>",
        "</div>"
    ].join(''),
    markup = (function () {

        // IE does not support gradients with multiple stops, so we need to simulate
        //  that for the rainbow slider with 8 divs that each have a single gradient
        var gradientFix = "";
        if (IE) {
            for (var i = 1; i <= 6; i++) {
                gradientFix += "<div class='sp-" + i + "'></div>";
            }
        }

        return [
            "<div class='sp-container sp-hidden'>",
                "<div class='sp-palette-container'>",
                    "<div class='sp-palette sp-thumb sp-cf'></div>",
                    "<div class='sp-palette-button-container sp-cf'>",
                        "<button type='button' class='sp-palette-toggle'></button>",
                    "</div>",
                "</div>",
                "<div class='sp-picker-container'>",
                    "<div class='sp-top sp-cf'>",
                        "<div class='sp-fill'></div>",
                        "<div class='sp-top-inner'>",
                            "<div class='sp-color'>",
                                "<div class='sp-sat'>",
                                    "<div class='sp-val'>",
                                        "<div class='sp-dragger'></div>",
                                    "</div>",
                                "</div>",
                            "</div>",
                            "<div class='sp-clear sp-clear-display'>",
                            "</div>",
                            "<div class='sp-hue'>",
                                "<div class='sp-slider'></div>",
                                gradientFix,
                            "</div>",
                        "</div>",
                        "<div class='sp-alpha'><div class='sp-alpha-inner'><div class='sp-alpha-handle'></div></div></div>",
                    "</div>",
                    "<div class='sp-input-container sp-cf'>",
                        "<input class='sp-input' type='text' spellcheck='false'  />",
                    "</div>",
                    "<div class='sp-initial sp-thumb sp-cf'></div>",
                    "<div class='sp-button-container sp-cf'>",
                        "<a class='sp-cancel' href='#'></a>",
                        "<button type='button' class='sp-choose'></button>",
                    "</div>",
                "</div>",
            "</div>"
        ].join("");
    })();

    function paletteTemplate (p, color, className, opts) {
        var html = [];
        for (var i = 0; i < p.length; i++) {
            var current = p[i];
            if(current) {
                var tiny = tinycolor(current);
                var c = tiny.toHsl().l < 0.5 ? "sp-thumb-el sp-thumb-dark" : "sp-thumb-el sp-thumb-light";
                c += (tinycolor.equals(color, current)) ? " sp-thumb-active" : "";
                var formattedString = tiny.toString(opts.preferredFormat || "rgb");
                var swatchStyle = rgbaSupport ? ("background-color:" + tiny.toRgbString()) : "filter:" + tiny.toFilter();
                html.push('<span title="' + formattedString + '" data-color="' + tiny.toRgbString() + '" class="' + c + '"><span class="sp-thumb-inner" style="' + swatchStyle + ';" /></span>');
            } else {
                var cls = 'sp-clear-display';
                html.push($('<div />')
                    .append($('<span data-color="" style="background-color:transparent;" class="' + cls + '"></span>')
                        .attr('title', opts.noColorSelectedText)
                    )
                    .html()
                );
            }
        }
        return "<div class='sp-cf " + className + "'>" + html.join('') + "</div>";
    }

    function hideAll() {
        for (var i = 0; i < spectrums.length; i++) {
            if (spectrums[i]) {
                spectrums[i].hide();
            }
        }
    }

    function instanceOptions(o, callbackContext) {
        var opts = $.extend({}, defaultOpts, o);
        opts.callbacks = {
            'move': bind(opts.move, callbackContext),
            'change': bind(opts.change, callbackContext),
            'show': bind(opts.show, callbackContext),
            'hide': bind(opts.hide, callbackContext),
            'beforeShow': bind(opts.beforeShow, callbackContext)
        };

        return opts;
    }

    function spectrum(element, o) {

        var opts = instanceOptions(o, element),
            flat = opts.flat,
            showSelectionPalette = opts.showSelectionPalette,
            localStorageKey = opts.localStorageKey,
            theme = opts.theme,
            callbacks = opts.callbacks,
            resize = throttle(reflow, 10),
            visible = false,
            isDragging = false,
            dragWidth = 0,
            dragHeight = 0,
            dragHelperHeight = 0,
            slideHeight = 0,
            slideWidth = 0,
            alphaWidth = 0,
            alphaSlideHelperWidth = 0,
            slideHelperHeight = 0,
            currentHue = 0,
            currentSaturation = 0,
            currentValue = 0,
            currentAlpha = 1,
            palette = [],
            paletteArray = [],
            paletteLookup = {},
            selectionPalette = opts.selectionPalette.slice(0),
            maxSelectionSize = opts.maxSelectionSize,
            draggingClass = "sp-dragging",
            shiftMovementDirection = null;

        var doc = element.ownerDocument,
            body = doc.body,
            boundElement = $(element),
            disabled = false,
            container = $(markup, doc).addClass(theme),
            pickerContainer = container.find(".sp-picker-container"),
            dragger = container.find(".sp-color"),
            dragHelper = container.find(".sp-dragger"),
            slider = container.find(".sp-hue"),
            slideHelper = container.find(".sp-slider"),
            alphaSliderInner = container.find(".sp-alpha-inner"),
            alphaSlider = container.find(".sp-alpha"),
            alphaSlideHelper = container.find(".sp-alpha-handle"),
            textInput = container.find(".sp-input"),
            paletteContainer = container.find(".sp-palette"),
            initialColorContainer = container.find(".sp-initial"),
            cancelButton = container.find(".sp-cancel"),
            clearButton = container.find(".sp-clear"),
            chooseButton = container.find(".sp-choose"),
            toggleButton = container.find(".sp-palette-toggle"),
            isInput = boundElement.is("input"),
            isInputTypeColor = isInput && boundElement.attr("type") === "color" && inputTypeColorSupport(),
            shouldReplace = isInput && !flat,
            replacer = (shouldReplace) ? $(replaceInput).addClass(theme).addClass(opts.className).addClass(opts.replacerClassName) : $([]),
            offsetElement = (shouldReplace) ? replacer : boundElement,
            previewElement = replacer.find(".sp-preview-inner"),
            initialColor = opts.color || (isInput && boundElement.val()),
            colorOnShow = false,
            currentPreferredFormat = opts.preferredFormat,
            clickoutFiresChange = !opts.showButtons || opts.clickoutFiresChange,
            isEmpty = !initialColor,
            allowEmpty = opts.allowEmpty && !isInputTypeColor;

        function applyOptions() {

            if (opts.showPaletteOnly) {
                opts.showPalette = true;
            }

            toggleButton.text(opts.showPaletteOnly ? opts.togglePaletteMoreText : opts.togglePaletteLessText);

            if (opts.palette) {
                palette = opts.palette.slice(0);
                paletteArray = $.isArray(palette[0]) ? palette : [palette];
                paletteLookup = {};
                for (var i = 0; i < paletteArray.length; i++) {
                    for (var j = 0; j < paletteArray[i].length; j++) {
                        var rgb = tinycolor(paletteArray[i][j]).toRgbString();
                        paletteLookup[rgb] = true;
                    }
                }
            }

            container.toggleClass("sp-flat", flat);
            container.toggleClass("sp-input-disabled", !opts.showInput);
            container.toggleClass("sp-alpha-enabled", opts.showAlpha);
            container.toggleClass("sp-clear-enabled", allowEmpty);
            container.toggleClass("sp-buttons-disabled", !opts.showButtons);
            container.toggleClass("sp-palette-buttons-disabled", !opts.togglePaletteOnly);
            container.toggleClass("sp-palette-disabled", !opts.showPalette);
            container.toggleClass("sp-palette-only", opts.showPaletteOnly);
            container.toggleClass("sp-initial-disabled", !opts.showInitial);
            container.addClass(opts.className).addClass(opts.containerClassName);

            reflow();
        }

        function initialize() {

            if (IE) {
                container.find("*:not(input)").attr("unselectable", "on");
            }

            applyOptions();

            if (shouldReplace) {
                boundElement.after(replacer).hide();
            }

            if (!allowEmpty) {
                clearButton.hide();
            }

            if (flat) {
                boundElement.after(container).hide();
            }
            else {

                var appendTo = opts.appendTo === "parent" ? boundElement.parent() : $(opts.appendTo);
                if (appendTo.length !== 1) {
                    appendTo = $("body");
                }

                appendTo.append(container);
            }

            updateSelectionPaletteFromStorage();

            offsetElement.bind("click.spectrum touchstart.spectrum", function (e) {
                if (!disabled) {
                    toggle();
                }

                e.stopPropagation();

                if (!$(e.target).is("input")) {
                    e.preventDefault();
                }
            });

            if(boundElement.is(":disabled") || (opts.disabled === true)) {
                disable();
            }

            // Prevent clicks from bubbling up to document.  This would cause it to be hidden.
            container.click(stopPropagation);

            // Handle user typed input
            textInput.change(setFromTextInput);
            textInput.bind("paste", function () {
                setTimeout(setFromTextInput, 1);
            });
            textInput.keydown(function (e) { if (e.keyCode == 13) { setFromTextInput(); } });

            cancelButton.text(opts.cancelText);
            cancelButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();
                revert();
                hide();
            });

            clearButton.attr("title", opts.clearText);
            clearButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();
                isEmpty = true;
                move();

                if(flat) {
                    //for the flat style, this is a change event
                    updateOriginalInput(true);
                }
            });

            chooseButton.text(opts.chooseText);
            chooseButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();

                if (IE && textInput.is(":focus")) {
                    textInput.trigger('change');
                }

                if (isValid()) {
                    updateOriginalInput(true);
                    hide();
                }
            });

            toggleButton.text(opts.showPaletteOnly ? opts.togglePaletteMoreText : opts.togglePaletteLessText);
            toggleButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();

                opts.showPaletteOnly = !opts.showPaletteOnly;

                // To make sure the Picker area is drawn on the right, next to the
                // Palette area (and not below the palette), first move the Palette
                // to the left to make space for the picker, plus 5px extra.
                // The 'applyOptions' function puts the whole container back into place
                // and takes care of the button-text and the sp-palette-only CSS class.
                if (!opts.showPaletteOnly && !flat) {
                    container.css('left', '-=' + (pickerContainer.outerWidth(true) + 5));
                }
                applyOptions();
            });

            draggable(alphaSlider, function (dragX, dragY, e) {
                currentAlpha = (dragX / alphaWidth);
                isEmpty = false;
                if (e.shiftKey) {
                    currentAlpha = Math.round(currentAlpha * 10) / 10;
                }

                move();
            }, dragStart, dragStop);

            draggable(slider, function (dragX, dragY) {
                currentHue = parseFloat(dragY / slideHeight);
                isEmpty = false;
                if (!opts.showAlpha) {
                    currentAlpha = 1;
                }
                move();
            }, dragStart, dragStop);

            draggable(dragger, function (dragX, dragY, e) {

                // shift+drag should snap the movement to either the x or y axis.
                if (!e.shiftKey) {
                    shiftMovementDirection = null;
                }
                else if (!shiftMovementDirection) {
                    var oldDragX = currentSaturation * dragWidth;
                    var oldDragY = dragHeight - (currentValue * dragHeight);
                    var furtherFromX = Math.abs(dragX - oldDragX) > Math.abs(dragY - oldDragY);

                    shiftMovementDirection = furtherFromX ? "x" : "y";
                }

                var setSaturation = !shiftMovementDirection || shiftMovementDirection === "x";
                var setValue = !shiftMovementDirection || shiftMovementDirection === "y";

                if (setSaturation) {
                    currentSaturation = parseFloat(dragX / dragWidth);
                }
                if (setValue) {
                    currentValue = parseFloat((dragHeight - dragY) / dragHeight);
                }

                isEmpty = false;
                if (!opts.showAlpha) {
                    currentAlpha = 1;
                }

                move();

            }, dragStart, dragStop);

            if (!!initialColor) {
                set(initialColor);

                // In case color was black - update the preview UI and set the format
                // since the set function will not run (default color is black).
                updateUI();
                currentPreferredFormat = opts.preferredFormat || tinycolor(initialColor).format;

                addColorToSelectionPalette(initialColor);
            }
            else {
                updateUI();
            }

            if (flat) {
                show();
            }

            function paletteElementClick(e) {
                if (e.data && e.data.ignore) {
                    set($(e.target).closest(".sp-thumb-el").data("color"));
                    move();
                }
                else {
                    set($(e.target).closest(".sp-thumb-el").data("color"));
                    move();
                    updateOriginalInput(true);
                    if (opts.hideAfterPaletteSelect) {
                      hide();
                    }
                }

                return false;
            }

            var paletteEvent = IE ? "mousedown.spectrum" : "click.spectrum touchstart.spectrum";
            paletteContainer.delegate(".sp-thumb-el", paletteEvent, paletteElementClick);
            initialColorContainer.delegate(".sp-thumb-el:nth-child(1)", paletteEvent, { ignore: true }, paletteElementClick);
        }

        function updateSelectionPaletteFromStorage() {

            if (localStorageKey && window.localStorage) {

                // Migrate old palettes over to new format.  May want to remove this eventually.
                try {
                    var oldPalette = window.localStorage[localStorageKey].split(",#");
                    if (oldPalette.length > 1) {
                        delete window.localStorage[localStorageKey];
                        $.each(oldPalette, function(i, c) {
                             addColorToSelectionPalette(c);
                        });
                    }
                }
                catch(e) { }

                try {
                    selectionPalette = window.localStorage[localStorageKey].split(";");
                }
                catch (e) { }
            }
        }

        function addColorToSelectionPalette(color) {
            if (showSelectionPalette) {
                var rgb = tinycolor(color).toRgbString();
                if (!paletteLookup[rgb] && $.inArray(rgb, selectionPalette) === -1) {
                    selectionPalette.push(rgb);
                    while(selectionPalette.length > maxSelectionSize) {
                        selectionPalette.shift();
                    }
                }

                if (localStorageKey && window.localStorage) {
                    try {
                        window.localStorage[localStorageKey] = selectionPalette.join(";");
                    }
                    catch(e) { }
                }
            }
        }

        function getUniqueSelectionPalette() {
            var unique = [];
            if (opts.showPalette) {
                for (var i = 0; i < selectionPalette.length; i++) {
                    var rgb = tinycolor(selectionPalette[i]).toRgbString();

                    if (!paletteLookup[rgb]) {
                        unique.push(selectionPalette[i]);
                    }
                }
            }

            return unique.reverse().slice(0, opts.maxSelectionSize);
        }

        function drawPalette() {

            var currentColor = get();

            var html = $.map(paletteArray, function (palette, i) {
                return paletteTemplate(palette, currentColor, "sp-palette-row sp-palette-row-" + i, opts);
            });

            updateSelectionPaletteFromStorage();

            if (selectionPalette) {
                html.push(paletteTemplate(getUniqueSelectionPalette(), currentColor, "sp-palette-row sp-palette-row-selection", opts));
            }

            paletteContainer.html(html.join(""));
        }

        function drawInitial() {
            if (opts.showInitial) {
                var initial = colorOnShow;
                var current = get();
                initialColorContainer.html(paletteTemplate([initial, current], current, "sp-palette-row-initial", opts));
            }
        }

        function dragStart() {
            if (dragHeight <= 0 || dragWidth <= 0 || slideHeight <= 0) {
                reflow();
            }
            isDragging = true;
            container.addClass(draggingClass);
            shiftMovementDirection = null;
            boundElement.trigger('dragstart.spectrum', [ get() ]);
        }

        function dragStop() {
            isDragging = false;
            container.removeClass(draggingClass);
            boundElement.trigger('dragstop.spectrum', [ get() ]);
        }

        function setFromTextInput() {

            var value = textInput.val();

            if ((value === null || value === "") && allowEmpty) {
                set(null);
                updateOriginalInput(true);
            }
            else {
                var tiny = tinycolor(value);
                if (tiny.isValid()) {
                    set(tiny);
                    updateOriginalInput(true);
                }
                else {
                    textInput.addClass("sp-validation-error");
                }
            }
        }

        function toggle() {
            if (visible) {
                hide();
            }
            else {
                show();
            }
        }

        function show() {
            var event = $.Event('beforeShow.spectrum');

            if (visible) {
                reflow();
                return;
            }

            boundElement.trigger(event, [ get() ]);

            if (callbacks.beforeShow(get()) === false || event.isDefaultPrevented()) {
                return;
            }

            hideAll();
            visible = true;

            $(doc).bind("keydown.spectrum", onkeydown);
            $(doc).bind("click.spectrum", clickout);
            $(window).bind("resize.spectrum", resize);
            replacer.addClass("sp-active");
            container.removeClass("sp-hidden");

            reflow();
            updateUI();

            colorOnShow = get();

            drawInitial();
            callbacks.show(colorOnShow);
            boundElement.trigger('show.spectrum', [ colorOnShow ]);
        }

        function onkeydown(e) {
            // Close on ESC
            if (e.keyCode === 27) {
                hide();
            }
        }

        function clickout(e) {
            // Return on right click.
            if (e.button == 2) { return; }

            // If a drag event was happening during the mouseup, don't hide
            // on click.
            if (isDragging) { return; }

            if (clickoutFiresChange) {
                updateOriginalInput(true);
            }
            else {
                revert();
            }
            hide();
        }

        function hide() {
            // Return if hiding is unnecessary
            if (!visible || flat) { return; }
            visible = false;

            $(doc).unbind("keydown.spectrum", onkeydown);
            $(doc).unbind("click.spectrum", clickout);
            $(window).unbind("resize.spectrum", resize);

            replacer.removeClass("sp-active");
            container.addClass("sp-hidden");

            callbacks.hide(get());
            boundElement.trigger('hide.spectrum', [ get() ]);
        }

        function revert() {
            set(colorOnShow, true);
        }

        function set(color, ignoreFormatChange) {
            if (tinycolor.equals(color, get())) {
                // Update UI just in case a validation error needs
                // to be cleared.
                updateUI();
                return;
            }

            var newColor, newHsv;
            if (!color && allowEmpty) {
                isEmpty = true;
            } else {
                isEmpty = false;
                newColor = tinycolor(color);
                newHsv = newColor.toHsv();

                currentHue = (newHsv.h % 360) / 360;
                currentSaturation = newHsv.s;
                currentValue = newHsv.v;
                currentAlpha = newHsv.a;
            }
            updateUI();

            if (newColor && newColor.isValid() && !ignoreFormatChange) {
                currentPreferredFormat = opts.preferredFormat || newColor.getFormat();
            }
        }

        function get(opts) {
            opts = opts || { };

            if (allowEmpty && isEmpty) {
                return null;
            }

            return tinycolor.fromRatio({
                h: currentHue,
                s: currentSaturation,
                v: currentValue,
                a: Math.round(currentAlpha * 100) / 100
            }, { format: opts.format || currentPreferredFormat });
        }

        function isValid() {
            return !textInput.hasClass("sp-validation-error");
        }

        function move() {
            updateUI();

            callbacks.move(get());
            boundElement.trigger('move.spectrum', [ get() ]);
        }

        function updateUI() {

            textInput.removeClass("sp-validation-error");

            updateHelperLocations();

            // Update dragger background color (gradients take care of saturation and value).
            var flatColor = tinycolor.fromRatio({ h: currentHue, s: 1, v: 1 });
            dragger.css("background-color", flatColor.toHexString());

            // Get a format that alpha will be included in (hex and names ignore alpha)
            var format = currentPreferredFormat;
            if (currentAlpha < 1 && !(currentAlpha === 0 && format === "name")) {
                if (format === "hex" || format === "hex3" || format === "hex6" || format === "name") {
                    format = "rgb";
                }
            }

            var realColor = get({ format: format }),
                displayColor = '';

             //reset background info for preview element
            previewElement.removeClass("sp-clear-display");
            previewElement.css('background-color', 'transparent');

            if (!realColor && allowEmpty) {
                // Update the replaced elements background with icon indicating no color selection
                previewElement.addClass("sp-clear-display");
            }
            else {
                var realHex = realColor.toHexString(),
                    realRgb = realColor.toRgbString();

                // Update the replaced elements background color (with actual selected color)
                if (rgbaSupport || realColor.alpha === 1) {
                    previewElement.css("background-color", realRgb);
                }
                else {
                    previewElement.css("background-color", "transparent");
                    previewElement.css("filter", realColor.toFilter());
                }

                if (opts.showAlpha) {
                    var rgb = realColor.toRgb();
                    rgb.a = 0;
                    var realAlpha = tinycolor(rgb).toRgbString();
                    var gradient = "linear-gradient(left, " + realAlpha + ", " + realHex + ")";

                    if (IE) {
                        alphaSliderInner.css("filter", tinycolor(realAlpha).toFilter({ gradientType: 1 }, realHex));
                    }
                    else {
                        alphaSliderInner.css("background", "-webkit-" + gradient);
                        alphaSliderInner.css("background", "-moz-" + gradient);
                        alphaSliderInner.css("background", "-ms-" + gradient);
                        // Use current syntax gradient on unprefixed property.
                        alphaSliderInner.css("background",
                            "linear-gradient(to right, " + realAlpha + ", " + realHex + ")");
                    }
                }

                displayColor = realColor.toString(format);
            }

            // Update the text entry input as it changes happen
            if (opts.showInput) {
                textInput.val(displayColor);
            }

            if (opts.showPalette) {
                drawPalette();
            }

            drawInitial();
        }

        function updateHelperLocations() {
            var s = currentSaturation;
            var v = currentValue;

            if(allowEmpty && isEmpty) {
                //if selected color is empty, hide the helpers
                alphaSlideHelper.hide();
                slideHelper.hide();
                dragHelper.hide();
            }
            else {
                //make sure helpers are visible
                alphaSlideHelper.show();
                slideHelper.show();
                dragHelper.show();

                // Where to show the little circle in that displays your current selected color
                var dragX = s * dragWidth;
                var dragY = dragHeight - (v * dragHeight);
                dragX = Math.max(
                    -dragHelperHeight,
                    Math.min(dragWidth - dragHelperHeight, dragX - dragHelperHeight)
                );
                dragY = Math.max(
                    -dragHelperHeight,
                    Math.min(dragHeight - dragHelperHeight, dragY - dragHelperHeight)
                );
                dragHelper.css({
                    "top": dragY + "px",
                    "left": dragX + "px"
                });

                var alphaX = currentAlpha * alphaWidth;
                alphaSlideHelper.css({
                    "left": (alphaX - (alphaSlideHelperWidth / 2)) + "px"
                });

                // Where to show the bar that displays your current selected hue
                var slideY = (currentHue) * slideHeight;
                slideHelper.css({
                    "top": (slideY - slideHelperHeight) + "px"
                });
            }
        }

        function updateOriginalInput(fireCallback) {
            var color = get(),
                displayColor = '',
                hasChanged = !tinycolor.equals(color, colorOnShow);

            if (color) {
                displayColor = color.toString(currentPreferredFormat);
                // Update the selection palette with the current color
                addColorToSelectionPalette(color);
            }

            if (isInput) {
                boundElement.val(displayColor);
            }

            if (fireCallback && hasChanged) {
                callbacks.change(color);
                boundElement.trigger('change', [ color ]);
            }
        }

        function reflow() {
            if (!visible) {
                return; // Calculations would be useless and wouldn't be reliable anyways
            }
            dragWidth = dragger.width();
            dragHeight = dragger.height();
            dragHelperHeight = dragHelper.height();
            slideWidth = slider.width();
            slideHeight = slider.height();
            slideHelperHeight = slideHelper.height();
            alphaWidth = alphaSlider.width();
            alphaSlideHelperWidth = alphaSlideHelper.width();

            if (!flat) {
                container.css("position", "absolute");
                if (opts.offset) {
                    container.offset(opts.offset);
                } else {
                    container.offset(getOffset(container, offsetElement));
                }
            }

            updateHelperLocations();

            if (opts.showPalette) {
                drawPalette();
            }

            boundElement.trigger('reflow.spectrum');
        }

        function destroy() {
            boundElement.show();
            offsetElement.unbind("click.spectrum touchstart.spectrum");
            container.remove();
            replacer.remove();
            spectrums[spect.id] = null;
        }

        function option(optionName, optionValue) {
            if (optionName === undefined) {
                return $.extend({}, opts);
            }
            if (optionValue === undefined) {
                return opts[optionName];
            }

            opts[optionName] = optionValue;

            if (optionName === "preferredFormat") {
                currentPreferredFormat = opts.preferredFormat;
            }
            applyOptions();
        }

        function enable() {
            disabled = false;
            boundElement.attr("disabled", false);
            offsetElement.removeClass("sp-disabled");
        }

        function disable() {
            hide();
            disabled = true;
            boundElement.attr("disabled", true);
            offsetElement.addClass("sp-disabled");
        }

        function setOffset(coord) {
            opts.offset = coord;
            reflow();
        }

        initialize();

        var spect = {
            show: show,
            hide: hide,
            toggle: toggle,
            reflow: reflow,
            option: option,
            enable: enable,
            disable: disable,
            offset: setOffset,
            set: function (c) {
                set(c);
                updateOriginalInput();
            },
            get: get,
            destroy: destroy,
            container: container
        };

        spect.id = spectrums.push(spect) - 1;

        return spect;
    }

    /**
    * checkOffset - get the offset below/above and left/right element depending on screen position
    * Thanks https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.datepicker.js
    */
    function getOffset(picker, input) {
        var extraY = 0;
        var dpWidth = picker.outerWidth();
        var dpHeight = picker.outerHeight();
        var inputHeight = input.outerHeight();
        var doc = picker[0].ownerDocument;
        var docElem = doc.documentElement;
        var viewWidth = docElem.clientWidth + $(doc).scrollLeft();
        var viewHeight = docElem.clientHeight + $(doc).scrollTop();
        var offset = input.offset();
        offset.top += inputHeight;

        offset.left -=
            Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
            Math.abs(offset.left + dpWidth - viewWidth) : 0);

        offset.top -=
            Math.min(offset.top, ((offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
            Math.abs(dpHeight + inputHeight - extraY) : extraY));

        return offset;
    }

    /**
    * noop - do nothing
    */
    function noop() {

    }

    /**
    * stopPropagation - makes the code only doing this a little easier to read in line
    */
    function stopPropagation(e) {
        e.stopPropagation();
    }

    /**
    * Create a function bound to a given object
    * Thanks to underscore.js
    */
    function bind(func, obj) {
        var slice = Array.prototype.slice;
        var args = slice.call(arguments, 2);
        return function () {
            return func.apply(obj, args.concat(slice.call(arguments)));
        };
    }

    /**
    * Lightweight drag helper.  Handles containment within the element, so that
    * when dragging, the x is within [0,element.width] and y is within [0,element.height]
    */
    function draggable(element, onmove, onstart, onstop) {
        onmove = onmove || function () { };
        onstart = onstart || function () { };
        onstop = onstop || function () { };
        var doc = document;
        var dragging = false;
        var offset = {};
        var maxHeight = 0;
        var maxWidth = 0;
        var hasTouch = ('ontouchstart' in window);

        var duringDragEvents = {};
        duringDragEvents["selectstart"] = prevent;
        duringDragEvents["dragstart"] = prevent;
        duringDragEvents["touchmove mousemove"] = move;
        duringDragEvents["touchend mouseup"] = stop;

        function prevent(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.returnValue = false;
        }

        function move(e) {
            if (dragging) {
                // Mouseup happened outside of window
                if (IE && doc.documentMode < 9 && !e.button) {
                    return stop();
                }

                var t0 = e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0];
                var pageX = t0 && t0.pageX || e.pageX;
                var pageY = t0 && t0.pageY || e.pageY;

                var dragX = Math.max(0, Math.min(pageX - offset.left, maxWidth));
                var dragY = Math.max(0, Math.min(pageY - offset.top, maxHeight));

                if (hasTouch) {
                    // Stop scrolling in iOS
                    prevent(e);
                }

                onmove.apply(element, [dragX, dragY, e]);
            }
        }

        function start(e) {
            var rightclick = (e.which) ? (e.which == 3) : (e.button == 2);

            if (!rightclick && !dragging) {
                if (onstart.apply(element, arguments) !== false) {
                    dragging = true;
                    maxHeight = $(element).height();
                    maxWidth = $(element).width();
                    offset = $(element).offset();

                    $(doc).bind(duringDragEvents);
                    $(doc.body).addClass("sp-dragging");

                    move(e);

                    prevent(e);
                }
            }
        }

        function stop() {
            if (dragging) {
                $(doc).unbind(duringDragEvents);
                $(doc.body).removeClass("sp-dragging");

                // Wait a tick before notifying observers to allow the click event
                // to fire in Chrome.
                setTimeout(function() {
                    onstop.apply(element, arguments);
                }, 0);
            }
            dragging = false;
        }

        $(element).bind("touchstart mousedown", start);
    }

    function throttle(func, wait, debounce) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var throttler = function () {
                timeout = null;
                func.apply(context, args);
            };
            if (debounce) clearTimeout(timeout);
            if (debounce || !timeout) timeout = setTimeout(throttler, wait);
        };
    }

    function inputTypeColorSupport() {
        return $.fn.spectrum.inputTypeColorSupport();
    }

    /**
    * Define a jQuery plugin
    */
    var dataID = "spectrum.id";
    $.fn.spectrum = function (opts, extra) {

        if (typeof opts == "string") {

            var returnValue = this;
            var args = Array.prototype.slice.call( arguments, 1 );

            this.each(function () {
                var spect = spectrums[$(this).data(dataID)];
                if (spect) {
                    var method = spect[opts];
                    if (!method) {
                        throw new Error( "Spectrum: no such method: '" + opts + "'" );
                    }

                    if (opts == "get") {
                        returnValue = spect.get();
                    }
                    else if (opts == "container") {
                        returnValue = spect.container;
                    }
                    else if (opts == "option") {
                        returnValue = spect.option.apply(spect, args);
                    }
                    else if (opts == "destroy") {
                        spect.destroy();
                        $(this).removeData(dataID);
                    }
                    else {
                        method.apply(spect, args);
                    }
                }
            });

            return returnValue;
        }

        // Initializing a new instance of spectrum
        return this.spectrum("destroy").each(function () {
            var options = $.extend({}, opts, $(this).data());
            var spect = spectrum(this, options);
            $(this).data(dataID, spect.id);
        });
    };

    $.fn.spectrum.load = true;
    $.fn.spectrum.loadOpts = {};
    $.fn.spectrum.draggable = draggable;
    $.fn.spectrum.defaults = defaultOpts;
    $.fn.spectrum.inputTypeColorSupport = function inputTypeColorSupport() {
        if (typeof inputTypeColorSupport._cachedResult === "undefined") {
            var colorInput = $("<input type='color'/>")[0]; // if color element is supported, value will default to not null
            inputTypeColorSupport._cachedResult = colorInput.type === "color" && colorInput.value !== "";
        }
        return inputTypeColorSupport._cachedResult;
    };

    $.spectrum = { };
    $.spectrum.localization = { };
    $.spectrum.palettes = { };

    $.fn.spectrum.processNativeColorInputs = function () {
        var colorInputs = $("input[type=color]");
        if (colorInputs.length && !inputTypeColorSupport()) {
            colorInputs.spectrum({
                preferredFormat: "hex6"
            });
        }
    };

    // TinyColor v1.1.2
    // https://github.com/bgrins/TinyColor
    // Brian Grinstead, MIT License

    (function() {

    var trimLeft = /^[\s,#]+/,
        trimRight = /\s+$/,
        tinyCounter = 0,
        math = Math,
        mathRound = math.round,
        mathMin = math.min,
        mathMax = math.max,
        mathRandom = math.random;

    var tinycolor = function(color, opts) {

        color = (color) ? color : '';
        opts = opts || { };

        // If input is already a tinycolor, return itself
        if (color instanceof tinycolor) {
           return color;
        }
        // If we are called as a function, call using new instead
        if (!(this instanceof tinycolor)) {
            return new tinycolor(color, opts);
        }

        var rgb = inputToRGB(color);
        this._originalInput = color,
        this._r = rgb.r,
        this._g = rgb.g,
        this._b = rgb.b,
        this._a = rgb.a,
        this._roundA = mathRound(100*this._a) / 100,
        this._format = opts.format || rgb.format;
        this._gradientType = opts.gradientType;

        // Don't let the range of [0,255] come back in [0,1].
        // Potentially lose a little bit of precision here, but will fix issues where
        // .5 gets interpreted as half of the total, instead of half of 1
        // If it was supposed to be 128, this was already taken care of by `inputToRgb`
        if (this._r < 1) { this._r = mathRound(this._r); }
        if (this._g < 1) { this._g = mathRound(this._g); }
        if (this._b < 1) { this._b = mathRound(this._b); }

        this._ok = rgb.ok;
        this._tc_id = tinyCounter++;
    };

    tinycolor.prototype = {
        isDark: function() {
            return this.getBrightness() < 128;
        },
        isLight: function() {
            return !this.isDark();
        },
        isValid: function() {
            return this._ok;
        },
        getOriginalInput: function() {
          return this._originalInput;
        },
        getFormat: function() {
            return this._format;
        },
        getAlpha: function() {
            return this._a;
        },
        getBrightness: function() {
            var rgb = this.toRgb();
            return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        },
        setAlpha: function(value) {
            this._a = boundAlpha(value);
            this._roundA = mathRound(100*this._a) / 100;
            return this;
        },
        toHsv: function() {
            var hsv = rgbToHsv(this._r, this._g, this._b);
            return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
        },
        toHsvString: function() {
            var hsv = rgbToHsv(this._r, this._g, this._b);
            var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
            return (this._a == 1) ?
              "hsv("  + h + ", " + s + "%, " + v + "%)" :
              "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
        },
        toHsl: function() {
            var hsl = rgbToHsl(this._r, this._g, this._b);
            return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
        },
        toHslString: function() {
            var hsl = rgbToHsl(this._r, this._g, this._b);
            var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
            return (this._a == 1) ?
              "hsl("  + h + ", " + s + "%, " + l + "%)" :
              "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")";
        },
        toHex: function(allow3Char) {
            return rgbToHex(this._r, this._g, this._b, allow3Char);
        },
        toHexString: function(allow3Char) {
            return '#' + this.toHex(allow3Char);
        },
        toHex8: function() {
            return rgbaToHex(this._r, this._g, this._b, this._a);
        },
        toHex8String: function() {
            return '#' + this.toHex8();
        },
        toRgb: function() {
            return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };
        },
        toRgbString: function() {
            return (this._a == 1) ?
              "rgb("  + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" :
              "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
        },
        toPercentageRgb: function() {
            return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };
        },
        toPercentageRgbString: function() {
            return (this._a == 1) ?
              "rgb("  + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" :
              "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
        },
        toName: function() {
            if (this._a === 0) {
                return "transparent";
            }

            if (this._a < 1) {
                return false;
            }

            return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
        },
        toFilter: function(secondColor) {
            var hex8String = '#' + rgbaToHex(this._r, this._g, this._b, this._a);
            var secondHex8String = hex8String;
            var gradientType = this._gradientType ? "GradientType = 1, " : "";

            if (secondColor) {
                var s = tinycolor(secondColor);
                secondHex8String = s.toHex8String();
            }

            return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")";
        },
        toString: function(format) {
            var formatSet = !!format;
            format = format || this._format;

            var formattedString = false;
            var hasAlpha = this._a < 1 && this._a >= 0;
            var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "name");

            if (needsAlphaFormat) {
                // Special case for "transparent", all other non-alpha formats
                // will return rgba when there is transparency.
                if (format === "name" && this._a === 0) {
                    return this.toName();
                }
                return this.toRgbString();
            }
            if (format === "rgb") {
                formattedString = this.toRgbString();
            }
            if (format === "prgb") {
                formattedString = this.toPercentageRgbString();
            }
            if (format === "hex" || format === "hex6") {
                formattedString = this.toHexString();
            }
            if (format === "hex3") {
                formattedString = this.toHexString(true);
            }
            if (format === "hex8") {
                formattedString = this.toHex8String();
            }
            if (format === "name") {
                formattedString = this.toName();
            }
            if (format === "hsl") {
                formattedString = this.toHslString();
            }
            if (format === "hsv") {
                formattedString = this.toHsvString();
            }

            return formattedString || this.toHexString();
        },

        _applyModification: function(fn, args) {
            var color = fn.apply(null, [this].concat([].slice.call(args)));
            this._r = color._r;
            this._g = color._g;
            this._b = color._b;
            this.setAlpha(color._a);
            return this;
        },
        lighten: function() {
            return this._applyModification(lighten, arguments);
        },
        brighten: function() {
            return this._applyModification(brighten, arguments);
        },
        darken: function() {
            return this._applyModification(darken, arguments);
        },
        desaturate: function() {
            return this._applyModification(desaturate, arguments);
        },
        saturate: function() {
            return this._applyModification(saturate, arguments);
        },
        greyscale: function() {
            return this._applyModification(greyscale, arguments);
        },
        spin: function() {
            return this._applyModification(spin, arguments);
        },

        _applyCombination: function(fn, args) {
            return fn.apply(null, [this].concat([].slice.call(args)));
        },
        analogous: function() {
            return this._applyCombination(analogous, arguments);
        },
        complement: function() {
            return this._applyCombination(complement, arguments);
        },
        monochromatic: function() {
            return this._applyCombination(monochromatic, arguments);
        },
        splitcomplement: function() {
            return this._applyCombination(splitcomplement, arguments);
        },
        triad: function() {
            return this._applyCombination(triad, arguments);
        },
        tetrad: function() {
            return this._applyCombination(tetrad, arguments);
        }
    };

    // If input is an object, force 1 into "1.0" to handle ratios properly
    // String input requires "1.0" as input, so 1 will be treated as 1
    tinycolor.fromRatio = function(color, opts) {
        if (typeof color == "object") {
            var newColor = {};
            for (var i in color) {
                if (color.hasOwnProperty(i)) {
                    if (i === "a") {
                        newColor[i] = color[i];
                    }
                    else {
                        newColor[i] = convertToPercentage(color[i]);
                    }
                }
            }
            color = newColor;
        }

        return tinycolor(color, opts);
    };

    // Given a string or object, convert that input to RGB
    // Possible string inputs:
    //
    //     "red"
    //     "#f00" or "f00"
    //     "#ff0000" or "ff0000"
    //     "#ff000000" or "ff000000"
    //     "rgb 255 0 0" or "rgb (255, 0, 0)"
    //     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
    //     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
    //     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
    //     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
    //     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
    //     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
    //
    function inputToRGB(color) {

        var rgb = { r: 0, g: 0, b: 0 };
        var a = 1;
        var ok = false;
        var format = false;

        if (typeof color == "string") {
            color = stringInputToObject(color);
        }

        if (typeof color == "object") {
            if (color.hasOwnProperty("r") && color.hasOwnProperty("g") && color.hasOwnProperty("b")) {
                rgb = rgbToRgb(color.r, color.g, color.b);
                ok = true;
                format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
            }
            else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("v")) {
                color.s = convertToPercentage(color.s);
                color.v = convertToPercentage(color.v);
                rgb = hsvToRgb(color.h, color.s, color.v);
                ok = true;
                format = "hsv";
            }
            else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("l")) {
                color.s = convertToPercentage(color.s);
                color.l = convertToPercentage(color.l);
                rgb = hslToRgb(color.h, color.s, color.l);
                ok = true;
                format = "hsl";
            }

            if (color.hasOwnProperty("a")) {
                a = color.a;
            }
        }

        a = boundAlpha(a);

        return {
            ok: ok,
            format: color.format || format,
            r: mathMin(255, mathMax(rgb.r, 0)),
            g: mathMin(255, mathMax(rgb.g, 0)),
            b: mathMin(255, mathMax(rgb.b, 0)),
            a: a
        };
    }


    // Conversion Functions
    // --------------------

    // `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
    // <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

    // `rgbToRgb`
    // Handle bounds / percentage checking to conform to CSS color spec
    // <http://www.w3.org/TR/css3-color/>
    // *Assumes:* r, g, b in [0, 255] or [0, 1]
    // *Returns:* { r, g, b } in [0, 255]
    function rgbToRgb(r, g, b){
        return {
            r: bound01(r, 255) * 255,
            g: bound01(g, 255) * 255,
            b: bound01(b, 255) * 255
        };
    }

    // `rgbToHsl`
    // Converts an RGB color value to HSL.
    // *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
    // *Returns:* { h, s, l } in [0,1]
    function rgbToHsl(r, g, b) {

        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);

        var max = mathMax(r, g, b), min = mathMin(r, g, b);
        var h, s, l = (max + min) / 2;

        if(max == min) {
            h = s = 0; // achromatic
        }
        else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return { h: h, s: s, l: l };
    }

    // `hslToRgb`
    // Converts an HSL color value to RGB.
    // *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
    // *Returns:* { r, g, b } in the set [0, 255]
    function hslToRgb(h, s, l) {
        var r, g, b;

        h = bound01(h, 360);
        s = bound01(s, 100);
        l = bound01(l, 100);

        function hue2rgb(p, q, t) {
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        if(s === 0) {
            r = g = b = l; // achromatic
        }
        else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return { r: r * 255, g: g * 255, b: b * 255 };
    }

    // `rgbToHsv`
    // Converts an RGB color value to HSV
    // *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
    // *Returns:* { h, s, v } in [0,1]
    function rgbToHsv(r, g, b) {

        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);

        var max = mathMax(r, g, b), min = mathMin(r, g, b);
        var h, s, v = max;

        var d = max - min;
        s = max === 0 ? 0 : d / max;

        if(max == min) {
            h = 0; // achromatic
        }
        else {
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: h, s: s, v: v };
    }

    // `hsvToRgb`
    // Converts an HSV color value to RGB.
    // *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
    // *Returns:* { r, g, b } in the set [0, 255]
     function hsvToRgb(h, s, v) {

        h = bound01(h, 360) * 6;
        s = bound01(s, 100);
        v = bound01(v, 100);

        var i = math.floor(h),
            f = h - i,
            p = v * (1 - s),
            q = v * (1 - f * s),
            t = v * (1 - (1 - f) * s),
            mod = i % 6,
            r = [v, q, p, p, t, v][mod],
            g = [t, v, v, q, p, p][mod],
            b = [p, p, t, v, v, q][mod];

        return { r: r * 255, g: g * 255, b: b * 255 };
    }

    // `rgbToHex`
    // Converts an RGB color to hex
    // Assumes r, g, and b are contained in the set [0, 255]
    // Returns a 3 or 6 character hex
    function rgbToHex(r, g, b, allow3Char) {

        var hex = [
            pad2(mathRound(r).toString(16)),
            pad2(mathRound(g).toString(16)),
            pad2(mathRound(b).toString(16))
        ];

        // Return a 3 character hex if possible
        if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
            return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
        }

        return hex.join("");
    }
        // `rgbaToHex`
        // Converts an RGBA color plus alpha transparency to hex
        // Assumes r, g, b and a are contained in the set [0, 255]
        // Returns an 8 character hex
        function rgbaToHex(r, g, b, a) {

            var hex = [
                pad2(convertDecimalToHex(a)),
                pad2(mathRound(r).toString(16)),
                pad2(mathRound(g).toString(16)),
                pad2(mathRound(b).toString(16))
            ];

            return hex.join("");
        }

    // `equals`
    // Can be called with any tinycolor input
    tinycolor.equals = function (color1, color2) {
        if (!color1 || !color2) { return false; }
        return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
    };
    tinycolor.random = function() {
        return tinycolor.fromRatio({
            r: mathRandom(),
            g: mathRandom(),
            b: mathRandom()
        });
    };


    // Modification Functions
    // ----------------------
    // Thanks to less.js for some of the basics here
    // <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

    function desaturate(color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.s -= amount / 100;
        hsl.s = clamp01(hsl.s);
        return tinycolor(hsl);
    }

    function saturate(color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.s += amount / 100;
        hsl.s = clamp01(hsl.s);
        return tinycolor(hsl);
    }

    function greyscale(color) {
        return tinycolor(color).desaturate(100);
    }

    function lighten (color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.l += amount / 100;
        hsl.l = clamp01(hsl.l);
        return tinycolor(hsl);
    }

    function brighten(color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var rgb = tinycolor(color).toRgb();
        rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * - (amount / 100))));
        rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * - (amount / 100))));
        rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * - (amount / 100))));
        return tinycolor(rgb);
    }

    function darken (color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.l -= amount / 100;
        hsl.l = clamp01(hsl.l);
        return tinycolor(hsl);
    }

    // Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
    // Values outside of this range will be wrapped into this range.
    function spin(color, amount) {
        var hsl = tinycolor(color).toHsl();
        var hue = (mathRound(hsl.h) + amount) % 360;
        hsl.h = hue < 0 ? 360 + hue : hue;
        return tinycolor(hsl);
    }

    // Combination Functions
    // ---------------------
    // Thanks to jQuery xColor for some of the ideas behind these
    // <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

    function complement(color) {
        var hsl = tinycolor(color).toHsl();
        hsl.h = (hsl.h + 180) % 360;
        return tinycolor(hsl);
    }

    function triad(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [
            tinycolor(color),
            tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
            tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
        ];
    }

    function tetrad(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [
            tinycolor(color),
            tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
            tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
            tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
        ];
    }

    function splitcomplement(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [
            tinycolor(color),
            tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
            tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
        ];
    }

    function analogous(color, results, slices) {
        results = results || 6;
        slices = slices || 30;

        var hsl = tinycolor(color).toHsl();
        var part = 360 / slices;
        var ret = [tinycolor(color)];

        for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
            hsl.h = (hsl.h + part) % 360;
            ret.push(tinycolor(hsl));
        }
        return ret;
    }

    function monochromatic(color, results) {
        results = results || 6;
        var hsv = tinycolor(color).toHsv();
        var h = hsv.h, s = hsv.s, v = hsv.v;
        var ret = [];
        var modification = 1 / results;

        while (results--) {
            ret.push(tinycolor({ h: h, s: s, v: v}));
            v = (v + modification) % 1;
        }

        return ret;
    }

    // Utility Functions
    // ---------------------

    tinycolor.mix = function(color1, color2, amount) {
        amount = (amount === 0) ? 0 : (amount || 50);

        var rgb1 = tinycolor(color1).toRgb();
        var rgb2 = tinycolor(color2).toRgb();

        var p = amount / 100;
        var w = p * 2 - 1;
        var a = rgb2.a - rgb1.a;

        var w1;

        if (w * a == -1) {
            w1 = w;
        } else {
            w1 = (w + a) / (1 + w * a);
        }

        w1 = (w1 + 1) / 2;

        var w2 = 1 - w1;

        var rgba = {
            r: rgb2.r * w1 + rgb1.r * w2,
            g: rgb2.g * w1 + rgb1.g * w2,
            b: rgb2.b * w1 + rgb1.b * w2,
            a: rgb2.a * p  + rgb1.a * (1 - p)
        };

        return tinycolor(rgba);
    };


    // Readability Functions
    // ---------------------
    // <http://www.w3.org/TR/AERT#color-contrast>

    // `readability`
    // Analyze the 2 colors and returns an object with the following properties:
    //    `brightness`: difference in brightness between the two colors
    //    `color`: difference in color/hue between the two colors
    tinycolor.readability = function(color1, color2) {
        var c1 = tinycolor(color1);
        var c2 = tinycolor(color2);
        var rgb1 = c1.toRgb();
        var rgb2 = c2.toRgb();
        var brightnessA = c1.getBrightness();
        var brightnessB = c2.getBrightness();
        var colorDiff = (
            Math.max(rgb1.r, rgb2.r) - Math.min(rgb1.r, rgb2.r) +
            Math.max(rgb1.g, rgb2.g) - Math.min(rgb1.g, rgb2.g) +
            Math.max(rgb1.b, rgb2.b) - Math.min(rgb1.b, rgb2.b)
        );

        return {
            brightness: Math.abs(brightnessA - brightnessB),
            color: colorDiff
        };
    };

    // `readable`
    // http://www.w3.org/TR/AERT#color-contrast
    // Ensure that foreground and background color combinations provide sufficient contrast.
    // *Example*
    //    tinycolor.isReadable("#000", "#111") => false
    tinycolor.isReadable = function(color1, color2) {
        var readability = tinycolor.readability(color1, color2);
        return readability.brightness > 125 && readability.color > 500;
    };

    // `mostReadable`
    // Given a base color and a list of possible foreground or background
    // colors for that base, returns the most readable color.
    // *Example*
    //    tinycolor.mostReadable("#123", ["#fff", "#000"]) => "#000"
    tinycolor.mostReadable = function(baseColor, colorList) {
        var bestColor = null;
        var bestScore = 0;
        var bestIsReadable = false;
        for (var i=0; i < colorList.length; i++) {

            // We normalize both around the "acceptable" breaking point,
            // but rank brightness constrast higher than hue.

            var readability = tinycolor.readability(baseColor, colorList[i]);
            var readable = readability.brightness > 125 && readability.color > 500;
            var score = 3 * (readability.brightness / 125) + (readability.color / 500);

            if ((readable && ! bestIsReadable) ||
                (readable && bestIsReadable && score > bestScore) ||
                ((! readable) && (! bestIsReadable) && score > bestScore)) {
                bestIsReadable = readable;
                bestScore = score;
                bestColor = tinycolor(colorList[i]);
            }
        }
        return bestColor;
    };


    // Big List of Colors
    // ------------------
    // <http://www.w3.org/TR/css3-color/#svg-color>
    var names = tinycolor.names = {
        aliceblue: "f0f8ff",
        antiquewhite: "faebd7",
        aqua: "0ff",
        aquamarine: "7fffd4",
        azure: "f0ffff",
        beige: "f5f5dc",
        bisque: "ffe4c4",
        black: "000",
        blanchedalmond: "ffebcd",
        blue: "00f",
        blueviolet: "8a2be2",
        brown: "a52a2a",
        burlywood: "deb887",
        burntsienna: "ea7e5d",
        cadetblue: "5f9ea0",
        chartreuse: "7fff00",
        chocolate: "d2691e",
        coral: "ff7f50",
        cornflowerblue: "6495ed",
        cornsilk: "fff8dc",
        crimson: "dc143c",
        cyan: "0ff",
        darkblue: "00008b",
        darkcyan: "008b8b",
        darkgoldenrod: "b8860b",
        darkgray: "a9a9a9",
        darkgreen: "006400",
        darkgrey: "a9a9a9",
        darkkhaki: "bdb76b",
        darkmagenta: "8b008b",
        darkolivegreen: "556b2f",
        darkorange: "ff8c00",
        darkorchid: "9932cc",
        darkred: "8b0000",
        darksalmon: "e9967a",
        darkseagreen: "8fbc8f",
        darkslateblue: "483d8b",
        darkslategray: "2f4f4f",
        darkslategrey: "2f4f4f",
        darkturquoise: "00ced1",
        darkviolet: "9400d3",
        deeppink: "ff1493",
        deepskyblue: "00bfff",
        dimgray: "696969",
        dimgrey: "696969",
        dodgerblue: "1e90ff",
        firebrick: "b22222",
        floralwhite: "fffaf0",
        forestgreen: "228b22",
        fuchsia: "f0f",
        gainsboro: "dcdcdc",
        ghostwhite: "f8f8ff",
        gold: "ffd700",
        goldenrod: "daa520",
        gray: "808080",
        green: "008000",
        greenyellow: "adff2f",
        grey: "808080",
        honeydew: "f0fff0",
        hotpink: "ff69b4",
        indianred: "cd5c5c",
        indigo: "4b0082",
        ivory: "fffff0",
        khaki: "f0e68c",
        lavender: "e6e6fa",
        lavenderblush: "fff0f5",
        lawngreen: "7cfc00",
        lemonchiffon: "fffacd",
        lightblue: "add8e6",
        lightcoral: "f08080",
        lightcyan: "e0ffff",
        lightgoldenrodyellow: "fafad2",
        lightgray: "d3d3d3",
        lightgreen: "90ee90",
        lightgrey: "d3d3d3",
        lightpink: "ffb6c1",
        lightsalmon: "ffa07a",
        lightseagreen: "20b2aa",
        lightskyblue: "87cefa",
        lightslategray: "789",
        lightslategrey: "789",
        lightsteelblue: "b0c4de",
        lightyellow: "ffffe0",
        lime: "0f0",
        limegreen: "32cd32",
        linen: "faf0e6",
        magenta: "f0f",
        maroon: "800000",
        mediumaquamarine: "66cdaa",
        mediumblue: "0000cd",
        mediumorchid: "ba55d3",
        mediumpurple: "9370db",
        mediumseagreen: "3cb371",
        mediumslateblue: "7b68ee",
        mediumspringgreen: "00fa9a",
        mediumturquoise: "48d1cc",
        mediumvioletred: "c71585",
        midnightblue: "191970",
        mintcream: "f5fffa",
        mistyrose: "ffe4e1",
        moccasin: "ffe4b5",
        navajowhite: "ffdead",
        navy: "000080",
        oldlace: "fdf5e6",
        olive: "808000",
        olivedrab: "6b8e23",
        orange: "ffa500",
        orangered: "ff4500",
        orchid: "da70d6",
        palegoldenrod: "eee8aa",
        palegreen: "98fb98",
        paleturquoise: "afeeee",
        palevioletred: "db7093",
        papayawhip: "ffefd5",
        peachpuff: "ffdab9",
        peru: "cd853f",
        pink: "ffc0cb",
        plum: "dda0dd",
        powderblue: "b0e0e6",
        purple: "800080",
        rebeccapurple: "663399",
        red: "f00",
        rosybrown: "bc8f8f",
        royalblue: "4169e1",
        saddlebrown: "8b4513",
        salmon: "fa8072",
        sandybrown: "f4a460",
        seagreen: "2e8b57",
        seashell: "fff5ee",
        sienna: "a0522d",
        silver: "c0c0c0",
        skyblue: "87ceeb",
        slateblue: "6a5acd",
        slategray: "708090",
        slategrey: "708090",
        snow: "fffafa",
        springgreen: "00ff7f",
        steelblue: "4682b4",
        tan: "d2b48c",
        teal: "008080",
        thistle: "d8bfd8",
        tomato: "ff6347",
        turquoise: "40e0d0",
        violet: "ee82ee",
        wheat: "f5deb3",
        white: "fff",
        whitesmoke: "f5f5f5",
        yellow: "ff0",
        yellowgreen: "9acd32"
    };

    // Make it easy to access colors via `hexNames[hex]`
    var hexNames = tinycolor.hexNames = flip(names);


    // Utilities
    // ---------

    // `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
    function flip(o) {
        var flipped = { };
        for (var i in o) {
            if (o.hasOwnProperty(i)) {
                flipped[o[i]] = i;
            }
        }
        return flipped;
    }

    // Return a valid alpha value [0,1] with all invalid values being set to 1
    function boundAlpha(a) {
        a = parseFloat(a);

        if (isNaN(a) || a < 0 || a > 1) {
            a = 1;
        }

        return a;
    }

    // Take input from [0, n] and return it as [0, 1]
    function bound01(n, max) {
        if (isOnePointZero(n)) { n = "100%"; }

        var processPercent = isPercentage(n);
        n = mathMin(max, mathMax(0, parseFloat(n)));

        // Automatically convert percentage into number
        if (processPercent) {
            n = parseInt(n * max, 10) / 100;
        }

        // Handle floating point rounding errors
        if ((math.abs(n - max) < 0.000001)) {
            return 1;
        }

        // Convert into [0, 1] range if it isn't already
        return (n % max) / parseFloat(max);
    }

    // Force a number between 0 and 1
    function clamp01(val) {
        return mathMin(1, mathMax(0, val));
    }

    // Parse a base-16 hex value into a base-10 integer
    function parseIntFromHex(val) {
        return parseInt(val, 16);
    }

    // Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
    // <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
    function isOnePointZero(n) {
        return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
    }

    // Check to see if string passed in is a percentage
    function isPercentage(n) {
        return typeof n === "string" && n.indexOf('%') != -1;
    }

    // Force a hex value to have 2 characters
    function pad2(c) {
        return c.length == 1 ? '0' + c : '' + c;
    }

    // Replace a decimal with it's percentage value
    function convertToPercentage(n) {
        if (n <= 1) {
            n = (n * 100) + "%";
        }

        return n;
    }

    // Converts a decimal to a hex value
    function convertDecimalToHex(d) {
        return Math.round(parseFloat(d) * 255).toString(16);
    }
    // Converts a hex value to a decimal
    function convertHexToDecimal(h) {
        return (parseIntFromHex(h) / 255);
    }

    var matchers = (function() {

        // <http://www.w3.org/TR/css3-values/#integers>
        var CSS_INTEGER = "[-\\+]?\\d+%?";

        // <http://www.w3.org/TR/css3-values/#number-value>
        var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

        // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
        var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

        // Actual matching.
        // Parentheses and commas are optional, but not required.
        // Whitespace can take the place of commas or opening paren
        var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
        var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

        return {
            rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
            rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
            hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
            hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
            hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
            hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
            hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
            hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
            hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
        };
    })();

    // `stringInputToObject`
    // Permissive string parsing.  Take in a number of formats, and output an object
    // based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
    function stringInputToObject(color) {

        color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
        var named = false;
        if (names[color]) {
            color = names[color];
            named = true;
        }
        else if (color == 'transparent') {
            return { r: 0, g: 0, b: 0, a: 0, format: "name" };
        }

        // Try to match string input using regular expressions.
        // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
        // Just return an object and let the conversion functions handle that.
        // This way the result will be the same whether the tinycolor is initialized with string or object.
        var match;
        if ((match = matchers.rgb.exec(color))) {
            return { r: match[1], g: match[2], b: match[3] };
        }
        if ((match = matchers.rgba.exec(color))) {
            return { r: match[1], g: match[2], b: match[3], a: match[4] };
        }
        if ((match = matchers.hsl.exec(color))) {
            return { h: match[1], s: match[2], l: match[3] };
        }
        if ((match = matchers.hsla.exec(color))) {
            return { h: match[1], s: match[2], l: match[3], a: match[4] };
        }
        if ((match = matchers.hsv.exec(color))) {
            return { h: match[1], s: match[2], v: match[3] };
        }
        if ((match = matchers.hsva.exec(color))) {
            return { h: match[1], s: match[2], v: match[3], a: match[4] };
        }
        if ((match = matchers.hex8.exec(color))) {
            return {
                a: convertHexToDecimal(match[1]),
                r: parseIntFromHex(match[2]),
                g: parseIntFromHex(match[3]),
                b: parseIntFromHex(match[4]),
                format: named ? "name" : "hex8"
            };
        }
        if ((match = matchers.hex6.exec(color))) {
            return {
                r: parseIntFromHex(match[1]),
                g: parseIntFromHex(match[2]),
                b: parseIntFromHex(match[3]),
                format: named ? "name" : "hex"
            };
        }
        if ((match = matchers.hex3.exec(color))) {
            return {
                r: parseIntFromHex(match[1] + '' + match[1]),
                g: parseIntFromHex(match[2] + '' + match[2]),
                b: parseIntFromHex(match[3] + '' + match[3]),
                format: named ? "name" : "hex"
            };
        }

        return false;
    }

    window.tinycolor = tinycolor;
    })();

    $(function () {
        if ($.fn.spectrum.load) {
            $.fn.spectrum.processNativeColorInputs();
        }
    });

});

/**!
 * Sortable
 * @author	RubaXa   <trash@rubaxa.org>
 * @license MIT
 */


(function (factory) {
	"use strict";

	if (typeof define === "function" && define.amd) {
		define(factory);
	}
	else if (typeof module != "undefined" && typeof module.exports != "undefined") {
		module.exports = factory();
	}
	else if (typeof Package !== "undefined") {
		Sortable = factory();  // export for Meteor.js
	}
	else {
		/* jshint sub:true */
		window["Sortable"] = factory();
	}
})(function () {
	"use strict";
	
	if (typeof window == "undefined" || typeof window.document == "undefined") {
		return function() {
			throw new Error( "Sortable.js requires a window with a document" );
		}
	}

	var dragEl,
		parentEl,
		ghostEl,
		cloneEl,
		rootEl,
		nextEl,

		scrollEl,
		scrollParentEl,

		lastEl,
		lastCSS,
		lastParentCSS,

		oldIndex,
		newIndex,

		activeGroup,
		autoScroll = {},

		tapEvt,
		touchEvt,

		moved,

		/** @const */
		RSPACE = /\s+/g,

		expando = 'Sortable' + (new Date).getTime(),

		win = window,
		document = win.document,
		parseInt = win.parseInt,

		supportDraggable = !!('draggable' in document.createElement('div')),
		supportCssPointerEvents = (function (el) {
			el = document.createElement('x');
			el.style.cssText = 'pointer-events:auto';
			return el.style.pointerEvents === 'auto';
		})(),

		_silent = false,

		abs = Math.abs,
		slice = [].slice,

		touchDragOverListeners = [],

		_autoScroll = _throttle(function (/**Event*/evt, /**Object*/options, /**HTMLElement*/rootEl) {
			// Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
			if (rootEl && options.scroll) {
				var el,
					rect,
					sens = options.scrollSensitivity,
					speed = options.scrollSpeed,

					x = evt.clientX,
					y = evt.clientY,

					winWidth = window.innerWidth,
					winHeight = window.innerHeight,

					vx,
					vy
				;

				// Delect scrollEl
				if (scrollParentEl !== rootEl) {
					scrollEl = options.scroll;
					scrollParentEl = rootEl;

					if (scrollEl === true) {
						scrollEl = rootEl;

						do {
							if ((scrollEl.offsetWidth < scrollEl.scrollWidth) ||
								(scrollEl.offsetHeight < scrollEl.scrollHeight)
							) {
								break;
							}
							/* jshint boss:true */
						} while (scrollEl = scrollEl.parentNode);
					}
				}

				if (scrollEl) {
					el = scrollEl;
					rect = scrollEl.getBoundingClientRect();
					vx = (abs(rect.right - x) <= sens) - (abs(rect.left - x) <= sens);
					vy = (abs(rect.bottom - y) <= sens) - (abs(rect.top - y) <= sens);
				}


				if (!(vx || vy)) {
					vx = (winWidth - x <= sens) - (x <= sens);
					vy = (winHeight - y <= sens) - (y <= sens);

					/* jshint expr:true */
					(vx || vy) && (el = win);
				}


				if (autoScroll.vx !== vx || autoScroll.vy !== vy || autoScroll.el !== el) {
					autoScroll.el = el;
					autoScroll.vx = vx;
					autoScroll.vy = vy;

					clearInterval(autoScroll.pid);

					if (el) {
						autoScroll.pid = setInterval(function () {
							if (el === win) {
								win.scrollTo(win.pageXOffset + vx * speed, win.pageYOffset + vy * speed);
							} else {
								vy && (el.scrollTop += vy * speed);
								vx && (el.scrollLeft += vx * speed);
							}
						}, 24);
					}
				}
			}
		}, 30),

		_prepareGroup = function (options) {
			var group = options.group;

			if (!group || typeof group != 'object') {
				group = options.group = {name: group};
			}

			['pull', 'put'].forEach(function (key) {
				if (!(key in group)) {
					group[key] = true;
				}
			});

			options.groups = ' ' + group.name + (group.put.join ? ' ' + group.put.join(' ') : '') + ' ';
		}
	;



	/**
	 * @class  Sortable
	 * @param  {HTMLElement}  el
	 * @param  {Object}       [options]
	 */
	function Sortable(el, options) {
		if (!(el && el.nodeType && el.nodeType === 1)) {
			throw 'Sortable: `el` must be HTMLElement, and not ' + {}.toString.call(el);
		}

		this.el = el; // root element
		this.options = options = _extend({}, options);


		// Export instance
		el[expando] = this;


		// Default options
		var defaults = {
			group: Math.random(),
			sort: true,
			disabled: false,
			store: null,
			handle: null,
			scroll: true,
			scrollSensitivity: 30,
			scrollSpeed: 10,
			draggable: /[uo]l/i.test(el.nodeName) ? 'li' : '>*',
			ghostClass: 'sortable-ghost',
			chosenClass: 'sortable-chosen',
			ignore: 'a, img',
			filter: null,
			animation: 0,
			setData: function (dataTransfer, dragEl) {
				dataTransfer.setData('Text', dragEl.textContent);
			},
			dropBubble: false,
			dragoverBubble: false,
			dataIdAttr: 'data-id',
			delay: 0,
			forceFallback: false,
			fallbackClass: 'sortable-fallback',
			fallbackOnBody: false
		};


		// Set default options
		for (var name in defaults) {
			!(name in options) && (options[name] = defaults[name]);
		}

		_prepareGroup(options);

		// Bind all private methods
		for (var fn in this) {
			if (fn.charAt(0) === '_') {
				this[fn] = this[fn].bind(this);
			}
		}

		// Setup drag mode
		this.nativeDraggable = options.forceFallback ? false : supportDraggable;

		// Bind events
		_on(el, 'mousedown', this._onTapStart);
		_on(el, 'touchstart', this._onTapStart);

		if (this.nativeDraggable) {
			_on(el, 'dragover', this);
			_on(el, 'dragenter', this);
		}

		touchDragOverListeners.push(this._onDragOver);

		// Restore sorting
		options.store && this.sort(options.store.get(this));
	}


	Sortable.prototype = /** @lends Sortable.prototype */ {
		constructor: Sortable,

		_onTapStart: function (/** Event|TouchEvent */evt) {
			var _this = this,
				el = this.el,
				options = this.options,
				type = evt.type,
				touch = evt.touches && evt.touches[0],
				target = (touch || evt).target,
				originalTarget = target,
				filter = options.filter;


			if (type === 'mousedown' && evt.button !== 0 || options.disabled) {
				return; // only left button or enabled
			}

			target = _closest(target, options.draggable, el);

			if (!target) {
				return;
			}

			// get the index of the dragged element within its parent
			oldIndex = _index(target, options.draggable);

			// Check filter
			if (typeof filter === 'function') {
				if (filter.call(this, evt, target, this)) {
					_dispatchEvent(_this, originalTarget, 'filter', target, el, oldIndex);
					evt.preventDefault();
					return; // cancel dnd
				}
			}
			else if (filter) {
				filter = filter.split(',').some(function (criteria) {
					criteria = _closest(originalTarget, criteria.trim(), el);

					if (criteria) {
						_dispatchEvent(_this, criteria, 'filter', target, el, oldIndex);
						return true;
					}
				});

				if (filter) {
					evt.preventDefault();
					return; // cancel dnd
				}
			}


			if (options.handle && !_closest(originalTarget, options.handle, el)) {
				return;
			}


			// Prepare `dragstart`
			this._prepareDragStart(evt, touch, target);
		},

		_prepareDragStart: function (/** Event */evt, /** Touch */touch, /** HTMLElement */target) {
			var _this = this,
				el = _this.el,
				options = _this.options,
				ownerDocument = el.ownerDocument,
				dragStartFn;

			if (target && !dragEl && (target.parentNode === el)) {
				tapEvt = evt;

				rootEl = el;
				dragEl = target;
				parentEl = dragEl.parentNode;
				nextEl = dragEl.nextSibling;
				activeGroup = options.group;

				dragStartFn = function () {
					// Delayed drag has been triggered
					// we can re-enable the events: touchmove/mousemove
					_this._disableDelayedDrag();

					// Make the element draggable
					dragEl.draggable = true;

					// Chosen item
					_toggleClass(dragEl, _this.options.chosenClass, true);

					// Bind the events: dragstart/dragend
					_this._triggerDragStart(touch);
				};

				// Disable "draggable"
				options.ignore.split(',').forEach(function (criteria) {
					_find(dragEl, criteria.trim(), _disableDraggable);
				});

				_on(ownerDocument, 'mouseup', _this._onDrop);
				_on(ownerDocument, 'touchend', _this._onDrop);
				_on(ownerDocument, 'touchcancel', _this._onDrop);

				if (options.delay) {
					// If the user moves the pointer or let go the click or touch
					// before the delay has been reached:
					// disable the delayed drag
					_on(ownerDocument, 'mouseup', _this._disableDelayedDrag);
					_on(ownerDocument, 'touchend', _this._disableDelayedDrag);
					_on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
					_on(ownerDocument, 'mousemove', _this._disableDelayedDrag);
					_on(ownerDocument, 'touchmove', _this._disableDelayedDrag);

					_this._dragStartTimer = setTimeout(dragStartFn, options.delay);
				} else {
					dragStartFn();
				}
			}
		},

		_disableDelayedDrag: function () {
			var ownerDocument = this.el.ownerDocument;

			clearTimeout(this._dragStartTimer);
			_off(ownerDocument, 'mouseup', this._disableDelayedDrag);
			_off(ownerDocument, 'touchend', this._disableDelayedDrag);
			_off(ownerDocument, 'touchcancel', this._disableDelayedDrag);
			_off(ownerDocument, 'mousemove', this._disableDelayedDrag);
			_off(ownerDocument, 'touchmove', this._disableDelayedDrag);
		},

		_triggerDragStart: function (/** Touch */touch) {
			if (touch) {
				// Touch device support
				tapEvt = {
					target: dragEl,
					clientX: touch.clientX,
					clientY: touch.clientY
				};

				this._onDragStart(tapEvt, 'touch');
			}
			else if (!this.nativeDraggable) {
				this._onDragStart(tapEvt, true);
			}
			else {
				_on(dragEl, 'dragend', this);
				_on(rootEl, 'dragstart', this._onDragStart);
			}

			try {
				if (document.selection) {
					document.selection.empty();
				} else {
					window.getSelection().removeAllRanges();
				}
			} catch (err) {
			}
		},

		_dragStarted: function () {
			if (rootEl && dragEl) {
				// Apply effect
				_toggleClass(dragEl, this.options.ghostClass, true);

				Sortable.active = this;

				// Drag start event
				_dispatchEvent(this, rootEl, 'start', dragEl, rootEl, oldIndex);
			}
		},

		_emulateDragOver: function () {
			if (touchEvt) {
				if (this._lastX === touchEvt.clientX && this._lastY === touchEvt.clientY) {
					return;
				}

				this._lastX = touchEvt.clientX;
				this._lastY = touchEvt.clientY;

				if (!supportCssPointerEvents) {
					_css(ghostEl, 'display', 'none');
				}

				var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY),
					parent = target,
					groupName = ' ' + this.options.group.name + '',
					i = touchDragOverListeners.length;

				if (parent) {
					do {
						if (parent[expando] && parent[expando].options.groups.indexOf(groupName) > -1) {
							while (i--) {
								touchDragOverListeners[i]({
									clientX: touchEvt.clientX,
									clientY: touchEvt.clientY,
									target: target,
									rootEl: parent
								});
							}

							break;
						}

						target = parent; // store last element
					}
					/* jshint boss:true */
					while (parent = parent.parentNode);
				}

				if (!supportCssPointerEvents) {
					_css(ghostEl, 'display', '');
				}
			}
		},


		_onTouchMove: function (/**TouchEvent*/evt) {
			if (tapEvt) {
				// only set the status to dragging, when we are actually dragging
				if (!Sortable.active) {
					this._dragStarted();
				}

				// as well as creating the ghost element on the document body
				this._appendGhost();

				var touch = evt.touches ? evt.touches[0] : evt,
					dx = touch.clientX - tapEvt.clientX,
					dy = touch.clientY - tapEvt.clientY,
					translate3d = evt.touches ? 'translate3d(' + dx + 'px,' + dy + 'px,0)' : 'translate(' + dx + 'px,' + dy + 'px)';

				moved = true;
				touchEvt = touch;

				_css(ghostEl, 'webkitTransform', translate3d);
				_css(ghostEl, 'mozTransform', translate3d);
				_css(ghostEl, 'msTransform', translate3d);
				_css(ghostEl, 'transform', translate3d);

				evt.preventDefault();
			}
		},

		_appendGhost: function () {
			if (!ghostEl) {
				var rect = dragEl.getBoundingClientRect(),
					css = _css(dragEl),
					options = this.options,
					ghostRect;

				ghostEl = dragEl.cloneNode(true);

				_toggleClass(ghostEl, options.ghostClass, false);
				_toggleClass(ghostEl, options.fallbackClass, true);

				_css(ghostEl, 'top', rect.top - parseInt(css.marginTop, 10));
				_css(ghostEl, 'left', rect.left - parseInt(css.marginLeft, 10));
				_css(ghostEl, 'width', rect.width);
				_css(ghostEl, 'height', rect.height);
				_css(ghostEl, 'opacity', '0.8');
				_css(ghostEl, 'position', 'fixed');
				_css(ghostEl, 'zIndex', '100000');
				_css(ghostEl, 'pointerEvents', 'none');

				options.fallbackOnBody && document.body.appendChild(ghostEl) || rootEl.appendChild(ghostEl);

				// Fixing dimensions.
				ghostRect = ghostEl.getBoundingClientRect();
				_css(ghostEl, 'width', rect.width * 2 - ghostRect.width);
				_css(ghostEl, 'height', rect.height * 2 - ghostRect.height);
			}
		},

		_onDragStart: function (/**Event*/evt, /**boolean*/useFallback) {
			var dataTransfer = evt.dataTransfer,
				options = this.options;

			this._offUpEvents();

			if (activeGroup.pull == 'clone') {
				cloneEl = dragEl.cloneNode(true);
				_css(cloneEl, 'display', 'none');
				rootEl.insertBefore(cloneEl, dragEl);
			}

			if (useFallback) {

				if (useFallback === 'touch') {
					// Bind touch events
					_on(document, 'touchmove', this._onTouchMove);
					_on(document, 'touchend', this._onDrop);
					_on(document, 'touchcancel', this._onDrop);
				} else {
					// Old brwoser
					_on(document, 'mousemove', this._onTouchMove);
					_on(document, 'mouseup', this._onDrop);
				}

				this._loopId = setInterval(this._emulateDragOver, 50);
			}
			else {
				if (dataTransfer) {
					dataTransfer.effectAllowed = 'move';
					options.setData && options.setData.call(this, dataTransfer, dragEl);
				}

				_on(document, 'drop', this);
				setTimeout(this._dragStarted, 0);
			}
		},

		_onDragOver: function (/**Event*/evt) {
			var el = this.el,
				target,
				dragRect,
				revert,
				options = this.options,
				group = options.group,
				groupPut = group.put,
				isOwner = (activeGroup === group),
				canSort = options.sort;

			if (evt.preventDefault !== void 0) {
				evt.preventDefault();
				!options.dragoverBubble && evt.stopPropagation();
			}

			moved = true;

			if (activeGroup && !options.disabled &&
				(isOwner
					? canSort || (revert = !rootEl.contains(dragEl)) // Reverting item into the original list
					: activeGroup.pull && groupPut && (
						(activeGroup.name === group.name) || // by Name
						(groupPut.indexOf && ~groupPut.indexOf(activeGroup.name)) // by Array
					)
				) &&
				(evt.rootEl === void 0 || evt.rootEl === this.el) // touch fallback
			) {
				// Smart auto-scrolling
				_autoScroll(evt, options, this.el);

				if (_silent) {
					return;
				}

				target = _closest(evt.target, options.draggable, el);
				dragRect = dragEl.getBoundingClientRect();

				if (revert) {
					_cloneHide(true);

					if (cloneEl || nextEl) {
						rootEl.insertBefore(dragEl, cloneEl || nextEl);
					}
					else if (!canSort) {
						rootEl.appendChild(dragEl);
					}

					return;
				}


				if ((el.children.length === 0) || (el.children[0] === ghostEl) ||
					(el === evt.target) && (target = _ghostIsLast(el, evt))
				) {

					if (target) {
						if (target.animated) {
							return;
						}

						targetRect = target.getBoundingClientRect();
					}

					_cloneHide(isOwner);

					if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect) !== false) {
						if (!dragEl.contains(el)) {
							el.appendChild(dragEl);
							parentEl = el; // actualization
						}

						this._animate(dragRect, dragEl);
						target && this._animate(targetRect, target);
					}
				}
				else if (target && !target.animated && target !== dragEl && (target.parentNode[expando] !== void 0)) {
					if (lastEl !== target) {
						lastEl = target;
						lastCSS = _css(target);
						lastParentCSS = _css(target.parentNode);
					}


					var targetRect = target.getBoundingClientRect(),
						width = targetRect.right - targetRect.left,
						height = targetRect.bottom - targetRect.top,
						floating = /left|right|inline/.test(lastCSS.cssFloat + lastCSS.display)
							|| (lastParentCSS.display == 'flex' && lastParentCSS['flex-direction'].indexOf('row') === 0),
						isWide = (target.offsetWidth > dragEl.offsetWidth),
						isLong = (target.offsetHeight > dragEl.offsetHeight),
						halfway = (floating ? (evt.clientX - targetRect.left) / width : (evt.clientY - targetRect.top) / height) > 0.5,
						nextSibling = target.nextElementSibling,
						moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect),
						after
					;

					if (moveVector !== false) {
						_silent = true;
						setTimeout(_unsilent, 30);

						_cloneHide(isOwner);

						if (moveVector === 1 || moveVector === -1) {
							after = (moveVector === 1);
						}
						else if (floating) {
							var elTop = dragEl.offsetTop,
								tgTop = target.offsetTop;

							if (elTop === tgTop) {
								after = (target.previousElementSibling === dragEl) && !isWide || halfway && isWide;
							} else {
								after = tgTop > elTop;
							}
						} else {
							after = (nextSibling !== dragEl) && !isLong || halfway && isLong;
						}

						if (!dragEl.contains(el)) {
							if (after && !nextSibling) {
								el.appendChild(dragEl);
							} else {
								target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
							}
						}

						parentEl = dragEl.parentNode; // actualization

						this._animate(dragRect, dragEl);
						this._animate(targetRect, target);
					}
				}
			}
		},

		_animate: function (prevRect, target) {
			var ms = this.options.animation;

			if (ms) {
				var currentRect = target.getBoundingClientRect();

				_css(target, 'transition', 'none');
				_css(target, 'transform', 'translate3d('
					+ (prevRect.left - currentRect.left) + 'px,'
					+ (prevRect.top - currentRect.top) + 'px,0)'
				);

				target.offsetWidth; // repaint

				_css(target, 'transition', 'all ' + ms + 'ms');
				_css(target, 'transform', 'translate3d(0,0,0)');

				clearTimeout(target.animated);
				target.animated = setTimeout(function () {
					_css(target, 'transition', '');
					_css(target, 'transform', '');
					target.animated = false;
				}, ms);
			}
		},

		_offUpEvents: function () {
			var ownerDocument = this.el.ownerDocument;

			_off(document, 'touchmove', this._onTouchMove);
			_off(ownerDocument, 'mouseup', this._onDrop);
			_off(ownerDocument, 'touchend', this._onDrop);
			_off(ownerDocument, 'touchcancel', this._onDrop);
		},

		_onDrop: function (/**Event*/evt) {
			var el = this.el,
				options = this.options;

			clearInterval(this._loopId);
			clearInterval(autoScroll.pid);
			clearTimeout(this._dragStartTimer);

			// Unbind events
			_off(document, 'mousemove', this._onTouchMove);

			if (this.nativeDraggable) {
				_off(document, 'drop', this);
				_off(el, 'dragstart', this._onDragStart);
			}

			this._offUpEvents();

			if (evt) {
				if (moved) {
					evt.preventDefault();
					!options.dropBubble && evt.stopPropagation();
				}

				ghostEl && ghostEl.parentNode.removeChild(ghostEl);

				if (dragEl) {
					if (this.nativeDraggable) {
						_off(dragEl, 'dragend', this);
					}

					_disableDraggable(dragEl);

					// Remove class's
					_toggleClass(dragEl, this.options.ghostClass, false);
					_toggleClass(dragEl, this.options.chosenClass, false);

					if (rootEl !== parentEl) {
						newIndex = _index(dragEl, options.draggable);

						if (newIndex >= 0) {
							// drag from one list and drop into another
							_dispatchEvent(null, parentEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
							_dispatchEvent(this, rootEl, 'sort', dragEl, rootEl, oldIndex, newIndex);

							// Add event
							_dispatchEvent(null, parentEl, 'add', dragEl, rootEl, oldIndex, newIndex);

							// Remove event
							_dispatchEvent(this, rootEl, 'remove', dragEl, rootEl, oldIndex, newIndex);
						}
					}
					else {
						// Remove clone
						cloneEl && cloneEl.parentNode.removeChild(cloneEl);

						if (dragEl.nextSibling !== nextEl) {
							// Get the index of the dragged element within its parent
							newIndex = _index(dragEl, options.draggable);

							if (newIndex >= 0) {
								// drag & drop within the same list
								_dispatchEvent(this, rootEl, 'update', dragEl, rootEl, oldIndex, newIndex);
								_dispatchEvent(this, rootEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
							}
						}
					}

					if (Sortable.active) {
						if (newIndex === null || newIndex === -1) {
							newIndex = oldIndex;
						}

						_dispatchEvent(this, rootEl, 'end', dragEl, rootEl, oldIndex, newIndex);

						// Save sorting
						this.save();
					}
				}

			}
			this._nulling();
		},

		_nulling: function() {
			// Nulling
			rootEl =
			dragEl =
			parentEl =
			ghostEl =
			nextEl =
			cloneEl =

			scrollEl =
			scrollParentEl =

			tapEvt =
			touchEvt =

			moved =
			newIndex =

			lastEl =
			lastCSS =

			activeGroup =
			Sortable.active = null;
		},

		handleEvent: function (/**Event*/evt) {
			var type = evt.type;

			if (type === 'dragover' || type === 'dragenter') {
				if (dragEl) {
					this._onDragOver(evt);
					_globalDragOver(evt);
				}
			}
			else if (type === 'drop' || type === 'dragend') {
				this._onDrop(evt);
			}
		},


		/**
		 * Serializes the item into an array of string.
		 * @returns {String[]}
		 */
		toArray: function () {
			var order = [],
				el,
				children = this.el.children,
				i = 0,
				n = children.length,
				options = this.options;

			for (; i < n; i++) {
				el = children[i];
				if (_closest(el, options.draggable, this.el)) {
					order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
				}
			}

			return order;
		},


		/**
		 * Sorts the elements according to the array.
		 * @param  {String[]}  order  order of the items
		 */
		sort: function (order) {
			var items = {}, rootEl = this.el;

			this.toArray().forEach(function (id, i) {
				var el = rootEl.children[i];

				if (_closest(el, this.options.draggable, rootEl)) {
					items[id] = el;
				}
			}, this);

			order.forEach(function (id) {
				if (items[id]) {
					rootEl.removeChild(items[id]);
					rootEl.appendChild(items[id]);
				}
			});
		},


		/**
		 * Save the current sorting
		 */
		save: function () {
			var store = this.options.store;
			store && store.set(this);
		},


		/**
		 * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
		 * @param   {HTMLElement}  el
		 * @param   {String}       [selector]  default: `options.draggable`
		 * @returns {HTMLElement|null}
		 */
		closest: function (el, selector) {
			return _closest(el, selector || this.options.draggable, this.el);
		},


		/**
		 * Set/get option
		 * @param   {string} name
		 * @param   {*}      [value]
		 * @returns {*}
		 */
		option: function (name, value) {
			var options = this.options;

			if (value === void 0) {
				return options[name];
			} else {
				options[name] = value;

				if (name === 'group') {
					_prepareGroup(options);
				}
			}
		},


		/**
		 * Destroy
		 */
		destroy: function () {
			var el = this.el;

			el[expando] = null;

			_off(el, 'mousedown', this._onTapStart);
			_off(el, 'touchstart', this._onTapStart);

			if (this.nativeDraggable) {
				_off(el, 'dragover', this);
				_off(el, 'dragenter', this);
			}

			// Remove draggable attributes
			Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
				el.removeAttribute('draggable');
			});

			touchDragOverListeners.splice(touchDragOverListeners.indexOf(this._onDragOver), 1);

			this._onDrop();

			this.el = el = null;
		}
	};


	function _cloneHide(state) {
		if (cloneEl && (cloneEl.state !== state)) {
			_css(cloneEl, 'display', state ? 'none' : '');
			!state && cloneEl.state && rootEl.insertBefore(cloneEl, dragEl);
			cloneEl.state = state;
		}
	}


	function _closest(/**HTMLElement*/el, /**String*/selector, /**HTMLElement*/ctx) {
		if (el) {
			ctx = ctx || document;

			do {
				if (
					(selector === '>*' && el.parentNode === ctx)
					|| _matches(el, selector)
				) {
					return el;
				}
			}
			while (el !== ctx && (el = el.parentNode));
		}

		return null;
	}


	function _globalDragOver(/**Event*/evt) {
		if (evt.dataTransfer) {
			evt.dataTransfer.dropEffect = 'move';
		}
		evt.preventDefault();
	}


	function _on(el, event, fn) {
		el.addEventListener(event, fn, false);
	}


	function _off(el, event, fn) {
		el.removeEventListener(event, fn, false);
	}


	function _toggleClass(el, name, state) {
		if (el) {
			if (el.classList) {
				el.classList[state ? 'add' : 'remove'](name);
			}
			else {
				var className = (' ' + el.className + ' ').replace(RSPACE, ' ').replace(' ' + name + ' ', ' ');
				el.className = (className + (state ? ' ' + name : '')).replace(RSPACE, ' ');
			}
		}
	}


	function _css(el, prop, val) {
		var style = el && el.style;

		if (style) {
			if (val === void 0) {
				if (document.defaultView && document.defaultView.getComputedStyle) {
					val = document.defaultView.getComputedStyle(el, '');
				}
				else if (el.currentStyle) {
					val = el.currentStyle;
				}

				return prop === void 0 ? val : val[prop];
			}
			else {
				if (!(prop in style)) {
					prop = '-webkit-' + prop;
				}

				style[prop] = val + (typeof val === 'string' ? '' : 'px');
			}
		}
	}


	function _find(ctx, tagName, iterator) {
		if (ctx) {
			var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;

			if (iterator) {
				for (; i < n; i++) {
					iterator(list[i], i);
				}
			}

			return list;
		}

		return [];
	}



	function _dispatchEvent(sortable, rootEl, name, targetEl, fromEl, startIndex, newIndex) {
		var evt = document.createEvent('Event'),
			options = (sortable || rootEl[expando]).options,
			onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1);

		evt.initEvent(name, true, true);

		evt.to = rootEl;
		evt.from = fromEl || rootEl;
		evt.item = targetEl || rootEl;
		evt.clone = cloneEl;

		evt.oldIndex = startIndex;
		evt.newIndex = newIndex;

		rootEl.dispatchEvent(evt);

		if (options[onName]) {
			options[onName].call(sortable, evt);
		}
	}


	function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect) {
		var evt,
			sortable = fromEl[expando],
			onMoveFn = sortable.options.onMove,
			retVal;

		evt = document.createEvent('Event');
		evt.initEvent('move', true, true);

		evt.to = toEl;
		evt.from = fromEl;
		evt.dragged = dragEl;
		evt.draggedRect = dragRect;
		evt.related = targetEl || toEl;
		evt.relatedRect = targetRect || toEl.getBoundingClientRect();

		fromEl.dispatchEvent(evt);

		if (onMoveFn) {
			retVal = onMoveFn.call(sortable, evt);
		}

		return retVal;
	}


	function _disableDraggable(el) {
		el.draggable = false;
	}


	function _unsilent() {
		_silent = false;
	}


	/** @returns {HTMLElement|false} */
	function _ghostIsLast(el, evt) {
		var lastEl = el.lastElementChild,
				rect = lastEl.getBoundingClientRect();

		return ((evt.clientY - (rect.top + rect.height) > 5) || (evt.clientX - (rect.right + rect.width) > 5)) && lastEl; // min delta
	}


	/**
	 * Generate id
	 * @param   {HTMLElement} el
	 * @returns {String}
	 * @private
	 */
	function _generateId(el) {
		var str = el.tagName + el.className + el.src + el.href + el.textContent,
			i = str.length,
			sum = 0;

		while (i--) {
			sum += str.charCodeAt(i);
		}

		return sum.toString(36);
	}

	/**
	 * Returns the index of an element within its parent for a selected set of
	 * elements
	 * @param  {HTMLElement} el
	 * @param  {selector} selector
	 * @return {number}
	 */
	function _index(el, selector) {
		var index = 0;

		if (!el || !el.parentNode) {
			return -1;
		}

		while (el && (el = el.previousElementSibling)) {
			if (el.nodeName.toUpperCase() !== 'TEMPLATE'
					&& _matches(el, selector)) {
				index++;
			}
		}

		return index;
	}

	function _matches(/**HTMLElement*/el, /**String*/selector) {
		if (el) {
			selector = selector.split('.');

			var tag = selector.shift().toUpperCase(),
				re = new RegExp('\\s(' + selector.join('|') + ')(?=\\s)', 'g');

			return (
				(tag === '' || el.nodeName.toUpperCase() == tag) &&
				(!selector.length || ((' ' + el.className + ' ').match(re) || []).length == selector.length)
			);
		}

		return false;
	}

	function _throttle(callback, ms) {
		var args, _this;

		return function () {
			if (args === void 0) {
				args = arguments;
				_this = this;

				setTimeout(function () {
					if (args.length === 1) {
						callback.call(_this, args[0]);
					} else {
						callback.apply(_this, args);
					}

					args = void 0;
				}, ms);
			}
		};
	}

	function _extend(dst, src) {
		if (dst && src) {
			for (var key in src) {
				if (src.hasOwnProperty(key)) {
					dst[key] = src[key];
				}
			}
		}

		return dst;
	}


	// Export utils
	Sortable.utils = {
		on: _on,
		off: _off,
		css: _css,
		find: _find,
		is: function (el, selector) {
			return !!_closest(el, selector, el);
		},
		extend: _extend,
		throttle: _throttle,
		closest: _closest,
		toggleClass: _toggleClass,
		index: _index
	};


	/**
	 * Create sortable instance
	 * @param {HTMLElement}  el
	 * @param {Object}      [options]
	 */
	Sortable.create = function (el, options) {
		return new Sortable(el, options);
	};


	// Export
	Sortable.version = '1.4.2';
	return Sortable;
});
