<template>
  <div id="app">
    <donut-timer></donut-timer>
  </div>
</template>

<script>
import DonutTimer from './components/DonutTimer';

export default {
  name: 'app',
  components: {
    DonutTimer,
  },
};
</script>

<style>
  body {
    margin: 0;
  }
</style>
