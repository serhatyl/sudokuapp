import { RankEnum, SudokuBoard } from '../models';

const checkNumberIsNotExist = (
  board: SudokuBoard,
  row: number,
  column: number,
  number: number
): boolean => {
  // NOTE - check 3x3 grid
  let startRow = Math.floor(row / 3) * 3;
  let startCol = Math.floor(column / 3) * 3;
  for (let x = startRow; x < startRow + 3; x++) {
    for (let y = startCol; y < startCol + 3; y++) {
      if (board[x][y] === number) return false;
    }
  }

  // NOTE - check row
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === number) {
      return false;
    }
  }

  // NOTE - check column
  for (let i = 0; i < 9; i++) {
    if (board[i][column] === number) {
      return false;
    }
  }

  return true;
};

const findEmptyCell = (board: SudokuBoard) => {
  return board
    .flatMap((row, rowIndex) =>
      row.map((cell, colIndex) => ({ rowIndex, colIndex, cell }))
    )
    .find(({ cell }) => cell === undefined);
};

const generateUniqueDigitsArray = () => {
  const digits: Array<number> = [];
  while (digits.length < 9) {
    const randomDigit = Math.floor(Math.random() * 9) + 1;
    if (!digits.includes(randomDigit)) {
      digits.push(randomDigit);
    }
  }
  return digits;
};

const clearCells = (
  board: SudokuBoard,
  difficulty: RankEnum | string
): SudokuBoard => {
  let visibleCellsRange: [number, number];

  switch (difficulty) {
    case RankEnum.Beginner:
      visibleCellsRange = [36, 40];
      break;
    case RankEnum.Intermediate:
      visibleCellsRange = [32, 36];
      break;
    case RankEnum.Hard:
      visibleCellsRange = [28, 32];
      break;
    case RankEnum.Expert:
      visibleCellsRange = [24, 28];
      break;
    default:
      throw new Error('Invalid difficulty level');
  }

  const totalCells = 81;
  const visibleCellsCount =
    Math.floor(
      Math.random() * (visibleCellsRange[1] - visibleCellsRange[0] + 1)
    ) + visibleCellsRange[0];

  const emptyCellsCount = totalCells - visibleCellsCount;
  console.log('empty cells count', emptyCellsCount);
  const availableCells: Array<{ row: number; col: number }> = [];

  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell !== 0) {
        availableCells.push({ row: rowIndex, col: colIndex });
      }
    });
  });

  const shuffledCells = availableCells.sort(() => Math.random() - 0.5);

  shuffledCells.slice(0, emptyCellsCount).forEach(({ row, col }) => {
    board[row][col] = undefined;
  });

  return board;
};

const fillAllCells = (board: SudokuBoard): boolean => {
  const emptyCell = findEmptyCell(board);
  if (!emptyCell) return true; // NOTE - all fields filled

  const { rowIndex, colIndex } = emptyCell;

  // NOTE - fill with unique number between 1 to 9
  return generateUniqueDigitsArray().some((num) => {
    if (checkNumberIsNotExist(board, rowIndex, colIndex, num)) {
      board[rowIndex][colIndex] = num;
      if (fillAllCells(board)) {
        return true;
      }
      board[rowIndex][colIndex] = undefined; // NOTE - backtrack algorithm
    }
    return false;
  });
};

export { fillAllCells, clearCells };
