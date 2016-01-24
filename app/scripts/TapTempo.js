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
