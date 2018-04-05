const h = require("hdotjs");

module.exports = (state, onAction, emit) => {

  const stopButton = h("button", {
    content: "Stop", 
    attrs: { type: "button", disabled: true },
    listeners: { click: () => {
      stopButton.disabled = true;
      playButton.disabled = false;
      emit("STOP");
    }}
  });

  const playButton = h("button", {
    content: "Play", 
    attrs: { type: "button" },
    listeners: { click: () => {
      stopButton.disabled = false;
      playButton.disabled = true;
      emit("PLAY");
    }}
  });

  return h("div", { children: [
    playButton,
    stopButton
  ]});
};
