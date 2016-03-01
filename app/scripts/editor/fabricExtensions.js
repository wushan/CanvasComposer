// fabric.Canvas.prototype.getItemByAttr = function(attr, name) {
//     var object = null,
//     objects = this.getObjects();
//     for (var i = 0, len = this.size(); i < len; i++) {
//         if (objects[i][attr] && objects[i][attr] === name) {
//             object = objects[i];
//             break;
//         }
//     }
//     return object;
// };

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
            }
        });
    },
  _render: function (ctx) {
            this.callSuper('_render', ctx);
        }
});

//Create Fabric Slider Class
fabric.Slider = fabric.util.createClass(fabric.Rect, {
	type: 'slider'
});

fabric.Slider.fromArray = function(source, callback, imgOptions) {
	fabric.util.loadImage(source, function(img) {
      callback && callback(new fabric.Slider(img, imgOptions));
    }, null, imgOptions && imgOptions.crossOrigin);
};


fabric.Video.fromURL = function(url, callback, imgOptions) {
    fabric.util.loadImage(url, function(img) {
      callback && callback(new fabric.Video(img, imgOptions));
    }, null, imgOptions && imgOptions.crossOrigin);
  };


fabric.Video.fromObject = function(objects, callback) {
  // console.log(objects.media.video);
  // return new fabric.Video(objects.media.video);
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

// fabric.Video.fromObject = function(object, callback) {
//     fabric.util.loadImage(object.src, function(img) {
//       fabric.Image.prototype._initFilters.call(object, object, function(filters) {
//         object.filters = filters || [ ];
//         var instance = new fabric.Image(img, object);
//         callback && callback(instance);
//       });
//     }, null, object.crossOrigin);
//   };

//Extend Attributes for Fabric Objects
fabric.Object.prototype.id = {}

fabric.Object.prototype.media = {
  'slider' : '',
  'slides' : [],
  'video' : ''
}