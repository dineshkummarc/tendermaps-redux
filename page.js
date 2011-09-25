/* page behaviors for tendermaps
   mike tahani      m.tahani@gmail.com
*/

$(document).ready(function() {
    
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