import { defineStore } from 'pinia';
import { fillAllCells, clearCells } from '../utilities/sudoku';
import { SudokuBoard, RankEnum } from '../models';

export const useSudokuStore = defineStore('sudoku', {
  state: () => ({
    rank: RankEnum.Beginner,
    score: 0,
    remainingHint: 10,
    elapsedTime: 0,
    interval: 0,
    grid: [] as SudokuBoard,
    solvedGrid: [] as SudokuBoard,
    errorCells: new Set<string>(),
    prefilledCells: new Set<string>(),
  }),
  actions: {
    changeScore(score: number) {
      this.score = score;
    },
    reduceRemainingHint() {
      if (this.remainingHint > 0) {
        this.remainingHint -= 1;
      }
    },
    generateSudoku(difficulty: RankEnum) {
      const emptyBoard: SudokuBoard = Array.from({ length: 9 }, () =>
        Array(9).fill(undefined)
      );
      fillAllCells(emptyBoard);
      this.solvedGrid = JSON.parse(JSON.stringify(emptyBoard));
      this.grid = clearCells(
        JSON.parse(JSON.stringify(this.solvedGrid)),
        difficulty
      );
      this.resetTimer();
    },
    clearCell(row: number, col: number) {
      if (this.grid[row] && typeof this.grid[row][col] !== 'undefined') {
        this.grid[row][col] = undefined;
      }
    },
    setCell(row: number, col: number, value: number) {
      if (
        this.grid[row] &&
        typeof this.grid[row][col] !== 'undefined' &&
        value >= 1 &&
        value <= 9
      ) {
        this.grid[row][col] = value;
      }
    },
    resetGrid() {
      this.grid = clearCells(
        JSON.parse(JSON.stringify(this.solvedGrid)),
        RankEnum.Beginner
      );
    },
    clearGrid() {
      this.grid = Array.from({ length: 9 }, () => Array(9).fill(undefined));
    },
    isGridSolved(): boolean {
      return JSON.stringify(this.grid) === JSON.stringify(this.solvedGrid);
    },
    startTimer() {
      if (this.interval) return;
      this.interval = setInterval(() => {
        this.elapsedTime++;
      }, 1000);
    },
    stopTimer() {
      if (this.interval) {
        this.elapsedTime = 0;
        clearInterval(this.interval);
        this.interval = 0;
      }
    },
    resetTimer() {
      this.stopTimer();
      this.elapsedTime = 0;
      this.startTimer();
    },
    setCellError(rowIndex: number, colIndex: number) {
      this.errorCells.add(`${rowIndex}-${colIndex}`);
    },
    clearCellError(rowIndex: number, colIndex: number) {
      this.errorCells.delete(`${rowIndex}-${colIndex}`);
    },
    clearAllError() {
      this.errorCells.clear();
    },
  },
});
