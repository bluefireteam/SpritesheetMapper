const h = require("hdotjs");
module.exports = (state, onAction, emit) => {
  let { tileset }  = state.currentProject;

  let selectedTile = { x: 0, y: 0 };
  
  const drawGrid = (ctx, image, size, selectedTile) => {
    ctx.drawImage(image, 0, 0, image.width * state.zoom, image.height * state.zoom);
  
    const { width, height } = image;
  
    const lines = height * state.zoom / size;
    const columns = width * state.zoom / size;
  
    ctx.strokeStyle = "#999";
    for (let y = 0; y < lines; y++) {
      for (let x = 0; x < columns; x++) {
        ctx.strokeRect(x * size, y * size, size, size);
      }
    }
  
    ctx.strokeStyle = "#000";
    ctx.strokeRect(
      selectedTile.x * size,
      selectedTile.y * size,
      selectedTile.w * size,
      selectedTile.h * size
    );
  };
  
  const tilesetBoard = () => {
    const div = h("div", { content: "No tileset selected" });

    const image = new Image();
    image.onload = () => {
      const size = tileset.size * state.zoom;

      const canvas = h("canvas", { attrs: {
        width: image.width * state.zoom,
        height: image.height * state.zoom
      }});
  
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      drawGrid(ctx, image, size, selectedTile);
  
      div.innerHTML = "";
      div.appendChild(canvas);
  
  
      let startPos;
  
      canvas.addEventListener("mousedown", ({ offsetX, offsetY }) => {
        startPos = {
          x: Math.floor(offsetX / size),
          y: Math.floor(offsetY / size)
        };
      });
  
      canvas.addEventListener("mouseup", ({ offsetX, offsetY }) => {
        selectedTile = Object.assign({}, startPos, {
          w: (Math.floor(offsetX / size) - startPos.x) + 1,
          h: (Math.floor(offsetY / size) - startPos.y) + 1
        });
  
        drawGrid(ctx, image, size, selectedTile);
        emit("TILE_SELECTED", selectedTile);
      });
    };

    const load = () => {
      image.src = `file://${tileset.path}`;
    };

    if (tileset) {
      load();
    }

    onAction(action => {
      if (action == "PROJECT_SELECTED") {
        tileset = state.currentProject.tileset;
        load();
      }
    });

    return div;
  };

  return h("div", { attrs: { class: "sidebar" }, children: [
    tilesetBoard()
  ] });
};
