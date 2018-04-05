const h = require("hdotjs");

module.exports = (state, onAction) => {

  const { currentProject } = state;
  const { tileset } = currentProject;

  let animation, frame = 0, playing = false;

  if (state.selectedAnimation) {
    animation = currentProject.animations[state.selectedAnimation];
  }

  const canvas = h("canvas");

  const image = new Image();
  const render = () => {
    if (animation) {
      const size = tileset.size * state.zoom;

      canvas.width = animation.w * size;
      canvas.height = animation.h * size;

      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        image,
        (animation.x + frame) * tileset.size,
        animation.y * tileset.size,
        animation.w * tileset.size,
        animation.h * tileset.size,
        0,
        0,
        animation.w * size,
        animation.h * size
      );
    }
  };
  image.onload = render;
  image.src = `file://${tileset.path}`;

  const play = () => {
    if (playing) {
      frame++;
      if (frame === animation.length) {
        frame = 0;
      }
      render();
      setTimeout(play, animation.millis);
    }
  };

  const form = () => {

    const updateAnimation = (input, fieldName) =>
      animation[fieldName] = parseInt(input.value, 10);

    const lengthInput = h("input", {
      attrs: { type: "number", value: animation.length },
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
      attrs: { type: "number", value: animation.millis },
      listeners: {
        blur: () => updateAnimation(millisInput, "millis"),
        keypress: ({ which }) => {
          if (which === 13) {
            updateAnimation(millisInput, "millis");
          }
        }
      }
    });

    return h("form", { children: [
      h("div", { children: [
        h("label", { content: "Length" }),
        lengthInput
      ]}),
      h("div", { children: [
        h("label", { content: "Frame time (millis)" }),
        millisInput
      ]})
    ]});
  };

  onAction((action, payload) => {
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
    }
  });

  return h("div", { attrs: { class: "animator" }, children: [
    canvas,
    form()
  ] });
};
