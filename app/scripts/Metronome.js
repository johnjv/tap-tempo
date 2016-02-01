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

class Metronome {

    constructor(audioContext) {
        this.audioContext = audioContext;
        this.isPlaying = false;
        this.tempo = 120; // TODO: allow for this to be overriden
        this.lookahead = 25.0;
        this.current16thNote = 0; // What note is currently last scheduled?
        this.scheduleAheadTime = 0.1;
        this.nextNoteTime = 0.0;
        this.noteResolution = 0;
        this.noteLength = 0.05;
        this.notesInQueue = [];
        this.timerWorker = null;
    }

    // Advance current note and time by a 16th note...
    // Notice this picks up the CURRENT
    // tempo value to calculate beat length.
    // Add beat length to last beat time
    _nextNote() {
      let secondsPerBeat = 60.0 / this.tempo;
      this.nextNoteTime += 0.25 * secondsPerBeat;
      this.current16thNote++;    // Advance the beat number, wrap to zero
      if (this.current16thNote === 16) {
          this.current16thNote = 0;
      }
    }

    //check current beat to see if there is a note to play
    //if so create osc and schedule to play for beat
    _scheduleNote(beatNumber, time) {
      // push the note on the queue, even if we're not playing.
      this.notesInQueue.push( { note: beatNumber, time: time } );

      if ( (this.noteResolution === 1) && (beatNumber%2)) {
        return; // we're not playing non-8th 16th notes
      }
      if ( (this.noteResolution === 2) && (beatNumber%4)) {
        return; // we're not playing non-quarter 8th notes
      }
      if( (beatNumber%4 !== 0)) {
        return;
      }

      // create an oscillator
      let osc = this.audioContext.createOscillator();
      osc.connect( this.audioContext.destination );
      // if (beatNumber % 16 === 0)    // beat 0 == low pitch
      //     osc.frequency.value = 880.0;
      if (beatNumber % 4 === 0 ) {  // quarter notes = medium pitch
        osc.frequency.value = 220.0;
      }
      else { // other 16th notes = high pitch
          osc.frequency.value = 220.0;
      }
      osc.start( time );
      osc.stop( time + this.noteLength );
    }

    _scheduler() {
        // while there are notes that will need to play before the next interval,
        // schedule them and advance the pointer.
        while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime ) {
            this._scheduleNote(this.current16thNote, this.nextNoteTime);
            this._nextNote();
        }
    }

    play() {
        this.isPlaying = !this.isPlaying;

        if (this.isPlaying) { // start playing
            this.current16thNote = 0;
            this.nextNoteTime = this.audioContext.currentTime;
            this.timerWorker.postMessage('start');
            return 'stop';
        } else {
            this.timerWorker.postMessage('stop');
            return 'play';
        }
    }

    init() {
      let self = this;
      this.timerWorker = new Worker('scripts/workers/metronomeworker.js');

      this.timerWorker.onmessage = function(event) {
          if (event.data === 'tick') {
            // console.log("tick!");
            self._scheduler();
          }
          else {
            console.log('message: ' + event.data);
          }
      };
      this.timerWorker.postMessage({'interval':this.lookahead});
    }

    updateTempo(tempo) {
      this.tempo = tempo;
    }

}
