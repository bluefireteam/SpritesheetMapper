const h = require("hdotjs");

module.exports = (state, onAction) => {
  const tileset = () => state.currentProject.tileset;
  const getAnimation = () => state.currentProject.animations[state.selectedAnimation];

  let frame = 0, playing = false;

  const canvas = h("canvas");

  const image = new Image();
  const render = () => {
    const animation = getAnimation();
    if (animation) {
      const size = tileset().size * state.zoom;

      canvas.width = animation.w * size;
      canvas.height = animation.h * size;

      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        image,
        (animation.x + (frame * animation.w)) * tileset().size,
        animation.y * tileset().size,
        animation.w * tileset().size,
        animation.h * tileset().size,
        0,
        0,
        animation.w * size,
        animation.h * size
      );
    }
  };

  const load = () => {
    image.src = `file://${tileset().path}`;
  };

  if (tileset()) {
    image.onload = render;
    load();
  }

  const play = () => {
    const animation = getAnimation();
    if (playing) {
      frame++;
      if (frame === animation.length) {
        frame = 0;
      }
      render();

      const millis = Array.isArray(animation.millis)
        ? animation.millis[frame]
        : animation.millis;

      setTimeout(play, millis);
    }
  };

  const updateLength = value =>
    getAnimation().length = parseInt(value, 10);

  const lengthInput = h("input", {
    attrs: { type: "number", value: getAnimation() ? getAnimation().length : 0 },
    listeners: {
      blur: () => updateLength(lengthInput.value),
      keypress: ({ which }) => {
        if (which === 13) {
          updateLength(lengthInput.value);
        }
      }
    }
  });

  const updateMillis = input => {
    const value = input.value;

    input.style.borderColor = "";

    if (/^\d+$/.test(value)) {
      getAnimation().millis = parseInt(value, 10);
    } else if (/^(( )?\d( )?(,)?)+$/.test(value)) {
      const values =
        value.split(",")
          .map(value => value.replace(/ /g, ""))
          .filter(value => value !== "")
          .map(value => parseInt(value, 10));

      getAnimation().millis = values;
    } else {
      input.style.borderColor = "#ff0000";
    }
  };

  const millisInput = h("input", {
    attrs: { type: "input", value: getAnimation() ? getAnimation().millis : 0 },
    listeners: {
      blur: () => updateMillis(millisInput),
      keypress: ({ which }) => {
        if (which === 13) {
          updateMillis(millisInput);
        }
      }
    }
  });

  const form = h("form", { children: [
    h("div", { children: [
      h("label", { content: "Length" }),
      lengthInput
    ]}),
    h("div", { children: [
      h("label", { content: "Frame time (millis)" }),
      millisInput
    ]})
  ]});

  onAction((action, payload) => {
    const animation = getAnimation();
    if (action == "TILE_SELECTED") {
      Object.assign(animation, payload);
      render();
    } else if (action == "PLAY") {
      playing = true;
      setTimeout(play, animation.millis);
    } else if (action == "STOP") {
      playing = false;
      frame = 0;
      render();
    } else if (action == "SELECTED_ANIMATION") {
      lengthInput.value = animation.length;
      const value = Array.isArray(animation.millis) ? animation.millis.join(",") : animation.millis;

      millisInput.value = value;
      render();
    } else if ((action == "TILESET_CHANGED" || action == "PROJECT_SELECTED") && tileset()) {
      load();
    }
  });

  return h("div", { attrs: { class: "animator" }, children: [
    canvas,
    form
  ] });
};
