var audioContext = 0 ;
var gainNode = 0;
var osc = 0;
var isPlaying = false;

var MAX_FREQ = 1200;
var MIN_FREQ = 20;
var MAX_GAIN = 1;

var MAX_DURATION = 2;

var duration = 0.5;
var timer = null;

var rate = 2;



function setUpAudioContext() {
	audioContext = new webkitAudioContext();
	gainNode = audioContext.createGainNode();
	gainNode.gain.value = 0.1;
	gainNode.connect(audioContext.destination);
}

function playOsc() {
	osc = audioContext.createOscillator();
	osc.type = 0;
	osc.frequency = 440;
	osc.connect(gainNode);
	osc.noteOn(0);
	// gainNode.gain.linearRampToValueAtTime()
	osc.noteOff(audioContext.currentTime + duration);
}

function toggle () {
	isPlaying ? stopLoop() : startLoop();
	isPlaying = !isPlaying;
}

function startLoop () {
	playOsc();
	var recurse = arguments.callee;
	timer = setTimeout(function() {
		recurse();
	}, (rate) * 1000);
}


function stopLoop() {
	clearTimeout(timer);
	// osc = null;
}


$(document).ready(function() {
	setUpAudioContext();


	$("#togglePlay").click(function(e) {

		var $toggle = $('#togglePlay');
		var toggleState = $toggle.val();

		if (isPlaying) {
			$toggle.val('PLAY');
		} else {
			$toggle.val('STOP');
		}
		toggle();
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

		var canvas = e.target;

		var freq = (MAX_FREQ / canvas.width ) * x + MIN_FREQ;
		changeFreq(freq);
		var amp = (canvas.height - y) / canvas.height;
		changeGain(amp);
		changePeriod(amp);

	}

	function changeFreq(freq) {
		$('#freqSlider').val(freq);
		$('#freqNumberBox').val(freq);
		osc.frequency.linearRampToValueAtTime(freq, audioContext.currentTime + 0.02);
	}

	function changeGain(amp) {
		$('#gainSlider').val(amp);
		$('#gainNumberBox').val(amp);
		gainNode.gain.linearRampToValueAtTime(amp, audioContext.currentTime + 0.02);
	}

	function changePeriod(amp) {
		$('#gainSlider').val(amp);
		$('#gainNumberBox').val(amp);
		rate = amp;
	}

});


