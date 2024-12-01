import { defineStore } from 'pinia';
import {
  fillAllCells,
  clearCells,
  getHint,
  TOTAL_HINT_COUNT,
  defaultState,
} from '../utilities/sudoku';
import { SudokuBoard, RankEnum } from '../models';

export const useSudokuStore = defineStore('sudoku', {
  state: () => ({ ...defaultState }),
  actions: {
    resetState() {
      this.stopTimer();
      Object.assign(this, { ...defaultState });
      this.clearAllErrorCells();
      this.clearAllHintCells();
      if (!this.interval) {
        this.startTimer();
      }
    },
    changeScore(score: number) {
      this.score = score;
    },
    getHint() {
      if (this.remainingHint > 0) {
        const usedHints = TOTAL_HINT_COUNT - this.remainingHint;
        const penalty = 3 + usedHints;
        this.score -= penalty;
        this.remainingHint -= 1;

        getHint(this.solvedGrid, this.grid);
      }
    },
    generateSudoku(difficulty: RankEnum) {
      this.resetState();
      const emptyBoard: SudokuBoard = Array.from({ length: 9 }, () =>
        Array(9).fill(undefined)
      );
      fillAllCells(emptyBoard);
      this.solvedGrid = JSON.parse(JSON.stringify(emptyBoard));
      this.grid = clearCells(
        JSON.parse(JSON.stringify(this.solvedGrid)),
        difficulty
      );
    },
    clearCell(row: number, col: number) {
      if (this.grid[row] && typeof this.grid[row][col] !== 'undefined') {
        this.grid[row][col] = undefined;
      }
    },
    clearGrid() {
      this.grid = Array.from({ length: 9 }, () => Array(9).fill(undefined));
    },
    isGridSolved(): boolean {
      return JSON.stringify(this.grid) === JSON.stringify(this.solvedGrid);
    },
    startTimer() {
      if (this.interval) {
        return;
      }
      this.interval = setInterval(() => {
        this.elapsedTime++;
      }, 1000);
    },
    stopTimer() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = 0;
      }
    },
    setCellError(rowIndex: number, colIndex: number) {
      this.errorCells.add(`${rowIndex}-${colIndex}`);
    },
    clearCellError(rowIndex: number, colIndex: number) {
      this.errorCells.delete(`${rowIndex}-${colIndex}`);
    },
    clearAllErrorCells() {
      this.errorCells.clear();
    },
    clearAllHintCells() {
      this.hintCells.clear();
    },
    addHintCell(rowIndex: number, colIndex: number) {
      this.hintCells.add(`${rowIndex}-${colIndex}`);
    },
  },
});
