/*!
 *
 *  Tap Tempo
 *  Copyright 2016 Justin Varghese John
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

window.AudioContext = window.AudioContext || window.webkitAudioContext;
var a = new AudioContext() || new webkitAudioContext();
var m = new Metronome(a);
m.init();

document.getElementById('fab').addEventListener('click', function() {
	let icon = document.querySelector('#fab i');
	if(m.isPlaying) {
		icon.textContent = 'play_arrow';
	} else {
		icon.textContent = 'pause';
	}
	m.play();
});





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
			document.querySelector('.mdl-layout__content').classList.remove('animate-calculate');
			document.querySelector('.mdl-layout__content').classList.add('animate-reset');
			document.querySelector('#reset-message').classList.remove('show');
			document.querySelector('#bpm').textContent = '---';
    }, 2000);
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
		document.querySelector('#bpm').textContent = bpm;
		document.querySelector('#bpm-time').textContent = bpm;
		document.querySelector('#reset-message p ').textContent = 'to reset please wait 2 seconds';
	}
	else if(tapTempo.taps.length == 0) {
		document.querySelector('#bpm').textContent = '---';
	}
	else if(tapTempo.taps.length == 1) {
		document.querySelector('.mdl-layout__content').classList.remove('animate-reset');
		document.querySelector('.mdl-layout__content').classList.add('animate-calculate');
		document.querySelector('#reset-message p').textContent = 'tap again';
		document.querySelector('#reset-message').classList.add('show');
	}
	else {
		document.querySelector('#reset-message p').textContent = 'tap once more';
	}
}

function visualizeTap() {

}
