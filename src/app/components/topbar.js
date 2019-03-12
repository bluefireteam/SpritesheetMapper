const fs = require("fs");
const dialogs = require("dialogs")();
const { dialog } = require("electron").remote;
const h = require("hdotjs");

module.exports = (state, onAction, emit) => {

  const newProject = h("button", {
    content: "Create project",
    attrs: { type: "button" },
    listeners: { click: () => {
      dialog.showSaveDialog((fileName) => {
        const project = {
          tileset: null,
          animations: {},
        };

        fs.writeFileSync(fileName, JSON.stringify(project), "utf8");

        state.projectPath = fileName;
        state.currentProject = project;

        onSelectProject();
        emit("PROJECT_SELECTED");
      });
    }}
  });

  const closeProject = h("button", {
    content: "Close project",
    attrs: { type: "button", style: "display: none"  },
    listeners: { click: () => {
      location.reload();
    }}
  });

  const openProject = h("button", {
    content: "Open project",
    attrs: { type: "button" },
    listeners: { click: () => {
      dialog.showOpenDialog(([ fileName ]) => {
        const file = fs.readFileSync(fileName, "utf8", fileName);

        const project = JSON.parse(file);
        state.projectPath = fileName;
        state.currentProject = project;

        onSelectProject();
        emit("PROJECT_SELECTED");
      });
    }}
  });

  const saveProject = h("button", {
    content: "Save project",
    attrs: { type: "button", style: "display: none"  },
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
    attrs: { type: "button", style: "display: none"  },
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
    attrs: { type: "button", disabled: true, style: "display: none"  },
    listeners: { click: () => {
      emit("STOP");
    }}
  });

  const playButton = h("button", {
    content: "Play",
    attrs: { type: "button", style: "display: none" },
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

  const onSelectProject = () => {
    addAnimation.style.display = "inline";
    saveProject.style.display = "inline";
    closeProject.style.display = "inline";
    playButton.style.display = "inline";
    stopButton.style.display = "inline";

    openProject.style.display = "none";
    newProject.style.display = "none";
  };

  return h("div", { children: [
    newProject,
    closeProject,
    openProject,
    saveProject,
    h("span", { content: "|" }),
    addAnimation,
    playButton,
    stopButton
  ]});
};
