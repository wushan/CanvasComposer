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