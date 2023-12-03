import React, { useState, useEffect } from 'react';
import "./GameBoard.css"

type GridValue = number | 0;

type GameOverType = {
  score: number,
}
const GameOver = ( props: GameOverType ) => {
  return <div className="game-over"></div>
}
type GameBoardType = {
  score?: (newScore: number) => void,
}

const GameBoard = (props: GameBoardType) => {


  // Function to add a '2' or a '4' in a random empty cell
  const [score, setScore] = useState(0);

  const [gameOver, setGameOver] = useState(false);


  const addRandomVal = (grid: GridValue[][]): void => {
    let emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] ===  0) {
          emptyCells.push([i, j]);
        }
      }
    }
    let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    console.log("random cell: " + randomCell);
    // props.score(randomCell);
    if (randomCell === undefined) {
      setGameOver(true);
      return;
    }
    let newGrid = [...grid];
    newGrid[randomCell[0]][randomCell[1]] = Math.random() > 0.5 ? 2 : 4;
  };

  const numberOfZeros = (grid: GridValue[][]): number => {
    let zeros = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) {
          zeros++;
        }
      }
    }
    return zeros;
  }

  // Function to initialize the grid
  const initializeGrid = (): Array<Array<GridValue>> => {
    let grid = Array(4).fill(0).map(() => Array(4).fill(0));
    addRandomVal(grid);
    addRandomVal(grid);
    return grid;
  };
  
  const [grid, setGrid] = useState<GridValue[][]>(() => initializeGrid());


  const deepCopyGrid = (grid: Array<Array<GridValue>>): Array<Array<GridValue>> => {
    return grid.map(row => [...row]);
  };

  //Iterate through all elements in first array
  const compareToGrid = (grid1: Array<Array<GridValue>>, grid2: Array<Array<GridValue>>) => {
    let md1 = grid1.map(row => row.map(cell => cell));
    let md2 = grid2.map(row => row.map(cell => cell));
    for(var x = 0; x < md1.length; x++){

      //Iterate through all elements in second array    
      for(var y = 0; y < md2.length; y++){

        /*This causes us to compare all elements 
          in first array to each element in second array
          Since md1[x] stays fixed while md2[y] iterates through second array.
          We compare the first two indexes of each array in conditional
        */
        if(md1[x][0] === md2[y][0] && md1[x][1] === md2[y][1]){
          return true;
        } else {
          return false;
        }
      }
    }
  }

  const shiftCellsRight = (arr: Array<GridValue>) => {
    // Filter out the zeros to compact the non-zero elements
    let nonZeroElements = arr.filter(el => el !== 0);

    // Process the non-zero elements for combination
    let result = [];
    for (let i = nonZeroElements.length - 1; i >= 0; i--) {
        if (i > 0 && nonZeroElements[i] === nonZeroElements[i - 1]) {
            // Combine equal elements and skip the next element
            const combined = nonZeroElements[i] * 2;
            if (props.score !== undefined)
              props.score(combined);
            result.unshift(combined);
            setScore(score + combined);
            i--; // Skip the next element as it's combined
        } else {
            // Move non-zero elements
            result.unshift(nonZeroElements[i]);
        }
    }

    // Pad with zeros to the left to maintain the original array length
    while (result.length < arr.length) {
        result.unshift(0);
    }

    return result;
  };

  const shiftCellsLeft = (arr: Array<GridValue>) => {
    // Filter out the zeros to compact the non-zero elements
    let nonZeroElements = arr.filter(el => el !== 0);

    // Process the non-zero elements for combination
    let result = [];
    let i = 0;
    while (i < nonZeroElements.length) {
        if (i < nonZeroElements.length - 1 && nonZeroElements[i] === nonZeroElements[i + 1]) {
            // Combine equal elements and skip the next element
            result.push(nonZeroElements[i] * 2);
            if ( props.score!== undefined ) {
              props.score(nonZeroElements[i] * 2)
            }
            i++; // Skip the next element as it's combined
        } else {
            // Move non-zero elements
            result.push(nonZeroElements[i]);
        }
        i++;
    }

    // Pad with zeros to the right to maintain the original array length
    while (result.length < arr.length) {
        result.push(0);
    }

    return result;
  };

  const transposeGrid = (grid: Array<Array<GridValue>>) => {
    return grid[0].map((_, colIndex) => grid.map(row => row[colIndex]));
  };
  
  useEffect(() => {
    // Define movement functions
    const moveLeft = () => {
      let copyGrid: Array<Array<GridValue>> = [...grid];
      copyGrid.forEach((row, rowIndex) => {
        let newRow = []
        newRow = shiftCellsLeft(copyGrid[rowIndex])
        copyGrid[rowIndex] = newRow
      })
      if (compareToGrid(grid, deepCopyGrid(copyGrid))) {
        addRandomVal(copyGrid);
      }
      setGrid(copyGrid)
    };

    const moveDown = () => {
      let newGrid: Array<Array<GridValue>> = deepCopyGrid(grid);
      newGrid = shiftGridDown(newGrid);
      if (compareToGrid(grid, deepCopyGrid(newGrid))) {
        addRandomVal(newGrid);
      }
      setGrid(newGrid)
    };

    const shiftGridUp = (grid: Array<Array<GridValue>>) => {
      let transposedGrid = transposeGrid(grid);
      let shiftedGrid = transposedGrid.map(shiftCellsLeft); // Assuming shiftCellsLeft shifts elements to the left
      return transposeGrid(shiftedGrid);
    };

    const shiftGridDown = (grid: Array<Array<GridValue>>) => {
        let transposedgrid = transposeGrid(grid);
        let shiftedGrid = transposedgrid.map(shiftCellsRight); // Assuming shiftCellsRight shifts elements to the right
        transposedgrid = transposeGrid(shiftedGrid); // Assuming shiftCellsRight shifts elements to the right
        return transposedgrid;
    };

    const moveRight = () => {
      let copyGrid: Array<Array<GridValue>> = deepCopyGrid(grid);
      copyGrid.forEach((row, rowIndex) => {
        let newRow = []
        newRow = shiftCellsRight(copyGrid[rowIndex])

        copyGrid[rowIndex] = newRow
      })
      if (compareToGrid(grid, deepCopyGrid(copyGrid))) {
        addRandomVal(copyGrid);
      }

      setGrid(copyGrid)
    };

    const moveUp = () => {
      let newGrid: Array<Array<GridValue>> = deepCopyGrid(grid);
      newGrid = shiftGridUp(newGrid);

      if (compareToGrid(grid, deepCopyGrid(newGrid))) {
        addRandomVal(newGrid);
      }
      setGrid(newGrid)
    };
    const handleKeyDown = (event: KeyboardEvent) => {

      switch (event.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            moveLeft();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          moveDown();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          moveRight();
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          moveUp();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [grid]);

  return (
    <div className='game-container'>
      <div className='game-grid'>
        {grid.map((row, i) => (
          <div key={i} className='grid-row'>
            {row.map((cell, j) => (
              <div className='cell' key={j} style={{  border: '1px solid black', textAlign: 'center', fontSize: cell.toString().length === 2 ? '1rem' : cell.toString().length === 3 ? '1rem' : cell.toString().length === 4 ? '1rem' : '1rem' }}>
                <span>{cell !== 0 ? cell : null}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      {gameOver? <GameOver score={score} /> : <></>}
    </div>
  );
};

export default GameBoard;
