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
	type: 'video'
});

fabric.Video.fromURL = function(url, callback, imgOptions) {
    fabric.util.loadImage(url, function(img) {
      callback && callback(new fabric.Video(img, imgOptions));
    }, null, imgOptions && imgOptions.crossOrigin);
  };

//Extend Attributes for Fabric Objects
fabric.Object.prototype.id = {}

fabric.Object.prototype.media = {
  'slider' : '',
  'slides' : [],
  'video' : ''
}