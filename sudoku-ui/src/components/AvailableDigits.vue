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
export default {
  data() {
    return {
      numbers: Array.from({ length: 9 }, (_, i) => i + 1),
    };
  },
  methods: {
    handleClick(number: number) {
      console.log('handleClick number=', number);
    },
  },
};
</script>

<style scoped lang="scss">
.digit-row {
  margin: 20px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
