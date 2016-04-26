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
        CanvasComposer.Clock();
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