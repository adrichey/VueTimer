<template>
  <svg width="600" height="600"></svg>
</template>

<script>
const d3 = require('d3');

export default {
  name: 'donut-timer',
  mounted() {
    // this.#el - is the root element in <template>
    // in this case it is <svg> tag
    d3.select(this.$el)
      .append('circle')
      .attr('cx', '300')
      .attr('cy', '300')
      .attr('r', '300');
  },
};
</script>

<style>
</style>
