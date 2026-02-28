(function () {
  "use strict";
  class t extends AudioWorkletProcessor {
    process(e) {
      const s = e[0];
      return (
        s &&
          s.length > 0 &&
          s[0] &&
          s[0].length > 0 &&
          this.port.postMessage({ audioData: s[0], timestamp: Date.now() }),
        !0
      );
    }
  }
  registerProcessor("granola-talk-audio-capture-processor", t);
})();
//# sourceMappingURL=audioWorkletProcessor-D8Lg-s22.js.map
