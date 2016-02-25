(function() {
  window.YoutubeVideo = function(id, callback) {
    return $.ajax({
        url: "get_video_info.php", //fix cross domain problem, just download the content of url with curl
        method: "POST",
        data: {url: "http://www.youtube.com/get_video_info?video_id=" + id},
        dataType: "text"
    }).done(function(video_info) {
      var video;
      video = YoutubeVideo.decodeQueryString(video_info);
      if (video.status === "fail") {
        return callback(video);
      }
      video.sources = YoutubeVideo.decodeStreamMap(video.url_encoded_fmt_stream_map);
      video.getSource = function(type, quality) {
        var exact, key, lowest, source, _ref;
        lowest = null;
        exact = null;
        _ref = this.sources;
        for (key in _ref) {
          source = _ref[key];
          if (source.type.match(type)) {
            if (source.quality.match(quality)) {
              exact = source;
            } else {
              lowest = source;
            }
          }
        }
        return exact || lowest;
      };
      return callback(video);
    });
  };
  window.YoutubeVideo.decodeQueryString = function(queryString) {
    var key, keyValPair, keyValPairs, r, val, _i, _len;
    r = {};
    keyValPairs = queryString.split("&");
    for (_i = 0, _len = keyValPairs.length; _i < _len; _i++) {
      keyValPair = keyValPairs[_i];
      key = decodeURIComponent(keyValPair.split("=")[0]);
      val = decodeURIComponent(keyValPair.split("=")[1] || "");
      r[key] = val;
    }
    return r;
  };
  window.YoutubeVideo.decodeStreamMap = function(url_encoded_fmt_stream_map) {
    var quality, sources, stream, type, urlEncodedStream, _i, _len, _ref;
    sources = {};
    _ref = url_encoded_fmt_stream_map.split(",");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      urlEncodedStream = _ref[_i];
      stream = YoutubeVideo.decodeQueryString(urlEncodedStream);
      type = stream.type.split(";")[0];
      quality = stream.quality.split(",")[0];
      stream.original_url = stream.url;
      stream.url = "" + stream.url + "&signature=" + stream.sig;
      sources["" + type + " " + quality] = stream;
    }
    return sources;
  };
}).call(this);



function validateYouTubeUrl(url) {
    if (url != undefined || url != '') {        
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        var mp4,
            webm;
        if (match && match[2].length == 11) {
            return match[2]; 
        } else {
            return false;
        }
    }
}