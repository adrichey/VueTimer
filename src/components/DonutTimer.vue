<template>
  <div id="timer" :style="{ 'background-color': backgroundColor }">
    <svg id="donut" width="100%" height="100%" preserveAspectRatio="xMinYMin meet" :viewBox="donutViewBox">
      <g :transform="gTransform"></g>
      <text id="countdown" text-anchor="middle" :fill="foregroundColor" :x="radius" :style="{ 'font-size': fontSize }">--:--:--</text>
      <svg id="reset" :width="fontSize" :height="fontSize" :fill="foregroundColor" @click="timerReset" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">
          <rect class="opacity-0" width="100%" height="100%" />
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
    <div class="timer-controls">
      <button class="timerToggle" @click="timerToggle">{{ started ? 'Stop Timer' : 'Start Timer' }}</button>
    </div>
  </div>
</template>

<script>
const d3 = require('d3');

const tau = 2 * Math.PI;
let interval;
let svg;
let g;
let arc;
let foreground;
let reload;

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
    started: 0, // 0 is paused, 1 is started
  }),
  computed: {
    timeReadable() {
      return `${this.hoursReadable}:${this.minutesReadable}:${this.secondsReadable}`;
    },
    hoursReadable() {
      const hrs = Math.floor((this.timeRemaining / 60 / 60));
      return hrs >= 10 ? hrs : `0${hrs}`;
    },
    minutesReadable() {
      const min = Math.floor((this.timeRemaining / 60) % 60);
      return min >= 10 ? min : `0${min}`;
    },
    secondsReadable() {
      const sec = Math.ceil(this.timeRemaining % 60);
      return sec >= 10 ? sec : `0${sec}`;
    },
    windowWidth() {
      return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    },
    windowHeight() {
      return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
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
  },
  mounted() {
    // Center the SVG and set its boundaries to fit the window
    svg = d3.select('svg#donut');
    g = d3.select('svg#donut > g');

    // The following must be set during mount as d3.select will not run otherwise
    this.setCountdownY();

    reload = svg.select('#reset')
      .style('fill', this.foregroundColor)
      .attr('width', `${this.radius / 5}px`)
      .attr('height', `${this.radius / 5}px`);

    reload
      .attr('x', this.radius - (reload.node().getBoundingClientRect().width / 2))
      .attr('y', this.radius + (reload.node().getBoundingClientRect().height / 1.5));

    // Create the donut chart
    arc = d3.arc()
      .innerRadius(this.radius - (this.radius / 2))
      .outerRadius(this.radius)
      .startAngle(0);

    // Background - Time remaining
    g.append('path')
      .datum({ endAngle: tau })
      .style('fill', this.foregroundColor)
      .attr('d', arc);

    // Foreground - Time expired
    foreground = g.append('path')
      .datum({ endAngle: 0 * tau })
      .style('fill', this.backgroundColor)
      .attr('d', arc);

    // Begin the timer
    this.timerReset();
  },
  methods: {
    setCountdownY() {
      const text = d3.select('text#countdown');
      text.attr('y', this.radius + (text.node().getBoundingClientRect().height / 4));
    },
    // Animation tweening
    arcTween(newAngle) {
      return (d) => {
        const interpolate = d3.interpolate(d.endAngle, newAngle);
        const data = d;

        return (t) => {
          data.endAngle = interpolate(t);
          return arc(data);
        };
      };
    },
    timerToggle() {
      this.started = this.started ? 0 : 1;
    },
    timerReset() {
      // Timer functionality
      let timerPercentage = 0.00;
      const minutes = (this.minutes * 60);
      const hours = (this.hours * 60 * 60);
      this.timeRemaining = this.seconds + minutes + hours;
      const timeFraction = (100 / (this.timeRemaining)) * 0.01;
      const text = d3.select('text#countdown');

      text.text(this.timeReadable);
      foreground.transition()
        .duration(1000)
        .attrTween('d', this.arcTween(timerPercentage * tau));

      // Begin timer polling
      clearInterval(interval);
      interval = setInterval(() => {
        if (this.started) {
          timerPercentage = timerPercentage >= 1 ? 0.00 : timerPercentage + timeFraction;
          foreground.transition()
            .duration(750)
            .attrTween('d', this.arcTween(timerPercentage * tau));
          this.timeRemaining -= 1;
          text.text(this.timeReadable);
        }
      }, 1000);
    },
  },
};
</script>

<style>
  .opacity-0 {
    opacity: 0;
  }

  #timer {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Needed to center the SVGs on the page */
  #timer svg {
    width: auto;
  }

  #countdown {
    font-family: 'Impact';
  }

  .timer-controls {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
