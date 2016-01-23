/*!
 *
 *  Tap Tempo
 *  Copyright 2015 Justin Varghese John
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

var a = new AudioContext() || new webkitAudioContext();
var m = new Metro(a);
console.dir(m);
m.init();

$('#fab').on('click', function() {
	if(m.isPlaying) {
		$('#fab i').text('play_arrow');
	} else {
		$('#fab i').text('pause');
	}
	m.play();
});


var TapTempo = (function() {
	function TapTempo() {
		this.taps = [];
		this.isRecording = false;
	}

	TapTempo.prototype.recordTime = function() {
		var date = new Date();
		var time = date.getTime();
		console.log(time);
		this.taps.push(time);
		this.isRecording = true;
	};

	TapTempo.prototype.getBpm = function() {
		var deltas = this.getDeltas();
		return this.calculateBpm(deltas);
	};

	TapTempo.prototype.clearTimes = function() {
		this.taps = [];
		this.isRecording = false;
	};

	TapTempo.prototype.getDeltas = function() {
		var deltas = [];
		for(var i = 0; i < this.taps.length - 1; i++) {
			var delta = this.taps[i+1] - this.taps[i];
			deltas.push(delta);
		}
		return deltas;
	};

	TapTempo.prototype.calculateBpm = function(deltas) {
		var sum = 0;
		var average;
		for(var delta in deltas) {
			sum += deltas[delta];
		}
		average = sum / deltas.length;

		return (60000 / average);
	};

	TapTempo.prototype.isRecording = function() {
		return this.isRecording;
	};

	return TapTempo;

})();


var timer = {
  reset: function() {
  	console.log('reset');
    this.stop();
    this.start();
  },

  start: function() {
    this.stop();
    var self = this;
    this.timeoutID = window.setTimeout( function() {
    	self.stop();
    	tapTempo.clearTimes();
			$('.mdl-layout__content').removeClass('animate-calculate');
			$('.mdl-layout__content').addClass('animate-reset');
			$('#reset-message').removeClass('show');
			$('#bpm').text('---');
    }, 3000);
  },

  stop: function() {
    if(typeof this.timeoutID == "number") {
      window.clearTimeout(this.timeoutID);
      delete this.timeoutID;
    }
  }
};

document.querySelector('.tapper').addEventListener('touchstart', handleTap ,false);
document.querySelector('.tapper').addEventListener('click', handleTap ,false);

var tapTempo = new TapTempo();

function handleTap(event) {
	event.preventDefault();
	console.log(event);
	tapTempo.recordTime();
	timer.reset();
	updateView();
}

function updateView() {
	if(tapTempo.taps.length > 2) {
		var bpm = Math.round(tapTempo.getBpm());
		m.updateTempo(bpm);
		$('#bpm').text(bpm);
		$('#reset-message p ').text('to reset please wait 3 seconds');
	}
	else if(tapTempo.taps.length == 0) {
		$('#bpm').text('---');
	}
	else if(tapTempo.taps.length == 1) {
		$('.mdl-layout__content').removeClass('animate-reset');
		$('.mdl-layout__content').addClass('animate-calculate');
		$('#reset-message p').text('tap again');
		$('#reset-message').addClass('show');
	}
	else {
		$('#reset-message p').text('tap once more');
	}
}

function visualizeTap() {

}
