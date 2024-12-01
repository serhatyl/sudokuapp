import { describe, it, expect, vi } from 'vitest';
import { RankEnum, SudokuBoard } from '../../src/models';
import { fillAllCells, clearCells, getHint } from '../../src/utilities/sudoku';

describe('Sudoku algorithm tests', () => {
  it('should fill all cells of the board', () => {
    const board: SudokuBoard = Array.from({ length: 9 }, () =>
      Array(9).fill(undefined)
    );
    const isFilled = fillAllCells(board);
    expect(isFilled).toBe(true);
  });

  it('should clear cells by selected rank', () => {
    const board: SudokuBoard = Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, (_, index) => (index % 9) + 1)
    );
    const clearedGrid = clearCells(
      JSON.parse(JSON.stringify(board)),
      RankEnum.Beginner
    );
    const emptyCells = clearedGrid
      .flat()
      .filter((cell) => cell === undefined).length;
    expect(emptyCells).toBeGreaterThanOrEqual(41);
    expect(emptyCells).toBeLessThanOrEqual(45);
  });

  it('should provide a valid hint', () => {
    const solvedGrid: SudokuBoard = Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, (_, index) => (index % 9) + 1)
    );
    const grid: SudokuBoard = JSON.parse(JSON.stringify(solvedGrid));
    grid[0][0] = undefined;
    getHint(solvedGrid, grid);
    expect(grid[0][0]).toBe(solvedGrid[0][0]);
  });
});
