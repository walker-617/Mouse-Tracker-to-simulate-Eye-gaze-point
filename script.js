// Creating grid
const grid = document.getElementById("grid");
const gridRect = grid.getBoundingClientRect();

const numColumns = 10;
const numRows = 15;
const fixationTime = 500;

const cellWidth = gridRect.width / numColumns;
const cellHeight = gridRect.height / numRows;

function createGrid() {
  grid.style.gridTemplateColumns = `repeat(${numColumns}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${numRows}px, 1fr)`;
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numColumns; j++) {
      const div = document.createElement("div");
      div.classList.add(`grid-item${j}${i}`);
      grid.appendChild(div);
    }
  }
}

// Initial parameters
let prevCoordinates = {
  x: numColumns / 2,
  y: numRows / 2,
};

let startTime;

// Start
function init() {
  let coordinates = [];

  function startMouseTracking() {
    startTime = new Date().getTime();
    const parent = document.getElementById("parent");
    parent.addEventListener("mousemove", (event) =>
      handleMouseMove(coordinates, event)
    );
  }

  function endMouseTracking() {
    const parent = document.getElementById("parent");
    parent.removeEventListener("mousemove", handleMouseMove);
    window.location.href =
      "/MousePath.html?coordinates=" +
      encodeURIComponent(JSON.stringify(coordinates));
  }

  return {
    startMouseTracking: startMouseTracking,
    endMouseTracking: endMouseTracking,
  };
}

// Storing current cell
function handleMouseMove(coordinates, event) {
  const { clientX, clientY } = event;

  const offsetX = clientX - gridRect.left;
  const offsetY = clientY - gridRect.top;

  const coordinatesDisplay = document.querySelector(".coordinates");
  coordinatesDisplay.style.top = offsetY + "px";
  coordinatesDisplay.style.left = offsetX + "px";

  const x = Math.floor(offsetX / cellWidth);
  const y = Math.floor(offsetY / cellHeight);

  if (x !== prevCoordinates.x || y !== prevCoordinates.y) {
    let endTime = new Date().getTime();
    let timeDiff = endTime - startTime;
    if (timeDiff > fixationTime) {
      coordinates.push({
        x: prevCoordinates.x,
        y: prevCoordinates.y,
        time: timeDiff / 1000,
      });
    }
    prevCoordinates.x = x;
    prevCoordinates.y = y;
    startTime = new Date().getTime();
  }
}

// Drawing canvas
function draw(coordinates) {
  const parent = document.getElementById("parent");
  const canvas = document.getElementById("canvas");
  const parRect = parent.getBoundingClientRect();
  canvas.width = parRect.width;
  canvas.height = parRect.height;
  const ctx = canvas.getContext("2d");

  function addPoint(x, y) {
    const point = document.createElement("div");
    point.classList.add("fixation-points");
    point.style.top = y + "px";
    point.style.left = x + "px";
    parent.appendChild(point);
  }

  if (coordinates.length > 0) {
    const x0 = coordinates[0].x * cellWidth + cellWidth / 2;
    const y0 = coordinates[0].y * cellHeight + cellHeight / 2;
    addPoint(x0,y0);
    ctx.moveTo(x0, y0);
    for (let i = 1; i < coordinates.length; i++) {
      // const time = coordinates[i].time;
      const x = coordinates[i].x * cellWidth + cellWidth / 2;
      const y = coordinates[i].y * cellHeight + cellHeight / 2;
      addPoint(x,y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }
}
