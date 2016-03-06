//Media //Bind OnChange to avoid 'undefined'
    $('.js-library').on('click', function(){
      $('#mediaLibrary').addClass('active');
      $('#mediaLibrary .selection').empty();
      $('#mediaLibrary .resources a').removeClass('active');
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
  filename = $(this).find('.filename').html();
  resourceid = $(this).attr('data-resourceid');
  continued = "1";
  var $item = "<li data-resourceid="+ resourceid +" data-src=" + src + "><div class='order'><div class='continued'><input type='number' value='" + continued + "'></div></div><div class='description'><div class='filename'>" + filename + "</div></div></li>";
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
      continued;
  //先搜集所有內容
  var selected = [];
  var selection = $('.settings-container .selection');

  selection.children('li').each(function(){
    resourceid = $(this).attr('data-resourceid');
    src = $(this).attr('data-src');
    continued = $(this).find('input').val();
    var collected = {'id':resourceid, 'src':src, 'continued': continued};
    selected.push(collected);
    console.log(selected);
  })

  selectionConfirmator(selected);
})

function selectionConfirmator(selected){
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
      Artboard.addMedia(selected);
    }
    $('#mediaLibrary').removeClass('active');
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
      Artboard.addMedia(selected);
    }
    $('#mediaLibrary').removeClass('active');
  }
}