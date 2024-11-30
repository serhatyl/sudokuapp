<template>
  <div class="sudoku-grid">
    <div
      class="sudoku-grid__row"
      v-for="(row, rowIndex) in sudokuStore.grid"
      :key="rowIndex"
    >
      <div
        class="sudoku-grid__cell"
        :class="{
          'sudoku-grid__cell--border-right': (colIndex + 1) % 3 === 0,
          'sudoku-grid__cell--border-bottom': (rowIndex + 1) % 3 === 0,
          'sudoku-grid__cell--prefilled': isPrefilled(rowIndex, colIndex),
          'sudoku-grid__cell--error': sudokuStore.errorCells.has(
            `${rowIndex}-${colIndex}`
          ),
        }"
        v-for="(_, colIndex) in row"
        :key="colIndex"
      >
        <input
          type="number"
          v-model="sudokuStore.grid[rowIndex][colIndex]"
          class="sudoku-grid__cell__input"
          min="1"
          max="9"
          @input="handleChange(rowIndex, colIndex)"
          @keydown="handleKeyDown($event)"
          :disabled="isPrefilled(rowIndex, colIndex)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue';
import { useSudokuStore } from '../store/sudokuStore';

export default defineComponent({
  setup() {
    const sudokuStore = useSudokuStore();

    const updatePrefilledCells = () => {
      sudokuStore.prefilledCells.clear();
      sudokuStore.grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell !== undefined) {
            sudokuStore.prefilledCells.add(`${rowIndex}-${colIndex}`);
          }
        });
      });
    };

    onMounted(() => {
      sudokuStore.generateSudoku(sudokuStore.rank);
    });

    watch(
      () => sudokuStore.grid,
      () => {
        updatePrefilledCells();
        sudokuStore.clearAllError();
      }
    );

    const isPrefilled = (rowIndex: number, colIndex: number): boolean => {
      return sudokuStore.prefilledCells.has(`${rowIndex}-${colIndex}`);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      const allowedKeys = [
        'Backspace',
        'Tab',
        'Delete',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
      ];

      const inputValue = (event.target as HTMLInputElement).value + key;

      if (
        (!/^[1-9]$/.test(key) && !allowedKeys.includes(key)) ||
        (inputValue.length > 1 && !allowedKeys.includes(key))
      ) {
        event.preventDefault();
      }
    };
    const handleChange = (rowIndex: number, colIndex: number) => {
      const userInput = sudokuStore.grid[rowIndex][colIndex];
      const solvedValue = sudokuStore.solvedGrid[rowIndex][colIndex];

      if (userInput !== solvedValue && userInput) {
        sudokuStore.setCellError(rowIndex, colIndex);
      } else {
        sudokuStore.clearCellError(rowIndex, colIndex);
      }
    };

    return {
      sudokuStore,
      handleChange,
      handleKeyDown,
      isPrefilled,
    };
  },
});
</script>

<style scoped lang="scss">
.sudoku-grid {
  display: grid;
  grid-template-columns: repeat(9, 0fr);
  border: 2px solid #000;

  &__row {
    display: contents;

    &:last-child .sudoku-grid__cell--border-bottom {
      border-bottom: 0;
    }
  }

  &__cell {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #ddd;
    background-color: #fff;

    &--border-right {
      border-right: 2px solid #000;

      &:last-child {
        border-right: 0;
      }
    }

    &--prefilled {
      background-color: #f0f0f0;
    }

    &--error {
      background-color: #ff0000;
    }

    &--border-bottom {
      border-bottom: 2px solid #000;
    }

    &__input {
      width: 30px;
      height: 30px;
      text-align: center;
      border: none;
      background: transparent;
      font-size: 1.2em;
      color: #000;
      font-weight: 500;

      &:focus {
        outline: 2px solid #007bff;
      }
    }
  }
}
</style>
