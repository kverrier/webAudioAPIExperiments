	var MAX_FREQ = 1200,
	MIN_FREQ = 20;

	var MAX_GAIN = 1,
	MIN_GAIN = 0;

	var MAX_RATE = 2,
	MIN_RATE = 0.25;


	var MAX_DURATION = 2;

var audioContext = 0 ;
var gainNodeMaster = 0;



var osc1 = 0;

var gN = 0;


function repeatingOsc () {


	var gainNode = 0;
	var osc = 0;

	var frequency = 440;
	var gain = 0.5;
	var duration = 0.5;
	var rate = 2;
	var isPlaying = false;

	var timer = null;

	var recurse = 0;

	gainNode = audioContext.createGainNode();
	gainNode.gain.value = 0.25;
	gainNode.connect(audioContext.destination);


	this.playOsc = function() {
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
	};

	this.toggle = function() {
		isPlaying ? this.stopLoop() : this.startLoop();
		isPlaying = !isPlaying;
	};

	this.startLoop = function() {
		this.playOsc();
		recurse = arguments.callee;
		timer = setTimeout(function(oscObj) {
			oscObj.startLoop();
		}, rate * 1000, this);
	};


	this.stopLoop = function() {
		clearTimeout(timer);
	};

	this.changeFreq = function(freq) {
		osc.frequency.linearRampToValueAtTime(freq, audioContext.currentTime + 0.02);
		frequency = freq;
	};

	this.changeGain = function(amp) {
		gainNode.gain.linearRampToValueAtTime(amp, audioContext.currentTime + 0.02);
	};

	this.changeRate = function (freq) {
		rate = freq;
	}; 

	this.changeType = function (type) {

	};

}


function setUpAudioContext() {
	audioContext = new webkitAudioContext();

}




$(document).ready(function() {
	setUpAudioContext();
	osc1 = new repeatingOsc();
	osc2 = new repeatingOsc();
	osc3 = new repeatingOsc();
	osc4 = new repeatingOsc();




	$("#togglePlay1").click(function(e) {
		var $toggle = $('#togglePlay1');
		var toggleState = $toggle.val();

		if (toggleState === 'STOP') {
			$toggle.val('PLAY');
		} else {
			$toggle.val('STOP');
		}
		osc1.toggle();
		osc2.toggle();
	});

	$("#togglePlay2").click(function(e) {
		var $toggle = $('#togglePlay2');
		var toggleState = $toggle.val();

		if (toggleState === 'STOP') {
			$toggle.val('PLAY');
		} else {
			$toggle.val('STOP');
		}
		osc3.toggle();
		osc4.toggle();
	});


	$("#freqSlider1").change(function(e) {
		var freq = e.target.value;
		$("#freqNumberBox1").val(freq);
		osc1.changeFreq(freq);
	});

	$("#freqSlider2").change(function(e) {
		var freq = e.target.value;
		$("#freqNumberBox2").val(freq);
		osc2.changeFreq(freq);
	});


	$("#freqSlider3").change(function(e) {
		var freq = e.target.value;
		$("#freqNumberBox3").val(freq);
		osc2.changeFreq(freq);
	});

	$("#freqSlider4").change(function(e) {
		var freq = e.target.value;
		$("#freqNumberBox4").val(freq);
		osc4.changeFreq(freq);
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
			// osc1.stopLoop();
			// osc2.stopLoop();
		}
	});

	$('.xy-pad').mouseup(function(e){
		// osc1.startLoop();
		// osc2.startLoop();
	});


	function handleClick(e) {
		var x = e.offsetX,
			y = e.offsetY;

		var canvas = e.target;


		var xRate = (canvas.height - x) / canvas.width * (MAX_RATE - MIN_RATE) + MIN_RATE;
		var yRate = (canvas.height - y) / canvas.height * (MAX_RATE - MIN_RATE) + MIN_RATE;

		console.log(canvas.id == 'xy-pad2');

		switch (canvas.id) {
		case 'xy-pad1':
			$('#xPos1').val(x);
			$('#yPos1').val(y);
			osc1.changeRate(xRate);
			osc2.changeRate(yRate);
			break;
		case 'xy-pad2':
			$('#xPos2').val(x);
			$('#yPos2').val(y);
			osc3.changeRate(xRate);
			osc4.changeRate(yRate);
			break;
		}
	}

	function changeFreq(freq) {
		$('#freqSlider').val(freq);
		$('#freqNumberBox').val(freq);
		osc1.changeFreq(freq);

	}

	function changeGain(amp) {
		$('#gainSlider').val(amp);
		$('#gainNumberBox').val(amp);
		// osc1.changeGain(amp);
	}

	function changeRate(freq) {
		$('#rateSlider').val(freq);
		$('#rateNumberBox').val(freq);
		rate = freq;
	}

});


