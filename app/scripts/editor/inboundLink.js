CanvasComposer.inboundLinks = function() {
	var inboundList = $('#inboundlist');

	$('.js-inbounds').on('click', function(){
		inboundList.addClass('active');
	});

	$('#inboundlist a[data-rel]').on('click', function(){
		var link = $(this).data("rel");
		var obj = canvas.getActiveObject();
		obj.link = link;
		inboundList.removeClass('active');
		instantMeta.log(obj);
	});

	$('#inboundlist .js-close').on('click', function(){
      inboundList.removeClass('active');
    });

}