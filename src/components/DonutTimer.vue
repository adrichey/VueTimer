<template>
  <svg></svg>
</template>

<script>
const d3 = require('d3');

export default {
  name: 'donut-timer',
  data: () => ({
    hours: 0,
    minutes: 1,
    seconds: 4,
  }),
  mounted() {
    // Get the viewport boundaries
    const windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const svgBounds = windowHeight <= windowWidth ? windowHeight : windowWidth;

    // D3 variables
    const radius = svgBounds / 2;
    const tau = 2 * Math.PI;

    // Center the SVG and set its boundaries to fit the window
    const svg = d3.select(this.$el)
      .attr('width', `${svgBounds}px`)
      .attr('height', `${svgBounds}px`)
      .attr('viewBox', `0 0 ${svgBounds} ${svgBounds}`)
      .attr('preserveAspectRatio', 'xMinYMin meet');
    const g = svg.append('g')
      .attr('transform', `translate(${radius},${radius})`);

    // Create the donut chart
    const arc = d3.arc()
      .innerRadius(radius - (radius / 2))
      .outerRadius(radius)
      .startAngle(0);

    // Background - Time remaining
    g.append('path')
      .datum({ endAngle: tau })
      .style('fill', '#ff0000')
      .attr('d', arc);

    // Foreground - Time expired
    const foreground = g.append('path')
      .datum({ endAngle: 0 * tau })
      .style('fill', '#ffffff')
      .attr('d', arc);

    // Animation tweening
    function arcTween(newAngle) {
      return (d) => {
        const interpolate = d3.interpolate(d.endAngle, newAngle);
        const data = d;

        return (t) => {
          data.endAngle = interpolate(t);
          return arc(data);
        };
      };
    }

    // Timer functionality
    let timerPercentage = 0.00;
    const minutes = (this.minutes * 60);
    const hours = (this.hours * 60 * 60);
    const timeFraction = (100 / (this.seconds + minutes + hours)) * 0.01;

    d3.interval(() => {
      timerPercentage = timerPercentage >= 1 ? 0.00 : timerPercentage + timeFraction;
      foreground.transition()
        .duration(750)
        .attrTween('d', arcTween(timerPercentage * tau));
    }, 1000);
  },
};
</script>

<style>
  .timer {
    background-color: blue;

    svg {
      display: block;
      margin: 0 auto;
      background-color: red;
    }
  }
</style>
