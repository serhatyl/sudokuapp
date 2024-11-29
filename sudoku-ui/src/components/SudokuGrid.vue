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
          'sudoku-grid__cell--prefilled':
            sudokuStore.solvedGrid[rowIndex][colIndex] !== undefined,
        }"
        v-for="(cell, colIndex) in row"
        :key="colIndex"
        @click="handleClick(rowIndex, colIndex)"
      >
        <input
          type="number"
          v-model="sudokuStore.grid[rowIndex][colIndex]"
          class="sudoku-grid__cell__input"
          min="1"
          max="9"
          @keydown="handleKeyDown($event, rowIndex, colIndex)"
          :disabled="sudokuStore.solvedGrid[rowIndex][colIndex] !== undefined"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useSudokuStore } from '../store/sudokuStore';

export default defineComponent({
  setup() {
    const sudokuStore = useSudokuStore();

    onMounted(() => {
      sudokuStore.generateSudoku(sudokuStore.rank);
      sudokuStore.startTimer();
    });

    const handleClick = (rowIndex: number, colIndex: number) => {
      console.log(rowIndex, colIndex);
    };

    const handleKeyDown = (
      event: KeyboardEvent,
      rowIndex: number,
      colIndex: number
    ) => {
      console.log(event, rowIndex, colIndex);
    };

    return {
      sudokuStore,
      handleClick,
      handleKeyDown,
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
    width: 44px;
    height: 44px;
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
