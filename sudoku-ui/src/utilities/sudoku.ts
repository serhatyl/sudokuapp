import {
  LEADERBOARD_LOCAL_STORAGE_KEY,
  LeaderboardEntry,
  RankEnum,
  SudokuBoard,
} from '../models';

const TOTAL_HINT_COUNT = 10;

const defaultState = {
  rank: RankEnum.Beginner,
  score: 0,
  remainingHint: 10,
  elapsedTime: 0,
  interval: 0,
  grid: [] as SudokuBoard,
  solvedGrid: [] as SudokuBoard,
  errorCells: new Set<string>(),
  prefilledCells: new Set<string>(),
  hintCells: new Set<string>(),
};

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

const getHint = (solvedGrid: SudokuBoard, grid: SudokuBoard) => {
  const emptyCells: { rowIndex: number; colIndex: number }[] = [];
  solvedGrid.forEach((row, rowIndex) => {
    row.forEach((_, colIndex) => {
      if (grid[rowIndex][colIndex] === undefined) {
        emptyCells.push({ rowIndex, colIndex });
      }
    });
  });

  if (emptyCells.length === 0)
    return { rowIndex: undefined, colIndex: undefined };
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const { rowIndex, colIndex } = emptyCells[randomIndex];
  grid[rowIndex][colIndex] = solvedGrid[rowIndex][colIndex];

  return {
    rowIndex,
    colIndex,
  };
};

const calculateFinalScore = (
  elapsedTime: number,
  score: number
): Promise<number> => {
  return new Promise((resolve) => {
    const scoreFromPartOne = score;
    const finalScore = scoreFromPartOne + (500 - elapsedTime);
    resolve(finalScore);
  });
};

const saveToLeaderboardLocalStorage = (score: number, name: string) => {
  const leaderboard: LeaderboardEntry[] = JSON.parse(
    localStorage.getItem('Leaderboard') || '[]'
  );
  leaderboard.push({ score, name });
  leaderboard.sort(
    (a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score
  );
  localStorage.setItem(
    LEADERBOARD_LOCAL_STORAGE_KEY,
    JSON.stringify(leaderboard)
  );
};

const getLeaderboardFromLocalStorage = (): LeaderboardEntry[] => {
  return JSON.parse(
    localStorage.getItem(LEADERBOARD_LOCAL_STORAGE_KEY) || '[]'
  );
};

export {
  fillAllCells,
  clearCells,
  getHint,
  calculateFinalScore,
  saveToLeaderboardLocalStorage,
  getLeaderboardFromLocalStorage,
  TOTAL_HINT_COUNT,
  defaultState,
};
