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
    if (obj.type === 'i-text') {
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