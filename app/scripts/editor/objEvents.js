function bindEvents(obj) {
  obj.on('selected', function() {
    console.log('selected');
    $('.objectControl').addClass('active');
    $('#config').fadeTo('fast',0.9);
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
}