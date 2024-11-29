<template>
  <div class="digit-row">
    <button
      v-for="number in numbers"
      :key="number"
      @click="handleClick(number)"
    >
      {{ number }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const numbers = ref(Array.from({ length: 9 }, (_, i) => i + 1));

    const handleClick = (number: number) => {
      console.log('handleClick number=', number);
    };

    return {
      numbers,
      handleClick,
    };
  },
});
</script>

<style scoped lang="scss">
.digit-row {
  margin: 20px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
