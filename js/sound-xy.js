var audioContext = 0 ;
var gainNode = 0;
var osc = 0;
var isPlaying = false;

var MAX_FREQ = 1200;
var MIN_FREQ = 20;

var MAX_GAIN = 1;
var MIN_GAIN = 0;

var MAX_RATE = 2;
var MIN_RATE = 0.5;


var MAX_DURATION = 2;

var frequency = 440;
var duration = 0.5;
var timer = null;

var rate = 2;



function setUpAudioContext() {
	audioContext = new webkitAudioContext();
	gainNode = audioContext.createGainNode();
	gainNode.gain.value = 0.1;
	gainNode.connect(audioContext.destination);
}

function playOsc(freq) {
	osc = audioContext.createOscillator();
	osc.type = 0;
	osc.frequency.value = frequency;
	osc.connect(gainNode);

	var currentTime = audioContext.currentTime;
	var attack = 0.01;

	gainNode.gain.linearRampToValueAtTime(0,0);
	gainNode.gain.linearRampToValueAtTime(1,currentTime+attack);
	osc.noteOn(0);
	var endTime = currentTime + duration;
	gainNode.gain.linearRampToValueAtTime(0, endTime);
	osc.noteOff(endTime);
}

function toggle () {
	isPlaying ? stopLoop() : startLoop();
	isPlaying = !isPlaying;
}

function startLoop () {
	playOsc(100);
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
		var canvas = e.target;
		var x = e.offsetX,
			y = e.offsetY;


		$('#'canvas.id+'.xPos').val(x);
		$('#'+canvas.id+'.yPos').val(y);


		var freq = (x / canvas.width ) * (MAX_FREQ - MIN_FREQ)  + MIN_FREQ;
		
		changeFreq(freq);
		var amp = (canvas.height - y) / canvas.height;
		changeGain(amp);
		var rate = (canvas.height - y) / canvas.height * (MAX_RATE - MIN_RATE) + MIN_RATE;
		changeRate(rate);

	}

	function changeFreq(freq) {
		$('#freqSlider').val(freq);
		$('#freqNumberBox').val(freq);
		osc.frequency.linearRampToValueAtTime(freq, audioContext.currentTime + 0.02);
		frequency = freq;

	}

	function changeGain(amp) {
		$('#gainSlider').val(amp);
		$('#gainNumberBox').val(amp);
		gainNode.gain.linearRampToValueAtTime(amp, audioContext.currentTime + 0.02);
	}

	function changeRate(freq) {
		$('#rateSlider').val(freq);
		$('#rateNumberBox').val(freq);
		rate = freq;
	}

});


