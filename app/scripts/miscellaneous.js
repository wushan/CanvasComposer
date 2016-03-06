'use strict'
//Sortable List
var el = document.getElementById('selectionOrder');
var sortable = Sortable.create(el);

//Fonts
var Typekit;
(function(d) {
	var config = {
		kitId: 'daf4cqp',
		scriptTimeout: 3000,
		async: true
	},
	h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
})(document);

// var i = 0;
// var counter;
// var obj;
// //TEST
// var arr1 = [{src: 'http://twimg.edgesuite.net/images/thumbnail/other/b5d5d428efcd1c600d2c5d6b7e0186ee.jpg', continued: '1'},{src: 'http://twimg.edgesuite.net/images/thumbnail/other/9ef19f3d1917413c2a6b656c16987465.jpg', continued: '1'},{src: 'http://twimg.edgesuite.net/images/thumbnail/other/ef04175459f45d35f165dd4fb0b07369.jpg', continued: '1'}],
// 	arr2 = [{src: 'http://twimg.edgesuite.net/images/thumbnail/other/3c411b35afd5687e1a8ba436e6d1d8ca.jpg', continued: '1'},{src: 'http://twimg.edgesuite.net/images/thumbnail/other/a282063dca06d84130a679412affe45d.jpg', continued: '1'},{src: 'http://twimg.edgesuite.net/images/thumbnail/other/e9700b3444bc3a5340dc37f358baf0e7.jpg', continued: '1'}];
// var leastTime;
// new fabric.Slider.fromArray(arr1, function(res){
// 		var patternSourceCanvas = res.patternSourceCanvas;
// 		var pattern = res.pattern;
// 		//已建立 slider 物件
// 		console.log(res);
// 		console.log(res.toObject());
// 		canvas.add(res);
// 		canvas.renderAll();
// 		// Bind
// 		bindEvents(res);
// 		//Programmatically Select Newly Added Object
// 		// canvas.setActiveObject(res);
// 		res.setCoords();
// 		//Refresh log
// 		logObj();
// 		leastTime = res.slides[0].continued*1000;
// 		var id = res.id;
// 		setTimeout(function(){bgRelacer(i,res,id)}, leastTime);
// 		function bgRelacer(i, res, id) {

// 			i++;
// 			if (i === res.slides.length ) {
// 				i=0;
// 			}
// 			obj = findObj(id);
// 			new fabric.Image.fromURL(res.slides[i].src, function(img){
// 				// patternSourceCanvas = new fabric.StaticCanvas();
// 				// console.log(patternSourceCanvas);
// 				img.setHeight(patternSourceCanvas.height);
// 				img.setWidth(patternSourceCanvas.width);

// 				patternSourceCanvas.setBackgroundImage(img);
// 				patternSourceCanvas.renderAll();
// 				// patternSourceCanvas.renderAll();
// 				pattern = new fabric.Pattern({
// 					source: patternSourceCanvas.getElement(),
// 					repeat: 'no-repeat'
// 				});

// 				res.setFill(pattern);
// 				canvas.renderAll();
// 			})
// 			leastTime = res.slides[i].continued*1000;
// 			setTimeout(function(){bgRelacer(i,res,id)}, leastTime);
// 		}
// }, {
// 	left: 150,
// 	top: 100
// });

// new fabric.Slider.fromArray(arr2, function(res){
// 		var patternSourceCanvas = res.patternSourceCanvas;
// 		var pattern = res.pattern;
// 		//已建立 slider 物件
// 		console.log(res);
// 		console.log(res.toObject());
// 		canvas.add(res);
// 		canvas.renderAll();
// 		// Bind
// 		bindEvents(res);
// 		//Programmatically Select Newly Added Object
// 		// canvas.setActiveObject(res);
// 		res.setCoords();
// 		//Refresh log
// 		logObj();
// 		leastTime = res.slides[0].continued*1000;
// 		var id = res.id;
// 		setTimeout(function(){bgRelacer(i,res,id)}, leastTime);
// 		function bgRelacer(i, res, id) {
			
// 			i++;
// 			if (i === res.slides.length ) {
// 				i=0;
// 			}
// 			obj = findObj(id);
// 			new fabric.Image.fromURL(res.slides[i].src, function(img){
// 				// patternSourceCanvas = new fabric.StaticCanvas();
// 				// console.log(patternSourceCanvas);
// 				img.setHeight(patternSourceCanvas.height);
// 				img.setWidth(patternSourceCanvas.width);

// 				patternSourceCanvas.setBackgroundImage(img);
// 				patternSourceCanvas.renderAll();
// 				// patternSourceCanvas.renderAll();
// 				pattern = new fabric.Pattern({
// 					source: patternSourceCanvas.getElement(),
// 					repeat: 'no-repeat'
// 				});

// 				res.setFill(pattern);
// 				canvas.renderAll();
// 			})
// 			leastTime = res.slides[i].continued*1000;
// 			setTimeout(function(){bgRelacer(i,res,id)}, leastTime);
// 		}
// }, {
// 	left: 0,
// 	top: 0
// });