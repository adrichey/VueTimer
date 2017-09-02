<template>
  <div id="app">
    <donut-timer></donut-timer>
    <time-segment-selector></time-segment-selector>
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
</style>
