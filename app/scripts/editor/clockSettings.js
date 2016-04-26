CanvasComposer.Clock = function(){
	$('.js-send-timeformat').on('click', function(){
		var timeFormat = $('#timeFormat').val();
		console.log(typeof timeFormat);
		CanvasComposer.Artboard.Multimedia.clock(timeFormat);
		$(this).parents('ul').removeClass('active');
	});

};