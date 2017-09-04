<template>
  <div id="app">
    <donut-timer></donut-timer>
  </div>
</template>

<script>
import DonutTimer from './components/DonutTimer';
import TimeSegmentSelector from './components/TimeSegmentSelector';

export default {
  name: 'app',
  components: {
    DonutTimer,
    TimeSegmentSelector,
  },
};
</script>

<style>
  body {
    margin: 0;
  }
  #app {
    height: 100vh;
    width: 100vw;
  }
</style>
