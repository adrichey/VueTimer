<template>
  <div class="timer">
    <svg>
      <!-- icomoon.io -->
      <symbol id="icon-spinner11" viewBox="0 0 32 32">
        <title>spinner11</title>
        <path d="M32 12h-12l4.485-4.485c-2.267-2.266-5.28-3.515-8.485-3.515s-6.219 1.248-8.485 3.515c-2.266 2.267-3.515 5.28-3.515 8.485s1.248 6.219 3.515 8.485c2.267 2.266 5.28 3.515 8.485 3.515s6.219-1.248 8.485-3.515c0.189-0.189 0.371-0.384 0.546-0.583l3.010 2.634c-2.933 3.349-7.239 5.464-12.041 5.464-8.837 0-16-7.163-16-16s7.163-16 16-16c4.418 0 8.418 1.791 11.313 4.687l4.687-4.687v12z"></path>
      </symbol>
      <use id="reset-button" xlink:href="#icon-spinner11" @click="timerReset"></use>
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
let text;
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
  },
  mounted() {
    // Get the viewport boundaries
    const windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const svgBounds = windowHeight <= windowWidth ? windowHeight : windowWidth;

    // D3 variables
    const radius = svgBounds / 2;

    // Center the SVG and set its boundaries to fit the window
    svg = d3.select('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${svgBounds} ${svgBounds}`)
      .attr('preserveAspectRatio', 'xMinYMin meet');
    g = svg.append('g')
      .attr('transform', `translate(${radius},${radius})`);

    text = svg.append('text')
      .text('0')
      .attr('text-anchor', 'middle')
      .style('font-size', `${radius / 4}px`)
      .attr('fill', 'red')
      .attr('x', radius);

    text.attr('y', radius + (text.node().getBoundingClientRect().height / 4));

    reload = svg.select('use#reset-button')
      .style('fill', '#ff0000')
      .attr('width', `${radius / 6}px`)
      .attr('height', `${radius / 6}px`);

    reload
      .attr('x', radius - (reload.node().getBoundingClientRect().width / 4))
      .attr('y', radius + (reload.node().getBoundingClientRect().height / 2));

    // Create the donut chart
    arc = d3.arc()
      .innerRadius(radius - (radius / 2))
      .outerRadius(radius)
      .startAngle(0);

    // Background - Time remaining
    g.append('path')
      .datum({ endAngle: tau })
      .style('fill', '#ff0000')
      .attr('d', arc);

    // Foreground - Time expired
    foreground = g.append('path')
      .datum({ endAngle: 0 * tau })
      .style('fill', '#ffffff')
      .attr('d', arc);

    // Begin the timer
    this.timerReset();
  },
  methods: {
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
  .timer {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .timer svg {
    width: auto;
  }

  .timer-controls {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
