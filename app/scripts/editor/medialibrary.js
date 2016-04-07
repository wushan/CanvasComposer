CanvasComposer.MediaLibrary = (function(){
	var mediaLibrary = $("#mediaLibrary");
	//MediaLibrary
	$('.js-library').on('click', function(){
		mediaLibrary.addClass('active');
		//Load Slides form Slider
		var obj = canvas.getActiveObject();
		if (obj.type === 'slider') {
			//Clean up
			mediaLibrary.find('.selection').empty();
			mediaLibrary.find('.resources a').removeClass('active');
			var resourceid,
					src,
					continued,
					filename,
					targetResource,
					transitionPeriod,
					transitionType;
			var selection = $('.settings-container .selection');
			//push elements back by id
			for (var i=0; i<obj.slides.length; i++) {
				resourceid = obj.slides[i].id;
				src = obj.slides[i].src;
				continued = obj.slides[i].continued;
				filename = obj.slides[i].filename;
				transitionPeriod = obj.slides[i].transitionperiod;
				if (transitionPeriod == '') {
					transitionPeriod = 1;
				}
				transitionType = obj.slides[i].transitiontype;
				// var $item = "<li data-resourceid="+ resourceid +" data-src=" + src + "><div class='order'><div class='continued'><input type='number' value='" + continued + "'></div></div><div class='description'><div class='filename'>" + filename + "</div></div></li>";
				var $item = "<li data-resourceid="+ resourceid +" data-src=" + src + "><div class='controlgroup'><label>持續時間：</label><div class='controls'><div class='row'><div class='grid g-9-12'><div class='order'><div class='continued'><input class='leastTime' type='number' value='" + continued + "'></div></div></div><div class='grid g-3-12'><div class='thumbnail' style='background-image: url(" + src + ");' title='" + filename + "'></div></div></div></div></div><div class='controlgroup'><label>效果：</label><div class='controls'><div class='select-wrapper'><select class='transition-type'><option value='random'>隨機</option><option value='leftright'>由左至右</option><option value='rightleft'>由右至左</option><option value='bottomtop'>由下至上</option><option value='topbottom'>由上至下</option></select></div></div></div><div class='controlgroup'><label>特效時間</label><div class='controls'><input class='transition-period' type='text' placeholder='預設' value='" + transitionPeriod + "'></div></div></li>";
				//Turn this to jQuery Obj
				$item = $($item);
				//Select Transition Type
				$item.find('.transition-type option[value=' + transitionType + ']').attr('selected', true);
				selection.append($item);
				$('#mediaLibrary .resources li').each(function(){
					targetResource = $(this).children('a').attr('data-resourceid');
					if (resourceid === targetResource) {
						$(this).children('a').addClass('active');
					}
				})
			}
		} else {
			//Normally Clean Up Library Selections
			mediaLibrary.find('.selection').empty();
			mediaLibrary.find('.resources a').removeClass('active');
		}
	})

	mediaLibrary.find('.js-close').on('click', function(){
		mediaLibrary.removeClass('active');
	})


	//Resource Selected
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
		var $item = "<li data-resourceid="+ resourceid +" data-src=" + src + "><div class='controlgroup'><label>持續時間：</label><div class='controls'><div class='row'><div class='grid g-9-12'><div class='order'><div class='continued'><input class='leastTime' type='number' value='" + continued + "'></div></div></div><div class='grid g-3-12'><div class='thumbnail' style='background-image: url(" + src + ");' title='" + filename + "'></div></div></div></div></div><div class='controlgroup'><label>效果：</label><div class='controls'><div class='select-wrapper'><select class='transition-type'><option value='random'>隨機</option><option value='leftright'>由左至右</option><option value='rightleft'>由右至左</option><option value='bottomtop'>由下至上</option><option value='topbottom'>由上至下</option></select></div></div></div><div class='controlgroup'><label>特效時間</label><div class='controls'><input class='transition-period' type='text' placeholder='預設'></div></div></li>";
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
				filename,
				transitionPeriod,
				transitionType;
		//先搜集所有內容
		var selected = [];
		var selection = $('.settings-container .selection');

		selection.children('li').each(function(){
			resourceid = $(this).attr('data-resourceid');
			src = $(this).attr('data-src');
			continued = $(this).find('.leastTime').val();
			filename = $(this).find('.filename').html();
			transitionPeriod = $(this).find('.transition-period').val();
			transitionType = $(this).find('.transition-type').val();
			var collected = {'id':resourceid, 'src':src, 'continued': continued, 'filename': filename, 'transitiontype': transitionType, 'transitionperiod': transitionPeriod};
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
			mediaLibrary.removeClass('active');
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
				console.log(selected);
			}
			mediaLibrary.removeClass('active');
		}
	}
}();