<template>
  <div>
    <h1>Leaderboard</h1>
    <div v-if="leaderboard.length === 0">
      <p>No leaderboard data available!</p>
    </div>
    <ul v-else>
      <li v-for="(entry, index) in leaderboard" :key="index">
        #{{ index + 1 }} - Score: {{ entry.score }} - {{ entry.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { LeaderboardEntry } from '../models';
import { getLeaderboardFromLocalStorage } from '../utilities/sudoku';

const leaderboard = ref<Array<LeaderboardEntry>>([]);

onMounted(() => {
  const leaderBoardArray = getLeaderboardFromLocalStorage();
  if (leaderBoardArray) {
    leaderboard.value = leaderBoardArray
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }
});
</script>

<style lang="scss">
ul {
  list-style: none;
  padding: 0;

  li {
    margin: 8px 0;
    font-size: 16px;
  }
}

p {
  font-weight: bold;
}
</style>
