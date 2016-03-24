CanvasComposer.MediaLibrary = function(){
  //Media //Bind OnChange to avoid 'undefined'
    $('.js-library').on('click', function(){
      $('#mediaLibrary').addClass('active');
      //Load Slides form Slider
      var obj = canvas.getActiveObject();
      if (obj.type === 'slider') {
        //Clean up
        $('#mediaLibrary .selection').empty();
        $('#mediaLibrary .resources a').removeClass('active');
        var resourceid,
            src,
            continued,
            filename,
            targetResource;
        var selection = $('.settings-container .selection');
        //push elements back by id
        for (var i=0; i<obj.slides.length; i++) {
          resourceid = obj.slides[i].id;
          src = obj.slides[i].src;
          continued = obj.slides[i].continued;
          filename = obj.slides[i].filename;
          // var $item = "<li data-resourceid="+ resourceid +" data-src=" + src + "><div class='order'><div class='continued'><input type='number' value='" + continued + "'></div></div><div class='description'><div class='filename'>" + filename + "</div></div></li>";
          var $item = "<li data-resourceid="+ resourceid +" data-src=" + src + "><div class='controlgroup'><label>持續時間：</label><div class='controls'><div class='row'><div class='grid g-9-12'><div class='order'><div class='continued'><input type='number' value='" + continued + "'></div></div></div><div class='grid g-3-12'><div class='thumbnail' style='background-image: url(" + src + ");' title='" + filename + "'></div></div></div></div></div></li>";
          selection.append($item);
          $('#mediaLibrary .resources li').each(function(){
            targetResource = $(this).children('a').attr('data-resourceid');
            if (resourceid === targetResource) {
              $(this).children('a').addClass('active');
            }
          })
        }

        
        // console.log(obj.slides);
      } else {
        $('#mediaLibrary .selection').empty();
        $('#mediaLibrary .resources a').removeClass('active');
      }
    })
    $('#mediaLibrary .js-close').on('click', function(){
      $('#mediaLibrary').removeClass('active');
    })


//組合已選項目物件
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
  var $item = "<li data-resourceid="+ resourceid +" data-src=" + src + "><div class='controlgroup'><label>持續時間：</label><div class='controls'><div class='row'><div class='grid g-9-12'><div class='order'><div class='continued'><input type='number' value='" + continued + "'></div></div></div><div class='grid g-3-12'><div class='thumbnail' style='background-image: url(" + src + ");' title='" + filename + "'></div></div></div></div></div></li>";
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
      filename;
  //先搜集所有內容
  var selected = [];
  var selection = $('.settings-container .selection');

  selection.children('li').each(function(){
    resourceid = $(this).attr('data-resourceid');
    src = $(this).attr('data-src');
    continued = $(this).find('input').val();
    filename = $(this).find('.filename').html();
    var collected = {'id':resourceid, 'src':src, 'continued': continued, 'filename': filename};
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
    $('#mediaLibrary').removeClass('active');
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
    }
    $('#mediaLibrary').removeClass('active');
  }
}
}