<template>
  <div class="timer">
    <svg></svg>
    <div class="timer-controls">
      <button class="timerToggle" v-on:click="timerToggle">{{ started ? 'Stop Timer' : 'Start Timer' }}</button>
      <button class="timerReset" v-on:click="timerReset">Reset Timer</button>
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

export default {
  name: 'donut-timer',
  data: () => ({
    hours: 0,
    minutes: 1,
    seconds: 4,
    timeRemaining: 0,
    started: 0, // 0 is paused, 1 is started
  }),
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
      .style('font-size', `${radius / 2}px`)
      .attr('fill', 'red')
      .attr('x', radius);

    text.attr('y', radius + (text.node().getBoundingClientRect().height / 4));

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

      text.text(this.timeRemaining);
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
          text.text(this.timeRemaining);
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
