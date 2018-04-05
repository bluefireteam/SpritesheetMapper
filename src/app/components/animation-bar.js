const h = require("hdotjs");

module.exports = (state, onAction, emit) => {
  let { selectedAnimation } = state;
  const { animations } = state.currentProject;

  const renderAnimation = animation =>
    h("div", {
      attrs: { class: `animation-item${selectedAnimation === animation ? " selected": ""}` },
      content: animation 
    });

  return h("div", {
    attrs: { class: "animator-bar" },
    children: Object.keys(animations).map(renderAnimation)
  });
};
