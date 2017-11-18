<template>
  <div id="app">
    <donut-timer
      :background-color="backgroundColor"
      :foreground-color="foregroundColor"
      :hours="hours"
      :minutes="minutes"
      :seconds="seconds"
    ></donut-timer>
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
  data: () => ({
    hours: 0,
    minutes: 2,
    seconds: 4,
    backgroundColor: '#ffbcbc',
    foregroundColor: '#ff0000',
  }),
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
