CanvasComposer.Marquee = function(){
	$('#marquee-source').on('change', function(){
		var val = $(this).val();
		//Get the proper form
		$('#' + val).slideDown().promise().done(function(){
			$(this).addClass('active');
			$(this).siblings().slideUp().promise().done(function(){
				$(this).removeClass('active');
			})
		});
	})
	$('.js-addRow').on('click', function(){
		var el = $('.string-list-wrapper .string-item:last-child').clone();
		$('.string-list-wrapper').append(el);
	});
	$('.js-removeRow').on('click', function(){
		$('.string-list-wrapper .string-item:last-child').remove();
	});

	$('.js-sendToMarquee').on('click', function(){
		var marquee = {};
		var marqueeGroup;
		var marqueestring,
			marqueeleasttime,
			marqueetype,
			marqueetransitionperiod;
		var marqueedefault = 3;

		var activeTarget = $('.marquee-form.active');
		activeTarget.each(function(){
			marqueestring = new Array;
			marqueestring = $(this).find('.marquee-string').val().split('\n');
			console.log(marqueestring);
			marqueeleasttime = $(this).find('.marquee-leasttime').val();
			marqueetype = $(this).find('.marquee-type').val();
			marqueetransitionperiod = $(this).find('.marquee-transitionperiod').val();

			if (marqueestring == '') {
				marqueestring = 'null';
			}
			if (marqueeleasttime == '') {
				marqueeleasttime = marqueedefault;
			}
			if (marqueetype == '') {
				marqueetype = 'default';
			}
			if(marqueetransitionperiod == '') {
				marqueetransitionperiod = marqueedefault;
			}
			marquee = { string: marqueestring, leastTime: marqueeleasttime, transitionType: marqueetype, transitionPeriod: marqueetransitionperiod };
			// marqueeGroup.push(marquee);
		});
		console.log(marquee);
		//Create
		CanvasComposer.Artboard.addMarquee(marquee);
		$('#marquee-settings').removeClass('active');
	});
	$('#marquee-settings').find('.js-close').on('click', function(){
		$('#marquee-settings').removeClass('active');
	});
};