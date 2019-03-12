const h = require("hdotjs");

module.exports = (state, onAction, emit) => {
  const selectAnimation = animation => {
    state.selectedAnimation = animation;
    emit("STOP");
    emit("SELECTED_ANIMATION", animation);
  };

  const renderAnimation = animation =>
    h("div", {
      attrs: { class: `animation-item${state.selectedAnimation === animation ? " selected": ""}` },
      content: animation,
      listeners: {
        click: function() {
          selectAnimation(this.innerText);
        }
      }
    });

  const list = h("div", {
    attrs: { class: "animator-bar" },
    children: Object.keys(state.currentProject.animations).map(renderAnimation)
  });

  onAction((action, payload) => {
    if (action === "NEW_ANIMATION") {
      list.appendChild(renderAnimation(payload));
    } else if (action === "SELECTED_ANIMATION") {
      document.querySelector(".animation-item.selected").classList.remove("selected");

      document.querySelectorAll(".animation-item").forEach(el => {
        if (el.innerText === payload) {
          el.classList.add("selected");
        }
      });
    } else if (action === "PROJECT_SELECTED") {
      const animations = Object.keys(state.currentProject.animations);

      if (animations.length) {
        list.innerHTML = "";
        animations
          .map(renderAnimation)
          .forEach(animation => list.appendChild(animation));

        selectAnimation(animations[0]);
      }
    }
  });

  return list;
};
