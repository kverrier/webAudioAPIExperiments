var audioContext = 0 ;
var gainNode = 0;
var my_osc = 0;
var isOscPlaying = false;


function setUpAudioContext() {
	audioContext = new webkitAudioContext();
	gainNode = audioContext.createGainNode();
	gainNode.gain.value = 0.1;
	gainNode.connect(audioContext.destination);
}

function playOsc() {
	var osc = audioContext.createOscillator();
	osc.type = 0;
	osc.frequency = 440;
	osc.connect(gainNode);
	osc.noteOn(0);
	my_osc = osc;
}

function stopOsc() {
	my_osc.noteOff(0);
	my_osc = null;

}


$(document).ready(function() {
	setUpAudioContext();


	$("#togglePlay").click(function(e) {

		var $toggle = $('#togglePlay');
		var toggleState = $toggle.val();

		if (toggleState === 'PLAY') {
			playOsc();
			$toggle.val('STOP');
		} else {
			stopOsc();
			$toggle.val('PLAY');
		}
	});

	$("#freqSlider").change(function(e) {
		var freq = e.target.value;
		changeFreq(freq);
	});

	$("#gainSlider").change(function(e) {
		var amp = e.target.value;
		changeGain(amp);
	});


	$('.xy-pad').mousedown(function(e) {
		handleClick(e);
	});

	$('.xy-pad').mousemove(function(e) {
		if (e.which == 1) { // 1 for clicked down mouse
			handleClick(e);
		}
	});


	function handleClick(e) {
		var x = e.offsetX,
			y = e.offsetY;
		$('#xPos1').val(x);
		$('#yPos1').val(y);


		var freq = (1200 / 400) * x + 20;
		changeFreq(freq);
		var amp = (400 - y) / 400;
		changeGain(amp);

	}

	function changeFreq(freq) {
		$('#freqSlider').val(freq);
		$('#freqNumberBox').val(freq);
		my_osc.frequency.linearRampToValueAtTime(freq, audioContext.currentTime + 0.02);
	}

	function changeGain(amp) {
		$('#gainSlider').val(amp);
		$('#gainNumberBox').val(amp);
		gainNode.gain.linearRampToValueAtTime(amp, audioContext.currentTime + 0.02);
	}

});


