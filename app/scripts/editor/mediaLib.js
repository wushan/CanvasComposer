//Media //Bind OnChange to avoid 'undefined'
    $('.js-library').on('click', function(){
      $('#mediaLibrary').addClass('active');
      selected.length = 0;
      $('#mediaLibrary .selection').empty();
      $('#mediaLibrary .resources a').removeClass('active');
    })
    $('#mediaLibrary .js-close').on('click', function(){
      $('#mediaLibrary').removeClass('active');
    })
    var selected = [];
    $('#mediaLibrary .resources').on('click','a',function(){
      $(this).toggleClass('active');
      var filename,
          src,
          count,
          continued,
          resourceid,
          targetid;
      
      src = $(this).attr('data-src');
      filename = $(this).find('.filename').html();
      resourceid = $(this).attr('data-resourceid');
      continued = "5";

      // $('.settings-container .selection li').each(function(){
      //   targetid = $(this).attr('data-resourceid');
      //   if ( targetid != undefined ) {
      //     selected.push(targetid);
      //     console.log(selected);
      //   }
      // })
      var $item = "<li data-resourceid="+ resourceid +"><div class='order'><div class='continued'><input type='number' value='" + continued + "'></div></div><div class='description'><div class='filename'>" + filename + "</div></div></li>";
      if (in_array(selected, resourceid)) {
        $('.settings-container .selection li').each(function(){
          var targetid = $(this).attr('data-resourceid');
          if (targetid === resourceid) {
            //Remove self
            $(this).remove();
            //Remove this id in Array
            var index = getIdx(selected, 'id', targetid);
            if (index > -1) {
              selected.splice(index, 1);
            }
            
            console.log(selected);
          }
        })
      } else {
        $('.settings-container .selection').append($item);
        var ooo = {'id':resourceid, 'src':src, 'continued': continued};
        selected.push(ooo);
        console.log(selected);
      }
    })
    function getIdx(list, key, val){
      return _.chain(list).pluck(key).indexOf(val).value();
    }
    function in_array(array, id) {
        for(var i=0;i<array.length;i++) {
          console.log(array[i]);
            if(array[i].id === id)
              return true;
        }
        return false;
    }
    //Send Object to Fabricjs
    $('.js-sendToObj').on('click', function(){
      if (selected.length === 1) {
        var resource = selected[0].src;
        $('#mediaValue').val(resource);
        var obj = canvas.getActiveObject();
        var newImage = resource;
        console.log(newImage);
        if (obj == null) {
          alert('未選取任何物件');

        } else {
          if (obj._element !== undefined && obj._element.localName === "video") {
            obj.getElement().pause();
            obj.remove();
          } else {
            obj.remove();
          }
          Artboard.addMedia(newImage);
          canvas.renderAll();
          obj.center();
          obj.setCoords();
          logObj();
        }
        $(this).parents('#mediaLibrary').removeClass('active');
      } else if (selected.length > 1){
        //If Array
        var obj = canvas.getActiveObject();
        // var selectedObjs = [];
        if (obj == null) {
          alert('未選取任何物件');

        } else {
          obj.remove();
        }
        Artboard.addMedia(selected);
        canvas.renderAll();
        obj.center();
        obj.setCoords();
        logObj();
        $(this).parents('#mediaLibrary').removeClass('active');
        
      } else {
        alert('未選擇任何素材');
      }
    })