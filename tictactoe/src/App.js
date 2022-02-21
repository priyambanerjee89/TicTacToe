import logo from "./logo.svg";
import "./App.css";
import { useReducer } from "react";

export default function App() {
  return (
    <div>
      <header>
        <h1>Tic Tac Toe in React</h1>
      </header>
      <Game />
    </div>
  );
}

const clone = (x) => JSON.parse(JSON.stringify(x));

function generateGrid(rows, columns, mapper) {
  return Array(rows)
    .fill()
    .map(() => Array(columns).fill().map(mapper));
}

const ticTacToeGrid = () => generateGrid(3, 3, () => null);

function checkThree(a, b, c) {
  if (!a || !b || !c) return false;
  return a === b && b === c;
}

function checkForWin(grid) {
  const [nw, n, ne, w, c, e, sw, s, se] = grid;
  return (
    checkThree(nw, n, ne) ||
    checkThree(w, c, e) ||
    checkThree(sw, s, se) ||
    checkThree(nw, w, sw) ||
    checkThree(n, c, s) ||
    checkThree(ne, e, se) ||
    checkThree(nw, c, se) ||
    checkThree(ne, c, sw)
  );
}

function checkForDraw(grid) {
  return !checkForWin(grid) && grid.filter(Boolean).length === grid.length;
}

const NEXT_TURN = {
  O: "X",
  X: "O",
};

const getInitialState = () => ({
  grid: ticTacToeGrid(),
  turn: "X",
  status: "inProgress",
});

const reducer = (state, action) => {
  if (state.status === "success" && action.type !== "RESET") {
    return state;
  }
  switch (action.type) {
    case "CLICK":
      const { x, y } = action.payload;
      const { grid, turn } = state;
      if (grid[x][y]) return state;
      const nextState = clone(state);
      nextState.grid[x][y] = turn;
      let flatGrid = nextState.grid.flat();
      if (checkForWin(flatGrid)) {
        nextState.status = "success";
        return nextState;
      }

      if (checkForDraw(flatGrid)) {
        return getInitialState();
      }
      nextState.turn = NEXT_TURN[turn];
      return nextState;

    case "RESET":
      return getInitialState();
    default:
      return state;
  }
};

function Game() {
  const [state, dispatch] = useReducer(reducer, getInitialState());
  const { grid, status, turn } = state;
  const handleClick = (x, y) => {
    dispatch({ type: "CLICK", payload: { x, y } });
  };

  const reset = () => {
    dispatch({ type: "RESET" });
  };
  return (
    <div style={{ display: "inline-block" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>Next turn: {turn}</div>
        <div>{status === "success" ? `${turn} won!` : null}</div>
        <button onClick={reset} type="button">
          Reset
        </button>
      </div>
      <div>
        <Grid grid={grid} onClick={handleClick} />
      </div>
    </div>
  );
}

function Grid({ grid, onClick }) {
  return (
    <div style={{ display: "inline-block" }}>
      <div
        style={{
          display: "grid",
          gridTemplateRows: `repeat(${grid.length}, 1fr)`,
          gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
          gridGap: 2,
          backgroundColor: "#444",
        }}
      >
        {grid.map((row, rowIdx) =>
          row.map((value, colIdx) => (
            <Cell
              onClick={() => onClick(rowIdx, colIdx)}
              key={`${rowIdx}-${colIdx}`}
              value={value}
            />
          ))
        )}
      </div>
    </div>
  );
}

function Cell({ value, onClick }) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        width: 100,
        height: 100,
      }}
    >
      <button
        onClick={onClick}
        style={{ width: "100%", height: "100%" }}
        type="button"
      >
        {value}
      </button>
    </div>
  );
}
