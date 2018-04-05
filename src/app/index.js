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
    tileset: {
      path: "/home/erick/projetos/gamedev/tales/assets/tileset/tileset.png",
      size: 16
    },
    animations: {
      torch: {
        x: 3,
        y: 3,
        w: 1,
        h: 2,
        length: 4,
        millis: 500
      }
    }
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
