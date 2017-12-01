/**
 * Please note that all of these tests must be run in a 1280x720 browser or they will fail.
 * The headless Chrome running these tests has been set up accordingly. See karma.conf.js
 * for more details.
 */

import Vue from 'vue';
import CountdownTimer from '@/components/CountdownTimer';

Vue.config.devtools = false;

const d3 = require('d3');

const tau = 2 * Math.PI;
const timeRemaining = 3923;
let propsData;

describe('CountdownTimer.vue', () => {
  const Component = Vue.extend(CountdownTimer);

  beforeEach(() => {
    propsData = {
      hours: 1,
      minutes: 5,
      seconds: 23,
    };
  });

  it('sets the correct default data', () => {
    expect(typeof CountdownTimer.data).to.equal('function');

    const defaultData = CountdownTimer.data();

    expect(defaultData.timeRemaining).to.equal(0);
    expect(defaultData.started).to.equal(false);
    expect(defaultData.interval).to.equal(null);
    expect(defaultData.timerPercentage).to.equal(1);
    expect(defaultData.timeFraction).to.equal(0);
    expect(defaultData.chimes instanceof Audio).to.equal(true);
    expect(defaultData.chimes.getAttribute('src')).to.equal('static/wind-chimes-a.wav');
  });

  it('should render correctly', () => {
    const vm = new Component({
      propsData,
    }).$mount();

    const donut = vm.$el.querySelector('#timer > #donut');

    expect(donut).to.not.equal(null);
    expect(donut.getAttribute('width')).to.equal('100%');
    expect(donut.getAttribute('height')).to.equal('100%');
    expect(donut.getAttribute('preserveAspectRatio')).to.equal('xMinYMin meet');

    const path = donut.querySelector('g > #countdown-path');

    expect(path).to.not.equal(null);
    expect(path.getAttribute('fill')).to.equal('#000000');
    expect(path.getAttribute('d')).to.equal(`${vm.arc}`);

    const text = donut.querySelector('#countdown-text');

    expect(text).to.not.equal(null);
    expect(text.getAttribute('text-anchor')).to.equal('middle');
    expect(text.getAttribute('fill')).to.equal('#000000');
    expect(text.getAttribute('x')).to.equal(`${vm.radius}`);
    expect(text.getAttribute('style')).to.equal('font-size: 72px;');
    expect(text.innerHTML).to.equal('01:05:23');

    const playPause = donut.querySelector('#play-pause');
    const playPauseRect = playPause.querySelector('rect.opacity-0');
    const playPauseGroups = playPause.querySelectorAll('g');

    expect(playPause).to.not.equal(null);
    expect(playPause.getAttribute('viewBox')).to.equal('0 0 100 100');
    expect(playPause.getAttribute('width')).to.equal('72px');
    expect(playPause.getAttribute('height')).to.equal('72px');
    expect(playPause.getAttribute('fill')).to.equal('#000000');
    expect(playPauseRect.getAttribute('width')).to.equal('100%');
    expect(playPauseRect.getAttribute('height')).to.equal('100%');
    expect(playPauseGroups.length).to.equal(2);
    expect(playPauseGroups[0].querySelector('polygon')).to.not.equal(null);
    expect(playPauseGroups[1].querySelectorAll('rect').length).to.equal(2);

    const reset = donut.querySelector('#reset');
    const resetRect = reset.querySelector('rect.opacity-0');
    const resetGroups = reset.querySelectorAll('g');

    expect(reset).to.not.equal(null);
    expect(reset.getAttribute('viewBox')).to.equal('0 0 100 100');
    expect(reset.getAttribute('width')).to.equal('72px');
    expect(reset.getAttribute('height')).to.equal('72px');
    expect(reset.getAttribute('fill')).to.equal('#000000');
    expect(resetRect.getAttribute('width')).to.equal('100%');
    expect(resetRect.getAttribute('height')).to.equal('100%');
    expect(resetGroups.length).to.equal(4);
    expect(resetGroups[0].querySelector('polygon')).to.not.equal(null);
    expect(resetGroups[1].querySelector('path')).to.not.equal(null);
    expect(resetGroups[2].querySelectorAll('path').length).to.equal(2);
    expect(resetGroups[3].querySelector('polygon')).to.not.equal(null);
  });

  it('should call the correct initialization functions on mount', () => {
    const vm = new Component({
      propsData,
    });

    const setCountdownCoordsSpy = sinon.spy(vm, 'setCountdownCoords');
    const setResetCoordsSpy = sinon.spy(vm, 'setResetCoords');
    const setPlayCoordsSpy = sinon.spy(vm, 'setPlayCoords');
    const setPathEndAngleSpy = sinon.spy(vm, 'setPathEndAngle');
    const timerResetSpy = sinon.spy(vm, 'timerReset');

    expect(setCountdownCoordsSpy.notCalled).to.equal(true);
    expect(setResetCoordsSpy.notCalled).to.equal(true);
    expect(setPlayCoordsSpy.notCalled).to.equal(true);
    expect(setPathEndAngleSpy.notCalled).to.equal(true);
    expect(timerResetSpy.notCalled).to.equal(true);

    vm.$mount();

    expect(setCountdownCoordsSpy.calledOnce).to.equal(true);
    expect(setResetCoordsSpy.calledOnce).to.equal(true);
    expect(setPlayCoordsSpy.calledOnce).to.equal(true);
    expect(setPathEndAngleSpy.calledOnce).to.equal(true);
    expect(timerResetSpy.calledOnce).to.equal(true);

    setCountdownCoordsSpy.restore();
    setResetCoordsSpy.restore();
    setPlayCoordsSpy.restore();
    setPathEndAngleSpy.restore();
    timerResetSpy.restore();
  });

  describe('props', () => {
    let consoleSpy;

    beforeEach(() => {
      consoleSpy = sinon.spy(console, 'error');
    });

    afterEach(() => {
      consoleSpy.restore();
    });

    describe('hours property', () => {
      it('should be required', () => {
        delete propsData.hours;

        new Component({
          propsData,
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Missing required prop: "hours"')).to.not.equal(-1);
      });

      it('should be a Number', () => {
        propsData.hours = 'test';

        new Component({
          propsData,
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: type check failed for prop "hours". Expected Number, got String.')).to.not.equal(-1);
      });

      it('should be greater than 0', () => {
        propsData.hours = -1;

        new Component({
          propsData,
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: custom validator check failed for prop "hours"')).to.not.equal(-1);
      });

      it('should be less than 59', () => {
        propsData.hours = 60;

        new Component({
          propsData,
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: custom validator check failed for prop "hours"')).to.not.equal(-1);
      });
    });

    describe('minutes property', () => {
      it('should be required', () => {
        delete propsData.minutes;

        new Component({
          propsData,
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Missing required prop: "minutes"')).to.not.equal(-1);
      });

      it('should be a Number', () => {
        propsData.minutes = 'test';

        new Component({
          propsData,
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: type check failed for prop "minutes". Expected Number, got String.')).to.not.equal(-1);
      });

      it('should be greater than 0', () => {
        propsData.minutes = -1;

        new Component({
          propsData,
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: custom validator check failed for prop "minutes"')).to.not.equal(-1);
      });

      it('should be less than 59', () => {
        propsData.minutes = 60;

        new Component({
          propsData,
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: custom validator check failed for prop "minutes"')).to.not.equal(-1);
      });
    });

    describe('seconds property', () => {
      it('should be required', () => {
        delete propsData.seconds;

        new Component({
          propsData,
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Missing required prop: "seconds"')).to.not.equal(-1);
      });

      it('should be a Number', () => {
        propsData.seconds = 'test';

        new Component({
          propsData,
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: type check failed for prop "seconds". Expected Number, got String.')).to.not.equal(-1);
      });

      it('should be greater than 0', () => {
        propsData.seconds = -1;

        new Component({
          propsData,
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: custom validator check failed for prop "seconds"')).to.not.equal(-1);
      });

      it('should be less than 59', () => {
        propsData.seconds = 60;

        new Component({
          propsData,
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: custom validator check failed for prop "seconds"')).to.not.equal(-1);
      });
    });

    describe('foregroundColor property', () => {
      it('should default to #000000', () => {
        const vm = new Component({
          propsData,
        }).$mount();

        expect(vm.foregroundColor).to.equal('#000000');
      });

      it('should be a String', () => {
        propsData.foregroundColor = true;

        new Component({
          propsData,
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: type check failed for prop "foregroundColor". Expected String, got Boolean.')).to.not.equal(-1);
      });
    });

    describe('backgroundColor property', () => {
      it('should default to #ffffff', () => {
        const vm = new Component({
          propsData,
        }).$mount();

        expect(vm.backgroundColor).to.equal('#ffffff');
      });

      it('should be a String', () => {
        propsData.backgroundColor = true;

        new Component({
          propsData,
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: type check failed for prop "backgroundColor". Expected String, got Boolean.')).to.not.equal(-1);
      });
    });
  });

  describe('computed properties', () => {
    it('timeReadable should display time in hh:mm:ss format', () => {
      const vm = new Component({
        propsData,
      }).$mount();

      expect(vm.timeReadable).to.equal('01:05:23');
    });

    it('hoursReadable should pad the hours to two digits with a leading zero for digits 1 through 9', (done) => {
      const vm = new Component({
        propsData,
      }).$mount();

      expect(vm.hoursReadable).to.equal('01');

      Vue.set(vm.$props, 'hours', 7);
      vm.$nextTick(() => {
        expect(vm.hoursReadable).to.equal('07');

        Vue.set(vm.$props, 'hours', 9);
        vm.$nextTick(() => {
          expect(vm.hoursReadable).to.equal('09');

          Vue.set(vm.$props, 'hours', 24);
          vm.$nextTick(() => {
            expect(vm.hoursReadable).to.equal('24');

            Vue.set(vm.$props, 'hours', 48);
            vm.$nextTick(() => {
              expect(vm.hoursReadable).to.equal('48');
              done();
            });
          });
        });
      });
    });

    it('minutesReadable should pad the hours to two digits with a leading zero for digits 1 through 9', (done) => {
      const vm = new Component({
        propsData,
      }).$mount();

      expect(vm.minutesReadable).to.equal('05');

      Vue.set(vm.$props, 'minutes', 7);
      vm.$nextTick(() => {
        expect(vm.minutesReadable).to.equal('07');

        Vue.set(vm.$props, 'minutes', 9);
        vm.$nextTick(() => {
          expect(vm.minutesReadable).to.equal('09');

          Vue.set(vm.$props, 'minutes', 24);
          vm.$nextTick(() => {
            expect(vm.minutesReadable).to.equal('24');

            Vue.set(vm.$props, 'minutes', 48);
            vm.$nextTick(() => {
              expect(vm.minutesReadable).to.equal('48');
              done();
            });
          });
        });
      });
    });

    it('secondsReadable should pad the hours to two digits with a leading zero for digits 1 through 9', (done) => {
      const vm = new Component({
        propsData,
      }).$mount();

      expect(vm.secondsReadable).to.equal('23');

      Vue.set(vm.$props, 'seconds', 7);
      vm.$nextTick(() => {
        expect(vm.secondsReadable).to.equal('07');

        Vue.set(vm.$props, 'seconds', 9);
        vm.$nextTick(() => {
          expect(vm.secondsReadable).to.equal('09');

          Vue.set(vm.$props, 'seconds', 24);
          vm.$nextTick(() => {
            expect(vm.secondsReadable).to.equal('24');

            Vue.set(vm.$props, 'seconds', 48);
            vm.$nextTick(() => {
              expect(vm.secondsReadable).to.equal('48');
              done();
            });
          });
        });
      });
    });

    describe('svgBounds', () => {
      it('should return windowHeight if it is less than windowWidth', () => {
        const windowHeight = 500;
        const windowWidth = 600;

        const vm = new Component({
          propsData,
          computed: {
            windowHeight() {
              return windowHeight;
            },
            windowWidth() {
              return windowWidth;
            },
          },
        }).$mount();

        expect(vm.svgBounds).to.equal(windowHeight);
      });

      it('should return windowWidth if it is less than windowHeight', () => {
        const windowHeight = 800;
        const windowWidth = 400;

        const vm = new Component({
          propsData,
          computed: {
            windowHeight() {
              return windowHeight;
            },
            windowWidth() {
              return windowWidth;
            },
          },
        }).$mount();

        expect(vm.svgBounds).to.equal(windowWidth);
      });

      it('should return windowHeight if it is equal to windowWidth', () => {
        const windowHeight = 700;
        const windowWidth = 700;

        const vm = new Component({
          propsData,
          computed: {
            windowHeight() {
              return windowHeight;
            },
            windowWidth() {
              return windowWidth;
            },
          },
        }).$mount();

        expect(vm.svgBounds).to.equal(windowHeight);
      });
    });

    describe('radius', () => {
      it('should return svgBounds divided by 2', () => {
        const vm = new Component({
          propsData,
          computed: {
            svgBounds() {
              return 730;
            },
          },
        }).$mount();

        expect(vm.radius).to.equal(365);
      });
    });

    describe('fontSize', () => {
      it('should return radius divided by 5 in pixels', () => {
        const vm = new Component({
          propsData,
          computed: {
            radius() {
              return 680;
            },
          },
        }).$mount();

        expect(vm.fontSize).to.equal('136px');
      });
    });

    describe('donutViewBox', () => {
      it('should return the viewBox attribute for donut timer SVG using svgBounds', () => {
        const vm = new Component({
          propsData,
          computed: {
            svgBounds() {
              return 730;
            },
          },
        }).$mount();

        expect(vm.donutViewBox).to.equal('0 0 730 730');
      });
    });

    describe('gTransform', () => {
      it('should return the translation function for the donut timer group transform attribute using radius', () => {
        const vm = new Component({
          propsData,
          computed: {
            radius() {
              return 360;
            },
          },
        }).$mount();

        expect(vm.gTransform).to.equal('translate(360,360)');
      });
    });

    describe('arc', () => {
      it('should return the arc function used for the countdown path within the donut timer', () => {
        const vm = new Component({
          propsData,
          computed: {
            radius() {
              return 360;
            },
          },
        }).$mount();

        const expectedArc = d3.arc()
          .innerRadius(180)
          .outerRadius(360)
          .startAngle(0);

        expect(`${vm.arc}`).to.equal(`${expectedArc}`);
      });
    });
  });

  describe('methods', () => {
    it('setCountdownCoords should set and return the x/y coordinates for the countdown text', () => {
      const vm = new Component({
        propsData,
      }).$mount();

      const coordinates = vm.setCountdownCoords();
      const countdownOffset = vm.$el.querySelector('#countdown-text').getBoundingClientRect().height / 4;
      const expectedY = vm.radius + countdownOffset;

      expect(coordinates.x).to.equal('360');
      expect(coordinates.y).to.equal(`${expectedY}`);
    });

    it('setResetCoords should set and return the x/y coordinates for the reset SVG', () => {
      const vm = new Component({
        propsData,
      }).$mount();

      const coordinates = vm.setResetCoords();
      const reload = vm.$el.querySelector('#countdown-text');
      const expectedX = vm.radius - reload.getBoundingClientRect().width;
      const expectedY = vm.radius + (reload.getBoundingClientRect().height / 1.5);

      expect(coordinates.x).to.equal(`${expectedX}`);
      expect(coordinates.y).to.equal(`${expectedY}`);
    });

    it('setPlayCoords should set and return the x/y coordinates for the play/pause SVG', () => {
      const vm = new Component({
        propsData,
      }).$mount();

      const coordinates = vm.setPlayCoords();
      const playPause = vm.$el.querySelector('#play-pause');
      const expectedX = vm.radius;
      const expectedY = vm.radius + (playPause.getBoundingClientRect().height / 1.5);

      expect(coordinates.x).to.equal(`${expectedX}`);
      expect(coordinates.y).to.equal(`${expectedY}`);
    });

    it('setPathEndAngle should set and return the endAngle datum for the donut countdown path', () => {
      const vm = new Component({
        propsData,
      }).$mount();

      const endAngle = vm.setPathEndAngle();

      expect(endAngle).to.equal(0 * tau);
    });

    // arcTween testing should go here. How the hell are we going to do that??

    it('timerToggle should start and stop the timer', () => {
      const vm = new Component({
        propsData,
      }).$mount();

      expect(vm.started).to.equal(false);

      vm.timerToggle();
      expect(vm.started).to.equal(true);

      vm.timerToggle();
      expect(vm.started).to.equal(false);
    });

    describe('timerReset', () => {
      let beginCountdownIntervalSpy;
      let vm;

      beforeEach(() => {
        vm = new Component({
          propsData,
        }).$mount();

        beginCountdownIntervalSpy = sinon.spy(vm, 'beginCountdownInterval');
        beginCountdownIntervalSpy.reset();
      });

      afterEach(() => {
        beginCountdownIntervalSpy.restore();
      });

      it('should set the timeRemaining', () => {
        vm.timerReset();
        expect(vm.timeRemaining).to.equal(timeRemaining);
      });

      it('should set the timeFraction', () => {
        vm.timerReset();
        expect(vm.timeFraction).to.equal((100 / timeRemaining) * 0.01);
      });

      it('should set the countdown text', () => {
        vm.timerReset();
        const expectedText = d3.select(vm.$el.querySelector('#countdown-text')).text();
        expect(expectedText).to.equal('01:05:23');
      });

      it('should reset the chimes (done nofication)', () => {
        const pauseSpy = sinon.spy(vm.chimes, 'pause');

        expect(pauseSpy.notCalled).to.equal(true);

        vm.timerReset();

        expect(pauseSpy.calledOnce).to.equal(true);
        expect(vm.chimes.currentTime).to.equal(0);
      });

      it('should begin the countdown interval', () => {
        expect(beginCountdownIntervalSpy.notCalled).to.equal(true);

        vm.timerReset();

        expect(beginCountdownIntervalSpy.calledOnce).to.equal(true);
      });
    });

    it('beginCountdownInterval should clear the previous countdown interval and apply it again', () => {
      const vm = new Component({
        propsData,
      });

      expect(vm.interval).to.equal(null);

      vm.$mount();

      const interval1 = vm.interval;
      expect(interval1).not.to.equal(null);

      vm.beginCountdownInterval();

      const interval2 = vm.interval;
      expect(interval2).not.to.equal(null);
      expect(interval2).not.to.equal(interval1);

      vm.beginCountdownInterval();

      const interval3 = vm.interval;
      expect(interval3).not.to.equal(null);
      expect(interval3).not.to.equal(interval1);
      expect(interval3).not.to.equal(interval2);
    });

    describe('timerTick', () => {
      let beginCountdownIntervalSpy;
      let vm;

      beforeEach(() => {
        vm = new Component({
          propsData,
        }).$mount();

        beginCountdownIntervalSpy = sinon.spy(vm, 'beginCountdownInterval');
        beginCountdownIntervalSpy.reset();
      });

      afterEach(() => {
        beginCountdownIntervalSpy.restore();
      });

      it('should call timerDone if the time has run out', () => {
        vm.$set(vm.$data, 'timeRemaining', 0);
        const timerDoneSpy = sinon.spy(vm, 'timerDone');

        expect(timerDoneSpy.notCalled).to.equal(true);

        vm.timerTick();

        expect(timerDoneSpy.called).to.equal(true);
        timerDoneSpy.restore();
      });

      it('should not call timerDone if the time has not run out', () => {
        const timerDoneSpy = sinon.spy(vm, 'timerDone');

        expect(timerDoneSpy.notCalled).to.equal(true);

        vm.timerTick();

        expect(timerDoneSpy.called).to.equal(false);
        timerDoneSpy.restore();
      });

      it('should update the timePercentage and timeRemaining if the timer has started and time has not run out', () => {
        const timeFraction = vm.timeFraction;
        const originalTimerPercentage = vm.timerPercentage;
        const originalTimeRemaining = vm.timeRemaining;

        vm.$set(vm.$data, 'started', true);

        vm.timerTick();

        expect(vm.timerPercentage).to.equal(originalTimerPercentage - timeFraction);
        expect(vm.timeRemaining).to.equal(originalTimeRemaining - 1);
      });

      it('should not update the timePercentage and timeRemaining if the timer has not been started', () => {
        const originalTimerPercentage = vm.timerPercentage;
        const originalTimeRemaining = vm.timeRemaining;

        vm.$set(vm.$data, 'started', false);

        vm.timerTick();

        expect(vm.timerPercentage).to.equal(originalTimerPercentage);
        expect(vm.timeRemaining).to.equal(originalTimeRemaining);
      });

      it('should update the countdown text if the timer has started and time has not run out', () => {
        const text = d3.select(vm.$el.querySelector('#countdown-text'));

        vm.$set(vm.$data, 'started', true);

        vm.timerTick();

        expect(text.text()).to.equal('01:05:22');

        vm.timerTick();

        expect(text.text()).to.equal('01:05:21');
      });

      it('should not update the countdown text if the timer has not been started', () => {
        const text = d3.select(vm.$el.querySelector('#countdown-text'));

        vm.$set(vm.$data, 'started', false);

        vm.timerTick();

        expect(text.text()).to.equal('01:05:23');

        vm.timerTick();

        expect(text.text()).to.equal('01:05:23');
      });
    });

    // timerDone() {
    //   this.started = false;
    //   if (this.hours !== 0 || this.minutes !== 0 || this.seconds !== 0) {
    //     this.chimes.play();
    //   }
    // },
    describe('timerDone', () => {
      it('should stop the timer', () => {
        const vm = new Component({
          propsData,
        }).$mount();

        vm.$set(vm.$data, 'started', true);

        expect(vm.started).to.equal(true);

        vm.timerDone();

        expect(vm.started).to.equal(false);
      });

      it('should not play the chimes sound if the initial countdown is set to 00:00:00', () => {
        const vm = new Component({
          propsData: {
            hours: 0,
            minutes: 0,
            seconds: 0,
          },
        }).$mount();

        const playSpy = sinon.spy(vm.chimes, 'play');

        expect(playSpy.notCalled).to.equal(true);

        vm.timerDone();

        expect(playSpy.notCalled).to.equal(true);
        playSpy.restore();
      });

      it('should play the chimes sound if the initial countdown seconds are set', () => {
        const vm = new Component({
          propsData: {
            hours: 0,
            minutes: 0,
            seconds: 1,
          },
        }).$mount();

        const playSpy = sinon.spy(vm.chimes, 'play');

        expect(playSpy.notCalled).to.equal(true);

        vm.timerDone();

        expect(playSpy.called).to.equal(true);
        playSpy.restore();
      });

      it('should play the chimes sound if the initial countdown minutes are set', () => {
        const vm = new Component({
          propsData: {
            hours: 0,
            minutes: 1,
            seconds: 0,
          },
        }).$mount();

        const playSpy = sinon.spy(vm.chimes, 'play');

        expect(playSpy.notCalled).to.equal(true);

        vm.timerDone();

        expect(playSpy.called).to.equal(true);
        playSpy.restore();
      });

      it('should play the chimes sound if the initial countdown hours are set', () => {
        const vm = new Component({
          propsData: {
            hours: 1,
            minutes: 0,
            seconds: 0,
          },
        }).$mount();

        const playSpy = sinon.spy(vm.chimes, 'play');

        expect(playSpy.notCalled).to.equal(true);

        vm.timerDone();

        expect(playSpy.called).to.equal(true);
        playSpy.restore();
      });
    });
  });

  describe('watchers', () => {
    it('hours should stop the timer and reset it', (done) => {
      const vm = new Component({
        propsData,
      }).$mount();

      const timerResetSpy = sinon.spy(vm, 'timerReset');

      vm.$set(vm.$data, 'started', true);

      expect(vm.started).to.equal(true);
      expect(timerResetSpy.notCalled).to.equal(true);

      vm.$set(vm.$props, 'hours', 3);

      vm.$nextTick(() => {
        vm.$nextTick(() => {
          expect(vm.started).to.equal(false);
          expect(timerResetSpy.called).to.equal(true);
          timerResetSpy.restore();
          done();
        });
      });
    });

    it('minutes should stop the timer and reset it', (done) => {
      const vm = new Component({
        propsData,
      }).$mount();

      const timerResetSpy = sinon.spy(vm, 'timerReset');

      vm.$set(vm.$data, 'started', true);

      expect(vm.started).to.equal(true);
      expect(timerResetSpy.notCalled).to.equal(true);

      vm.$set(vm.$props, 'minutes', 3);

      vm.$nextTick(() => {
        vm.$nextTick(() => {
          expect(vm.started).to.equal(false);
          expect(timerResetSpy.called).to.equal(true);
          timerResetSpy.restore();
          done();
        });
      });
    });

    it('seconds should stop the timer and reset it', (done) => {
      const vm = new Component({
        propsData,
      }).$mount();

      const timerResetSpy = sinon.spy(vm, 'timerReset');

      vm.$set(vm.$data, 'started', true);

      expect(vm.started).to.equal(true);
      expect(timerResetSpy.notCalled).to.equal(true);

      vm.$set(vm.$props, 'seconds', 3);

      vm.$nextTick(() => {
        vm.$nextTick(() => {
          expect(vm.started).to.equal(false);
          expect(timerResetSpy.called).to.equal(true);
          timerResetSpy.restore();
          done();
        });
      });
    });
  });
});
