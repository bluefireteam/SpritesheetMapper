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
      setTimeout(play, animation.millis);
    }
  };

  const updateAnimation = (input, fieldName) =>
    getAnimation()[fieldName] = parseInt(input.value, 10);

  const lengthInput = h("input", {
    attrs: { type: "number", value: getAnimation() ? getAnimation().length : 0 },
    listeners: {
      blur: () => updateAnimation(lengthInput, "length"),
      keypress: ({ which }) => {
        if (which === 13) {
          updateAnimation(lengthInput, "length");
        }
      }
    }
  });

  const millisInput = h("input", {
    attrs: { type: "number", value: getAnimation() ? getAnimation().millis : 0 },
    listeners: {
      blur: () => updateAnimation(millisInput, "millis"),
      keypress: ({ which }) => {
        if (which === 13) {
          updateAnimation(millisInput, "millis");
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
      millisInput.value = animation.millis;
      render();
    } else if (action == "PROJECT_SELECTED") {
      load();
    }
  });

  return h("div", { attrs: { class: "animator" }, children: [
    canvas,
    form
  ] });
};
