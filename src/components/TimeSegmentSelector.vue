<template>
  <div>
    <select v-model="selected">
      <option v-for="option in options" v-bind:value="option.value">
        {{ option.text }}
      </option>
    </select>
    <span>Selected: {{ selected }}</span>
  </div>
</template>

<script>
export default {
  name: 'time-segment-selector',
  data: () => ({
    selected: '0',
    options: [],
  }),
  created() {
    for (let i = 0; i < 60; i += 1) {
      let intStr = `${i}`;
      if (intStr.length < 2) {
        intStr = `0${i}`;
      }
      this.$data.options.push({ text: intStr, value: i });
    }
  },
};
</script>

<style>
</style>
