<template>
  <div id="timer" :style="{ 'background-color': backgroundColor }">
    <svg id="donut" width="100%" height="100%" preserveAspectRatio="xMinYMin meet" :viewBox="donutViewBox">
      <g :transform="gTransform">
        <path id="countdown-path" :fill="foregroundColor" :d="arc"></path>
      </g>
      <text id="countdown-text" text-anchor="middle" :fill="foregroundColor" :x="radius" :style="{ 'font-size': fontSize }">--:--:--</text>
      <svg id="play-pause" viewBox="0 0 100 100" :width="fontSize" :height="fontSize" :fill="foregroundColor" @click="timerToggle">
        <rect class="opacity-0" width="100%" height="100%"/>
        <g v-show="!started">
          <polygon points="28.036 14.018, 28.036 85.982, 75.982 50, 28.036 14.018"></polygon>
        </g>
        <g v-show="started">
          <rect x="28.036" y="14.018" width="20" height="71.964"/>
          <rect x="58.036" y="14.018" width="20" height="71.964"/>
        </g>
      </svg>
      <svg id="reset" :width="fontSize" :height="fontSize" :fill="foregroundColor" @click="timerReset" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">
          <rect class="opacity-0" width="100%" height="100%"/>
          <g display="none">
              <polygon display="inline" points="85.982,15.043 14.018,15.043 41.006,42.031 41.006,84.957 58.996,72.963 58.996,42.031  "></polygon>
          </g>
          <g display="none">
              <path display="inline" d="M76.592,85.935l-11.32-17.052l7.006-6.496V15.922c0-1.024-0.832-1.856-1.859-1.856H29.314   c-1.027,0-1.861,0.832-1.861,1.856v46.465l7.17,6.644L23.408,85.935h6.404l8.775-13.227l0.07,0.064h22.414l0.238-0.221   l8.875,13.383H76.592z M62.004,64.233c-2.355,0-4.266-1.907-4.266-4.27c0-2.356,1.91-4.266,4.266-4.266   c2.357,0,4.27,1.909,4.27,4.266C66.273,62.326,64.361,64.233,62.004,64.233z M43.463,17.634h12.805v4.406H43.463V17.634z    M33.859,26.169h32.012V45.38H33.859V26.169z M38.525,64.233c-2.357,0-4.268-1.907-4.268-4.27c0-2.356,1.91-4.266,4.268-4.266   c2.359,0,4.271,1.909,4.271,4.266C42.797,62.326,40.885,64.233,38.525,64.233z"></path>
          </g>
          <g>
              <path d="M77.845,26.948c-6.625-7.896-16.55-12.932-27.689-12.932c-19.975,0-36.138,16.107-36.138,35.984h14.395   c0-11.961,9.765-21.691,21.786-21.691c7.191,0,13.567,3.501,17.538,8.867l-8.464,8.088l26.71-0.012V18.667L77.845,26.948z"></path>
              <path d="M49.799,71.687c-7.193,0-13.565-3.5-17.539-8.867l8.464-8.086l-26.706,0.012V81.33l8.134-8.281   c6.625,7.896,16.551,12.935,27.69,12.935c19.978,0,36.141-16.11,36.141-35.986H71.584C71.584,61.956,61.819,71.687,49.799,71.687z"></path>
          </g>
          <g display="none">
              <polygon display="inline" points="32.01,14.02 67.99,50.002 32.01,85.98  "></polygon>
          </g>
      </svg>
    </svg>
  </div>
</template>

<script>
const d3 = require('d3');

const tau = 2 * Math.PI;

export default {
  name: 'donut-timer',
  props: {
    hours: {
      type: Number,
      default: 0,
      required: true,
      validator(value) {
        return value >= 0 && value <= 59;
      },
    },
    minutes: {
      type: Number,
      default: 0,
      required: true,
      validator(value) {
        return value >= 0 && value <= 59;
      },
    },
    seconds: {
      type: Number,
      default: 0,
      required: true,
      validator(value) {
        return value >= 0 && value <= 59;
      },
    },
    foregroundColor: {
      type: String,
      default: '#000000',
    },
    backgroundColor: {
      type: String,
      default: '#ffffff',
    },
  },
  data: () => ({
    timeRemaining: 0,
    started: false, // Boolean
    interval: null,
    timerPercentage: 1, // 1 = 100%, 0.50 = 50%, etc.
    timeFraction: 0, // Fraction to remove from path each tick
    chimes: new Audio('static/wind-chimes-a.wav'),
  }),
  computed: {
    timeReadable() {
      return `${this.hoursReadable}:${this.minutesReadable}:${this.secondsReadable}`;
    },
    hoursReadable() {
      const hrs = Math.floor((this.timeRemaining / 60) / 60);
      return hrs >= 10 ? `${hrs}` : `0${hrs}`;
    },
    minutesReadable() {
      const min = Math.floor((this.timeRemaining / 60) % 60);
      return min >= 10 ? `${min}` : `0${min}`;
    },
    secondsReadable() {
      const sec = Math.ceil(this.timeRemaining % 60);
      return sec >= 10 ? `${sec}` : `0${sec}`;
    },
    windowWidth() {
      return Math.max(document.documentElement.clientWidth, window.innerWidth);
    },
    windowHeight() {
      return Math.max(document.documentElement.clientHeight, window.innerHeight);
    },
    svgBounds() {
      return this.windowHeight <= this.windowWidth ? this.windowHeight : this.windowWidth;
    },
    radius() {
      return this.svgBounds / 2;
    },
    fontSize() {
      return `${this.radius / 5}px`;
    },
    donutViewBox() {
      // Set the SVG donut chart viewBox to fit the window
      return `0 0 ${this.svgBounds} ${this.svgBounds}`;
    },
    gTransform() {
      return `translate(${this.radius},${this.radius})`;
    },
    arc() {
      return d3.arc()
        .innerRadius(this.radius - (this.radius / 2))
        .outerRadius(this.radius)
        .startAngle(0);
    },
  },
  mounted() {
    this.chimes.loop = false;

    // The following must be set during mount as d3.select will not run otherwise
    this.setCountdownCoords();
    this.setResetCoords();
    this.setPlayCoords();
    this.setPathEndAngle();

    // Begin the timer
    this.timerReset();
  },
  methods: {
    setCountdownCoords() {
      const text = this.$el.querySelector('#countdown-text');
      text.setAttribute('y', this.radius + (text.getBoundingClientRect().height / 4));

      return { x: text.getAttribute('x'), y: text.getAttribute('y') };
    },
    setResetCoords() {
      const reload = this.$el.querySelector('#reset');

      reload.setAttribute('x', this.radius - reload.getBoundingClientRect().width);
      reload.setAttribute('y', this.radius + (reload.getBoundingClientRect().height / 1.5));

      return { x: reload.getAttribute('x'), y: reload.getAttribute('y') };
    },
    setPlayCoords() {
      const playPause = this.$el.querySelector('#play-pause');

      playPause.setAttribute('x', this.radius);
      playPause.setAttribute('y', this.radius + (playPause.getBoundingClientRect().height / 1.5));

      return { x: playPause.getAttribute('x'), y: playPause.getAttribute('y') };
    },
    setPathEndAngle() {
      const endAngle = 0 * tau;

      d3.select(this.$el.querySelector('#countdown-path')).datum({ endAngle });

      return endAngle;
    },
    // Animation tweening
    arcTween(newAngle) {
      return (d) => {
        const interpolate = d3.interpolate(d.endAngle, newAngle);
        const data = d;

        return (t) => {
          data.endAngle = interpolate(t);
          return this.arc(data);
        };
      };
    },
    timerToggle() {
      this.started = !this.started;
    },
    timerReset() {
      // Timer functionality
      this.timerPercentage = 1;
      const minutes = (this.minutes * 60);
      const hours = (this.hours * 60 * 60);
      this.timeRemaining = this.seconds + minutes + hours;
      this.timeFraction = (100 / (this.timeRemaining)) * 0.01;
      const text = d3.select(this.$el.querySelector('#countdown-text'));
      const path = d3.select(this.$el.querySelector('#countdown-path'));

      text.text(this.timeReadable);
      path.transition()
        .duration(1000)
        .attrTween('d', this.arcTween(this.timerPercentage * tau));

      this.chimes.pause();
      this.chimes.currentTime = 0;

      // Begin timer polling
      this.beginCountdownInterval();
    },
    beginCountdownInterval() {
      clearInterval(this.interval);
      this.interval = setInterval(this.timerTick, 1000);
    },
    timerTick() {
      if (this.timeRemaining <= 0) {
        this.timerDone();
        return;
      }

      if (this.started) {
        const text = d3.select(this.$el.querySelector('#countdown-text'));
        const path = d3.select(this.$el.querySelector('#countdown-path'));

        this.timerPercentage = this.timerPercentage - this.timeFraction;
        this.timeRemaining -= 1;

        path.transition()
          .duration(750)
          .attrTween('d', this.arcTween(this.timerPercentage * tau));

        text.text(this.timeReadable);
      }
    },
    timerDone() {
      this.started = false;
      if (this.hours !== 0 || this.minutes !== 0 || this.seconds !== 0) {
        this.chimes.play();
      }
    },
  },
  watch: {
    hours() {
      this.started = false;
      this.timerReset();
    },
    minutes() {
      this.started = false;
      this.timerReset();
    },
    seconds() {
      this.started = false;
      this.timerReset();
    },
  },
};
</script>

<style>
  .opacity-0 {
    opacity: 0;
  }

  #timer,
  #countdown-path,
  #countdown-text,
  #play-pause,
  #reset {
    transition: .3s all;
  }

  #timer {
    align-items: center;
    display: flex;
    font-family: 'Impact';
    height: 100%;
    justify-content: center;
    width: 100%;
  }

  /* Needed to center the SVGs on the page */
  #timer svg {
    width: auto;
  }
</style>
