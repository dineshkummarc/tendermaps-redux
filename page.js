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

});