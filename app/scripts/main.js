//Setting Up Canvas
var canvas = new fabric.Canvas('c', {
  selectionColor: 'blue',
  selectionLineWidth: 2,
  width: 600,
  height: 400
  // ...
});


// // Select
// rect.on('selected', function() {
//   console.log('selected a rectangle');
// });
// //Scaling
// rect.on('scaling', function() {
//   console.log('scaling');
// });
// //Moving
// rect.on('moving', function() {
//   console.log('moving');
// });

var initRadius = 100;

var addObject = {
  addRect : function(){
    var rect = new fabric.Rect({
      left: canvas.getWidth()/2-initRadius/2,
      top: canvas.getWidth()/2-initRadius/2,
      fill: 'rgba(0,0,0,0.33)',
      width: initRadius,
      height: initRadius
    });

    canvas.add(rect);
    //Bind
    bindEvents(rect);
    //Refresh log
    logObj();
  },
  addCircle : function(){
    var circle = new fabric.Circle({
      left: canvas.getWidth()/2-initRadius/2,
      top: canvas.getWidth()/2-initRadius/2,
      fill: 'rgba(0,0,0,0.33)',
      radius: initRadius/2
    });
    canvas.add(circle);
    //Bind
    bindEvents(circle);
    //Refresh log
    logObj();
  },
  addTriangle : function(){
    var triangle = new fabric.Triangle({
      left: canvas.getWidth()/2-initRadius/2,
      top: canvas.getWidth()/2-initRadius/2,
      fill: 'rgba(0,0,0,0.33)',
      width: initRadius,
      height: initRadius
    });
    canvas.add(triangle);
    //Bind
    bindEvents(triangle);
    //Refresh log
    logObj();
  }
}

//Get Objects
canvas.getObjects();
//Information
console.log(canvas.getWidth());

//Bind
$('.tools').on('click', 'a', function(){
  var className = $(this).attr('class');
  switch(className){
    case 'js-add-rect':
      addObject.addRect();
      break;
    case 'js-add-circle':
      addObject.addCircle();
      break;
    case 'js-add-triangle':
      addObject.addTriangle();
      break;
  }
})

function bindEvents(obj) {
  obj.on('selected', function() {
    console.log('selected');
    instantMeta(obj);
  });
  //Scaling
  obj.on('scaling', function() {
    console.log('scaling');
    instantMeta(obj);
  });
  //Moving
  obj.on('moving', function() {
    console.log('moving');
    instantMeta(obj);
  });
  //Rotating
  obj.on('rotating', function() {
    console.log('rotating');
    instantMeta(obj);
  });
}

function instantMeta(obj) {
  console.log(obj);
  var width,
      height,
      radius,
      left,
      top,
      angle,
      type;

  width = obj.width*obj.scaleX;
  height = obj.height*obj.scaleY;
  radius = obj.radius;
  left = obj.left;
  top = obj.top;
  angle = obj.angle;
  type = obj.type;

  $('.information .type span').html(type);
  $('.information .width span').html(width);
  $('.information .height span').html(height);
  $('.information .radius span').html(radius);
  $('.information .angle span').html(angle);
  $('.information .position .top span').html(top);
  $('.information .position .left span').html(left);
}

function logObj() {
  $('#console').html(JSON.stringify(canvas.toJSON()));
  // fabric.log(canvas.toJSON());
}