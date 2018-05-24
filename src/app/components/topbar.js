const fs = require("fs");
const dialogs = require("dialogs")();
const { dialog } = require("electron").remote;
const h = require("hdotjs");

module.exports = (state, onAction, emit) => {

  const openProject = h("button", {
    content: "Open project",
    attrs: { type: "button" },
    listeners: { click: () => {
      dialog.showOpenDialog(([ fileName ]) => {
        const file = fs.readFileSync(fileName, "utf8", fileName);

        const project = JSON.parse(file);
        state.projectPath = fileName;
        state.currentProject = project;

        emit("PROJECT_SELECTED");
      });
    }}
  });

  const saveProject = h("button", {
    content: "Save project",
    attrs: { type: "button" },
    listeners: { click: () => {
      if (state.projectPath) {
        fs.writeFileSync(
          state.projectPath,
          JSON.stringify(state.currentProject, null, 2)
        );
        alert("Project saved!");
      } else {
        alert("No project opened");
      }
    }}
  });

  const addAnimation = h("button", {
    content: "Add Animation",
    attrs: { type: "button" },
    listeners: { click: () => {
      dialogs.prompt("Animation name:", "", name => {
        state.currentProject.animations[name] = {
          x: 0, y: 0, w: 0, h: 0, length: 0, millis: 0
        };
        state.selectedAnimation = name;

        emit("NEW_ANIMATION", name);
        emit("SELECTED_ANIMATION", name);
      });
    }}
  });

  const stopButton = h("button", {
    content: "Stop",
    attrs: { type: "button", disabled: true },
    listeners: { click: () => {
      emit("STOP");
    }}
  });

  const playButton = h("button", {
    content: "Play",
    attrs: { type: "button" },
    listeners: { click: () => {
      emit("PLAY");
    }}
  });

  onAction(action => {
    if (action === "PLAY") {
      stopButton.disabled = false;
      playButton.disabled = true;
    } else if (action === "STOP") {
      stopButton.disabled = true;
      playButton.disabled = false;
    }
  });

  return h("div", { children: [
    openProject,
    saveProject,
    h("span", { content: "|" }),
    addAnimation,
    playButton,
    stopButton
  ]});
};
