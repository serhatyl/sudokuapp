<template>
  <div><h1>Sudoku</h1></div>
  <div class="grid-row">
    <div>
      Level:
      <select v-model="rank" @change="onRankChanged($event)">
        <option v-for="item in rankEnumValues" :key="item" :value="item">
          {{ item }}
        </option>
      </select>
    </div>
    <div>Score: {{ score }}</div>
    <div>Time Spent: {{ formattedTime }}</div>
    <div>
      <button type="button" @click="getHint()">
        Hint ({{ remainingHint }}) 💡
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { RankEnum } from '../models';
import { useSudokuStore } from '../store/sudokuStore';

export default defineComponent({
  setup() {
    const rank = ref<string>(RankEnum.Beginner);
    const rankEnumValues = Object.values(RankEnum);
    const sudokuStore = useSudokuStore();

    const formattedTime = computed(() => {
      const minutes = Math.floor(sudokuStore.elapsedTime / 60);
      const seconds = sudokuStore.elapsedTime % 60;
      const formattedMinutes = String(minutes).padStart(2, '0');
      const formattedSeconds = String(seconds).padStart(2, '0');

      return `${formattedMinutes}:${formattedSeconds}`;
    });
    const remainingHint = computed(() => sudokuStore.remainingHint);
    const score = computed(() => sudokuStore.score);

    onMounted(() => {});

    const onRankChanged = (event: Event) => {
      if (event.target instanceof HTMLSelectElement) {
        sudokuStore.generateSudoku(event.target.value as RankEnum);
      }
    };

    const getHint = () => {
      sudokuStore.getHint();
    };

    return {
      rank,
      score,
      formattedTime,
      rankEnumValues,
      remainingHint,
      onRankChanged,
      getHint,
    };
  },
});
</script>

<style scoped>
.grid-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin: 0 0 20px 0;
  padding: 12px;
}
</style>
