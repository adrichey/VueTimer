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
          <div class="time-segment">
            <span>H</span>
            <select v-model="hours">
              <option v-for="option in timeSegmentOptions" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <div class="time-segment">
            <span>M</span>
            <select v-model="minutes">
              <option v-for="option in timeSegmentOptions" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <div class="time-segment">
            <span>S</span>
            <select v-model="seconds">
              <option v-for="option in timeSegmentOptions" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <div class="theme-selector">
            <svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" version="1.1" x="0px" y="0px" viewBox="0 0 100 100">
              <g transform="translate(0,-952.36218)">
                <path d="m 55,959.36217 c -26.7533,0 -39,22 -39,42.00003 0,19 10.7449,43.4935 29,44 6.0945,0 15,-3 18,-29 3,-24.00003 21,-17.00001 21,-34.00003 0,-12 -12,-23 -29,-23 z m 0,9 c 3.866,0 7,3.134 7,7 0,3.866 -3.134,7 -7,7 -3.866,0 -7,-3.134 -7,-7 0,-3.866 3.134,-7 7,-7 z m -19,12 c 3.866,0 7,3.134 7,7 0,3.866 -3.134,7 -7,7 -3.866,0 -7,-3.134 -7,-7 0,-3.866 3.134,-7 7,-7 z m -3.5,24.00003 c 3.5899,0 6.5,2.9101 6.5,6.5 0,3.5898 -2.9101,6.5 -6.5,6.5 -3.5899,0 -6.5,-2.9102 -6.5,-6.5 0,-3.5899 2.9101,-6.5 6.5,-6.5 z m 10.5,19 c 3.3137,0 6,2.6863 6,6 0,3.3137 -2.6863,6 -6,6 -3.3137,0 -6,-2.6863 -6,-6 0,-3.3137 2.6863,-6 6,-6 z" style="color:#000000;enable-background:accumulate;" fill="#000000" stroke="none" marker="none" visibility="visible" display="inline" overflow="visible"></path>
              </g>
            </svg>
            <select v-model="theme">
              <option v-for="(option, index) in themeOptions" :value="index">
                {{ option.label }}
              </option>
            </select>
          </div>
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
    font-family: 'Impact';
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

  #settings div {
    display: block;
    margin: 5px 0;
    position: relative;
  }

  #settings span, #settings svg {
    float: left;
    line-height: 15px;
    margin: 10px 5px 10px 0;
    text-align: center;
    width: 15px;
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
    width: 160px;
  }

  #settings div::after {
    bottom: 8px;
    content: '\25BC';
    font-size: 12px;
    line-height: 16px;
    pointer-events: none;
    position: absolute;
    right: 8px;
  }
</style>
