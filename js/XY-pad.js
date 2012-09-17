
$(document).ready(function() {
    var intialX = $('#xPos').val();
    var intialY = $('#yPos').val();

    $('.xy-pad').each(function(){
        drawCircle($(this)[0],intialX, intialY);
    });

    $('.xy-pad').mousedown(function(e) {
        handleClick(e);
    });

    $('.xy-pad').mousemove(function(e) {
        if( e.which == 1 ) { // 1 for clicked down mouse
            handleClick(e);
        }
    });


    function handleClick(e) {
      var x = e.offsetX,
      y = e.offsetY;
      $('#xPos1').val(x);
      $('#yPos1').val(y);
      drawCircle(e.target, x,y);
    }


    function drawCircle (canvas_id, centerX, centerY) {
        var canvas =  canvas_id;// $("#"+canvas_id)[0];
        var context = canvas.getContext('2d');
        var radius = 10;

        context.clearRect ( 0 , 0 , canvas.width, canvas.height );
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fillStyle = '#8ED6FF';
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = 'black';
        context.stroke();
    }


});

