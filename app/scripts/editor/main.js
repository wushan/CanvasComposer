(function() {
	var canvasEditor = $('#canvaseditor');

	//Generate View Components
	var templates = (function ($, host) {
	    // begin to load external templates from a given path and inject them into the DOM
	    return {
	        // use jQuery $.get to load the templates asynchronously
	        load: function (templateArray, target, event) {
	            var defferArray = [];
	            $.each(templateArray, function (idx, url) {
	                var loader = $.get(url)
	                    .success(function (data) {
	                    // on success, add the template to the targeted DOM element
	                    $(target).append(data);
	                })
	                defferArray.push(loader);
	            })

	            $.when.apply(null, defferArray).done(function () {
	                $(host).trigger(event);
	            });
	        }
	    };
	})(jQuery, document);

	$(document).on("files-loaded", function () {
	    canvasEditor.append("<p>All done!</p>");
	})
	
	$(function () {
	    var templateArray = ["layouts/sidebar.html", "layouts/artboard.html"]
	    templates.load(templateArray, canvasEditor, "files-loaded");
	});

}());