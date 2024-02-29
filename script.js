const parent = document.querySelector(".parent");
const coordinatesDisplay = document.querySelector(".coordinates");

const grid = document.querySelector(".grid");

const numColumns = 15;
const numRows = 10;

for (let i = 0; i < numRows; i++) {
  for (let j = 0; j < numColumns; j++) {
    const div = document.createElement("div");
    div.classList.add(`grid-item${j}${i}`);
    div.innerHTML = `<div>${j + 1}, ${i + 1}</div>`;
    grid.appendChild(div);
  }
}

function start() {

  let prevCell = {
    x: numColumns / 2,
    y: numRows / 2,
  };

  let startTime = new Date().getTime();

  parent.addEventListener("mousemove", (event) => {
    const { clientX, clientY } = event;
    const gridRect = grid.getBoundingClientRect();

    const offsetX = clientX - gridRect.left;
    const offsetY = clientY - gridRect.top;

    coordinatesDisplay.style.top = offsetY - 5 + "px";
    coordinatesDisplay.style.left = offsetX - 5 + "px";

    const cellWidth = gridRect.width / numColumns;
    const cellHeight = gridRect.height / numRows;

    const x = Math.floor(offsetX / cellWidth) + 1;
    const y = Math.floor(offsetY / cellHeight) + 1;

    if (x !== prevCell.x || y !== prevCell.y) {
      let endTime = new Date().getTime();
      let timeDiff = endTime - startTime;
      if (timeDiff > 2000) {
        console.log(prevCell.x, prevCell.y, timeDiff / 1000);
      }
      prevCell.x = x;
      prevCell.y = y;
      startTime = new Date().getTime();
    }
  });
}

function end(){
  parent.removeEventListener("mousemove", (event) => {} );
}