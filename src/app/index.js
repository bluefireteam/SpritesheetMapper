const h = require("hdotjs");

const topbar = require("./components/topbar");
const animationBar = require("./components/animation-bar");
const animator = require("./components/animator");
const sidebar = require("./components/sidebar");

const state = {
  selectedTile: null,
  selectedAnimation: "torch",
  zoom: 3,
  currentProject: {
    animations: []
  }
};
const onActions = [];

const onAction = action => {
  onActions.push(action);
};

const emit = (type, payload) => {
  onActions.forEach(action => action(type, payload));
};

module.exports = () => {
  document.body.appendChild(
    h("div", { attrs: { class: "main" }, children: [
      h("div", { attrs: { class: "topbar-container" }, children: [
        topbar(state, onAction, emit)
      ]}),
      h("div", { attrs: { class: "main-containers" }, children: [
        h("div", { attrs: { class: "animation-bar-container" }, children: [
          animationBar(state, onAction, emit)
        ]}),
        h("div", { attrs: { class: "editor-container" }, children: [
          animator(state, onAction, emit)
        ]}),
        h("div", { attrs: { class: "sidebar-container" }, children: [
          sidebar(state, onAction, emit)
        ]})
      ]}),
    ]})
  );
};
