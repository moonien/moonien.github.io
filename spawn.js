$(document).ready(function() {
$('.spawn').each(function(index, element) {

let type = $(this).attr('id');

$.get('https://moonien.github.io/'+type+'.txt', function (data) {
  $(this).replaceWith(data);
}, 'text');

});
});
