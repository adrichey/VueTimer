<template>
  <div id="app">
    <nav>
      <svg id="settings-toggle" :class="{ expanded }" aria-label="Toggle Settings" @click="expanded = !expanded" viewBox="0 0 100 100" width="30px" height="30px" :fill="foregroundColor">
        <rect class="opacity-0" width="100%" height="100%"/>
        <g>
          <polygon points="28.036 14.018, 28.036 85.982, 75.982 50, 28.036 14.018"></polygon>
        </g>
      </svg>
      <transition name="slide-fade">
        <div id="settings" v-show="expanded">
          <span class="time-segment">
            <select v-model="hours">
              <option v-for="option in timeSegmentOptions" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </span>
          <span class="time-segment">
            <select v-model="minutes">
              <option v-for="option in timeSegmentOptions" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </span>
          <span class="time-segment">
            <select v-model="seconds">
              <option v-for="option in timeSegmentOptions" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </span>
          <span class="theme-selector">
            <select v-model="theme">
              <option v-for="(option, index) in themeOptions" :value="index">
                {{ option.label }}
              </option>
            </select>
          </span>
        </div>
      </transition>
    </nav>
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

const timeSegmentOptions = [];
for (let i = 0; i < 60; i += 1) {
  timeSegmentOptions.push({ label: String(i).padStart(2, '0'), value: i });
}

const themeOptions = [
  {
    label: 'Light',
    backgroundColor: '#ffffff',
    foregroundColor: '#000000',
  },
  {
    label: 'Dark',
    backgroundColor: '#000000',
    foregroundColor: '#ffffff',
  },
  {
    label: 'Red',
    backgroundColor: '#ffffff',
    foregroundColor: '#ff2841',
  },
  {
    label: 'Blue',
    backgroundColor: '#ffffff',
    foregroundColor: '#0061ff',
  },
  {
    label: 'Green',
    backgroundColor: '#ffffff',
    foregroundColor: '#4ce873',
  },
  {
    label: 'Orange',
    backgroundColor: '#ffffff',
    foregroundColor: '#ffa426',
  },
  {
    label: 'Pink',
    backgroundColor: '#ffffff',
    foregroundColor: '#ff68a2',
  },
];

export default {
  name: 'app',
  components: {
    DonutTimer,
  },
  data: () => ({
    hours: 0,
    minutes: 10,
    seconds: 0,
    theme: 0,
    backgroundColor: themeOptions[0].backgroundColor,
    foregroundColor: themeOptions[0].foregroundColor,
    timeSegmentOptions,
    themeOptions,
    expanded: false,
  }),
  watch: {
    theme(index) {
      this.backgroundColor = themeOptions[index].backgroundColor;
      this.foregroundColor = themeOptions[index].foregroundColor;
    },
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
  
  .opacity-0 {
    opacity: 0;
  }

  .expanded {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }

  .slide-fade-enter-active, .slide-fade-leave-active {
    transition: all .3s ease;
  }

  .slide-fade-enter, .slide-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }

  nav {
    margin-left: 10px;
    margin-top: 10px;
    position: fixed;
  }

  #settings-toggle {
    border: none;
    display: block;
    float: left;
    margin: 0;
    padding: 0;
    transition: .3s all;
  }

  #settings-toggle svg {
    float: left;
  }

  #settings {
    background: #ffffff;
    border: 2px solid #000;
    display: block;
    float: left;
    margin-left: 5px;
    padding: 5px;
    width: 180px;
  }

  #settings span {
    display: block;
    margin: 5px;
    position: relative;
  }

  #settings select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: #ffffff;
    border: 2px solid #000000;
    font-size: 16px;
    height: 34px;
    padding: 5px;
    width: 100%;
  }

  #settings span::after {
    bottom: 8px;
    content: '\25BC';
    font-size: 12px;
    line-height: 16px;
    pointer-events: none;
    position: absolute;
    right: 8px;
  }
</style>
