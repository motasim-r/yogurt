(function(){"use strict";class e extends AudioWorkletProcessor{process(t){const s=t[0];return s&&s.length>0&&s[0]&&s[0].length>0&&this.port.postMessage({audioData:s[0],timestamp:Date.now()}),!0}}registerProcessor("audio-capture-processor",e)})();
//# sourceMappingURL=audioWorkletProcessor-DAtn4gQK.js.map
