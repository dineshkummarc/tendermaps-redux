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
      $('#metadata').show();
      $('#metadata_bg').show();
      //return false;
    });
    
    $('#metadata_bg').click(function() {
      $('#metadata').hide();
      $('#metadata_bg').hide();
    });
    
    $('#brush_color > .brushcolor').click(function() {
        window.brush_color = '#' + $(this).id;
    });
    
    $('#brush_type > .brushtype').click(function() {
        window.brush_type = $(this).id;
    });
    
    $('#brush_size > .brushsize').click(function() {
        window.brush_size = parseInt( $(this).id );
    });

});