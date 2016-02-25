
// window.YoutubeVideo = function(id, callback) {
//   var url = "https://www.googleapis.com/youtube/v3/videos?id=" + id + "&part=snippet&key=AIzaSyCjiWPLJdE-QbakmKin__3rDqOKLgKyCRY"
//   return {
//     $.getJSON(url,function(){
//       console.log('success');
//     }).done(function(res){
//       console.log(res);
//       var thumbnails = res.items[0].snippet.thumbnails.default.url;
//     }).fail(function(error){
//       console.log(error);
//     })
//   }
// };
function getThumbnails(id , callback) {
  var url = "https://www.googleapis.com/youtube/v3/videos?id=" + id + "&part=snippet&key=AIzaSyCjiWPLJdE-QbakmKin__3rDqOKLgKyCRY"
  $.getJSON(url,function(){
    console.log('success');
  }).done(function(res){
    console.log(res);
    var thumbnails;
    if (res.items[0].snippet.thumbnails.standard.url != '') {
      thumbnails = res.items[0].snippet.thumbnails.standard.url;
    } else {
      thumbnails = res.items[0].snippet.thumbnails.default.url;
    }
    return callback(thumbnails);
  }).fail(function(error){
    console.log(error);
  })
}



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