import { defineStore } from 'pinia';
import { RankEnum } from '../models';
import { clearCells, fillAllCells } from '../utilities/sudoku';

export const useSudokuStore = defineStore('sudoku', {
  state: () => ({
    rank: RankEnum.Beginner,
    score: 0,
    remainingHint: 10,
    elapsedTime: 0,
    interval: 0,
    grid: Array(9)
      .fill(null)
      .map(() => Array(9).fill(undefined)),
    solvedGrid: Array(9)
      .fill(null)
      .map(() => Array(9).fill(undefined)),
  }),
  actions: {
    changeScore(score: number) {
      this.score = score;
    },
    changeRank(newRank: RankEnum) {
      this.rank = newRank;
      this.resetTimer();
      this.generateSudoku(newRank);
    },
    reduceRemainingHint() {
      if (this.remainingHint > 0) {
        this.remainingHint -= 1;
      }
    },
    generateSudoku(rank: RankEnum | string) {
      const sudokuArray: number[][] = Array(9)
        .fill(0)
        .map(() => Array(9).fill(undefined));
      fillAllCells(sudokuArray);
      console.log('fillAllCells sudoku array=', sudokuArray);
      this.solvedGrid = sudokuArray;
      this.grid = clearCells(this.solvedGrid, rank);
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
  },
});
