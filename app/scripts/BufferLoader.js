/*!
 *
 *  justinvarghesejohn.com
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

class BufferLoader {

    constructor(audioContext, urlList, callback) {
        this.audioContext = audioContext;
        this.urlList = urlList;
        this.onload = callback;
        this.bufferList = new Array();
        this.loadCount = 0;
    }

    _loadBuffer(url, index) {
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        request.onload = function() {
            this.audioContext.decodeAudioData(
                request.response,
                function(buffer) {
                    if (!buffer) {
                        alert('error decoding file data: ' + url);
                        return;
                    }
                    this.bufferList[index] = buffer;
                    if (++this.loadCount == this.urlList.length)
                        this.onload(this.bufferList);
                }
            );
        }
        request.onerror = function() {
            alert('BufferLoader: XHR error');
        }

        request.send();
    }

    load() {
        for (var i = 0; i < this.urlList.length; ++i)
            this._loadBuffer(this.urlList[i], i);
    }
}
