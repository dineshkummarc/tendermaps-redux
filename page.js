/* page behaviors for tendermaps
   mike tahani      m.tahani@gmail.com
*/

$(document).ready(function() {
    
    $('.options > a').click(function() {
        if (!$(this).hasClass('canvasopts')) {
            $(this).siblings().removeClass('selected');    
            $(this).addClass('selected');
        }
    });
    
    $('#mapdone').click(function() {
      $('#metadata, #metadata_bg').show();
    });
    
    $('#metadata_bg').click(function() {
      $('#metadata, #metadata_bg').hide();
    });
    
    $('#brush_color > a').click(function() {
        window.brush_color = '#' + $(this).attr('id');
        return false;
    });
    
    $('#brush_type > a').click(function() {
        window.brush_type = $(this).attr('id');
        return false;
    });
    
    $('#brush_size > a').click(function() {
        window.brush_size = parseInt( $(this).attr('id') );
        return false;
    });

});