/**
 * Please note that all of these tests must be run in a 1280x720 browser or they will fail.
 * The headless Chrome running these tests has been set up accordingly. See karma.conf.js
 * for more details.
 */

import { mount } from '@vue/test-utils';

import CountdownTimer from '@/components/CountdownTimer';

const d3 = require('d3');

const tau = 2 * Math.PI;
const timeRemaining = 3923;
let propsData;
let wrapper;

describe('CountdownTimer.vue', () => {
  beforeEach(() => {
    propsData = {
      hours: 1,
      minutes: 5,
      seconds: 23,
    };

    wrapper = mount(CountdownTimer, {
      propsData,
      attachToDocument: true,
    });
  });

  afterEach(() => {
    wrapper.destroy();
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
    const donut = wrapper.find('#timer > #donut');

    expect(donut.exists()).to.be(true);
    expect(donut.attributes('width')).to.equal('100%');
    expect(donut.attributes('height')).to.equal('100%');
    expect(donut.attributes('preserveAspectRatio')).to.equal('xMinYMin meet');

    const path = donut.find('g > #countdown-path');

    expect(path.exists()).to.be(true);
    expect(path.attributes('fill')).to.equal('#000000');
    expect(path.attributes('d')).to.equal(`${wrapper.vm.arc}`);

    const text = donut.find('#countdown-text');

    expect(text.exists()).to.be(true);
    expect(text.attributes('text-anchor')).to.equal('middle');
    expect(text.attributes('fill')).to.equal('#000000');
    expect(text.attributes('x')).to.equal(`${wrapper.vm.radius}`);
    expect(text.attributes('style')).to.equal('font-size: 72px;');
    expect(text.text()).to.equal('01:05:23');

    const playPause = donut.find('#play-pause');
    const playPauseRect = playPause.find('rect.opacity-0');
    const playPauseGroups = playPause.findAll('g');

    expect(playPause.exists()).to.be(true);
    expect(playPause.attributes('viewBox')).to.equal('0 0 100 100');
    expect(playPause.attributes('width')).to.equal('72px');
    expect(playPause.attributes('height')).to.equal('72px');
    expect(playPause.attributes('fill')).to.equal('#000000');
    expect(playPauseRect.attributes('width')).to.equal('100%');
    expect(playPauseRect.attributes('height')).to.equal('100%');
    expect(playPauseGroups.length).to.equal(2);
    expect(playPauseGroups.at(0).find('polygon').exists()).to.be(true);
    expect(playPauseGroups.at(1).findAll('rect').length).to.equal(2);

    const reset = donut.find('#reset');
    const resetRect = reset.find('rect.opacity-0');
    const resetGroups = reset.findAll('g');

    expect(reset.exists()).to.be(true);
    expect(reset.attributes('viewBox')).to.equal('0 0 100 100');
    expect(reset.attributes('width')).to.equal('72px');
    expect(reset.attributes('height')).to.equal('72px');
    expect(reset.attributes('fill')).to.equal('#000000');
    expect(resetRect.attributes('width')).to.equal('100%');
    expect(resetRect.attributes('height')).to.equal('100%');
    expect(resetGroups.length).to.equal(4);
    expect(resetGroups.at(0).find('polygon').exists()).to.be(true);
    expect(resetGroups.at(1).find('path').exists()).to.be(true);
    expect(resetGroups.at(2).findAll('path').length).to.equal(2);
    expect(resetGroups.at(3).find('polygon').exists()).to.be(true);
  });

  it('should call the correct initialization functions on mount', () => {
    wrapper.destroy();

    wrapper = mount(CountdownTimer, {
      propsData,
      attachToDocument: true,
      methods: {
        setCountdownCoords: sinon.spy(),
        setResetCoords: sinon.spy(),
        setPlayCoords: sinon.spy(),
        setPathEndAngle: sinon.spy(),
        timerReset: sinon.spy(),
      },
    });

    expect(wrapper.vm.methods.setCountdownCoords.calledOnce).to.equal(true);
    expect(wrapper.vm.methods.setResetCoords.calledOnce).to.equal(true);
    expect(wrapper.vm.methods.setPlayCoords.calledOnce).to.equal(true);
    expect(wrapper.vm.methods.setPathEndAngle.calledOnce).to.equal(true);
    expect(wrapper.vm.methods.timerReset.calledOnce).to.equal(true);
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

        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData,
          attachToDocument: true,
        });

        expect(consoleSpy.lastCall.args[0].indexOf('Missing required prop: "hours"')).to.not.equal(-1);
      });

      it('should be a Number', () => {
        propsData.hours = 'test';

        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData,
          attachToDocument: true,
        });

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: type check failed for prop "hours". Expected Number, got String.')).to.not.equal(-1);
      });

      it('should be greater than 0', () => {
        propsData.hours = -1;

        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData,
          attachToDocument: true,
        });

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: custom validator check failed for prop "hours"')).to.not.equal(-1);
      });

      it('should be less than 59', () => {
        propsData.hours = 60;

        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData,
          attachToDocument: true,
        });

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: custom validator check failed for prop "hours"')).to.not.equal(-1);
      });
    });

    describe('minutes property', () => {
      it('should be required', () => {
        delete propsData.minutes;

        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData,
          attachToDocument: true,
        });

        expect(consoleSpy.lastCall.args[0].indexOf('Missing required prop: "minutes"')).to.not.equal(-1);
      });

      it('should be a Number', () => {
        propsData.minutes = 'test';

        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData,
          attachToDocument: true,
        });

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: type check failed for prop "minutes". Expected Number, got String.')).to.not.equal(-1);
      });

      it('should be greater than 0', () => {
        propsData.minutes = -1;

        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData,
          attachToDocument: true,
        });

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: custom validator check failed for prop "minutes"')).to.not.equal(-1);
      });

      it('should be less than 59', () => {
        propsData.minutes = 60;

        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData,
          attachToDocument: true,
        });

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: custom validator check failed for prop "minutes"')).to.not.equal(-1);
      });
    });

    describe('seconds property', () => {
      it('should be required', () => {
        delete propsData.seconds;

        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData,
          attachToDocument: true,
        });

        expect(consoleSpy.lastCall.args[0].indexOf('Missing required prop: "seconds"')).to.not.equal(-1);
      });

      it('should be a Number', () => {
        propsData.seconds = 'test';

        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData,
          attachToDocument: true,
        });

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: type check failed for prop "seconds". Expected Number, got String.')).to.not.equal(-1);
      });

      it('should be greater than 0', () => {
        propsData.seconds = -1;

        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData,
          attachToDocument: true,
        });

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: custom validator check failed for prop "seconds"')).to.not.equal(-1);
      });

      it('should be less than 59', () => {
        propsData.seconds = 60;

        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData,
          attachToDocument: true,
        });

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: custom validator check failed for prop "seconds"')).to.not.equal(-1);
      });
    });

    describe('foregroundColor property', () => {
      it('should default to #000000', () => {
        expect(wrapper.vm.foregroundColor).to.equal('#000000');
      });

      it('should be a String', () => {
        propsData.foregroundColor = true;

        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData,
          attachToDocument: true,
        });

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: type check failed for prop "foregroundColor". Expected String, got Boolean.')).to.not.equal(-1);
      });
    });

    describe('backgroundColor property', () => {
      it('should default to #ffffff', () => {
        expect(wrapper.vm.backgroundColor).to.equal('#ffffff');
      });

      it('should be a String', () => {
        propsData.backgroundColor = true;

        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData,
          attachToDocument: true,
        });

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: type check failed for prop "backgroundColor". Expected String, got Boolean.')).to.not.equal(-1);
      });
    });
  });

  describe('computed properties', () => {
    it('timeReadable should display time in hh:mm:ss format', () => {
      expect(wrapper.vm.timeReadable).to.equal('01:05:23');
    });

    it('hoursReadable should pad the hours to two digits with a leading zero for digits 1 through 9', (done) => {
      expect(wrapper.vm.hoursReadable).to.equal('01');

      wrapper.setProps({ hours: 7 });
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.hoursReadable).to.equal('07');

        wrapper.setProps({ hours: 9 });
        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.hoursReadable).to.equal('09');

          wrapper.setProps({ hours: 24 });
          wrapper.vm.$nextTick(() => {
            expect(wrapper.vm.hoursReadable).to.equal('24');

            wrapper.setProps({ hours: 48 });
            wrapper.vm.$nextTick(() => {
              expect(wrapper.vm.hoursReadable).to.equal('48');
              done();
            });
          });
        });
      });
    });

    it('minutesReadable should pad the hours to two digits with a leading zero for digits 1 through 9', (done) => {
      expect(wrapper.vm.minutesReadable).to.equal('05');

      wrapper.setProps({ minutes: 7 });
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.minutesReadable).to.equal('07');

        wrapper.setProps({ minutes: 9 });
        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.minutesReadable).to.equal('09');

          wrapper.setProps({ minutes: 24 });
          wrapper.vm.$nextTick(() => {
            expect(wrapper.vm.minutesReadable).to.equal('24');

            wrapper.setProps({ minutes: 48 });
            wrapper.vm.$nextTick(() => {
              expect(wrapper.vm.minutesReadable).to.equal('48');
              done();
            });
          });
        });
      });
    });

    it('secondsReadable should pad the hours to two digits with a leading zero for digits 1 through 9', (done) => {
      expect(wrapper.vm.secondsReadable).to.equal('23');

      wrapper.setProps({ seconds: 7 });
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.secondsReadable).to.equal('07');

        wrapper.setProps({ seconds: 9 });
        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.secondsReadable).to.equal('09');

          wrapper.setProps({ seconds: 24 });
          wrapper.vm.$nextTick(() => {
            expect(wrapper.vm.secondsReadable).to.equal('24');

            wrapper.setProps({ seconds: 48 });
            wrapper.vm.$nextTick(() => {
              expect(wrapper.vm.secondsReadable).to.equal('48');
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

        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData,
          attachToDocument: true,
          computed: {
            windowHeight() {
              return windowHeight;
            },
            windowWidth() {
              return windowWidth;
            },
          },
        });

        expect(wrapper.vm.svgBounds).to.equal(windowHeight);
      });

      it('should return windowWidth if it is less than windowHeight', () => {
        const windowHeight = 800;
        const windowWidth = 400;

        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData,
          attachToDocument: true,
          computed: {
            windowHeight() {
              return windowHeight;
            },
            windowWidth() {
              return windowWidth;
            },
          },
        });

        expect(wrapper.vm.svgBounds).to.equal(windowWidth);
      });

      it('should return windowHeight if it is equal to windowWidth', () => {
        const windowHeight = 700;
        const windowWidth = 700;

        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData,
          attachToDocument: true,
          computed: {
            windowHeight() {
              return windowHeight;
            },
            windowWidth() {
              return windowWidth;
            },
          },
        });

        expect(wrapper.vm.svgBounds).to.equal(windowHeight);
      });
    });

    describe('radius', () => {
      it('should return svgBounds divided by 2', () => {
        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData,
          attachToDocument: true,
          computed: {
            svgBounds() {
              return 730;
            },
          },
        });

        expect(wrapper.vm.radius).to.equal(365);
      });
    });

    describe('fontSize', () => {
      it('should return radius divided by 5 in pixels', () => {
        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData,
          attachToDocument: true,
          computed: {
            radius() {
              return 680;
            },
          },
        });

        expect(wrapper.vm.fontSize).to.equal('136px');
      });
    });

    describe('donutViewBox', () => {
      it('should return the viewBox attribute for donut timer SVG using svgBounds', () => {
        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData,
          attachToDocument: true,
          computed: {
            svgBounds() {
              return 730;
            },
          },
        });

        expect(wrapper.vm.donutViewBox).to.equal('0 0 730 730');
      });
    });

    describe('gTransform', () => {
      it('should return the translation function for the donut timer group transform attribute using radius', () => {
        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData,
          attachToDocument: true,
          computed: {
            radius() {
              return 360;
            },
          },
        });

        expect(wrapper.vm.gTransform).to.equal('translate(360,360)');
      });
    });

    describe('arc', () => {
      it('should return the arc function used for the countdown path within the donut timer', () => {
        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData,
          attachToDocument: true,
          computed: {
            radius() {
              return 360;
            },
          },
        });

        const expectedArc = d3.arc()
          .innerRadius(180)
          .outerRadius(360)
          .startAngle(0);

        expect(`${wrapper.vm.arc}`).to.equal(`${expectedArc}`);
      });
    });
  });

  describe('methods', () => {
    it('setCountdownCoords should set and return the x/y coordinates for the countdown text', () => {
      const coordinates = wrapper.vm.setCountdownCoords();
      const countdownOffset = wrapper.find('#countdown-text').element.getBoundingClientRect().height / 4;
      const expectedY = wrapper.vm.radius + countdownOffset;

      expect(coordinates.x).to.equal('360');
      expect(coordinates.y).to.equal(`${expectedY}`);
    });

    it('setResetCoords should set and return the x/y coordinates for the reset SVG', () => {
      const coordinates = wrapper.vm.setResetCoords();
      const reload = wrapper.find('#countdown-text').element;
      const expectedX = wrapper.vm.radius - reload.getBoundingClientRect().width;
      const expectedY = wrapper.vm.radius + (reload.getBoundingClientRect().height / 1.5);

      expect(coordinates.x).to.equal(`${expectedX}`);
      expect(coordinates.y).to.equal(`${expectedY}`);
    });

    it('setPlayCoords should set and return the x/y coordinates for the play/pause SVG', () => {
      const coordinates = wrapper.vm.setPlayCoords();
      const playPause = wrapper.find('#play-pause').element;
      const expectedX = wrapper.vm.radius;
      const expectedY = wrapper.vm.radius + (playPause.getBoundingClientRect().height / 1.5);

      expect(coordinates.x).to.equal(`${expectedX}`);
      expect(coordinates.y).to.equal(`${expectedY}`);
    });

    it('setPathEndAngle should set and return the endAngle datum for the donut countdown path', () => {
      const endAngle = wrapper.vm.setPathEndAngle();

      expect(endAngle).to.equal(0 * tau);
    });

    // arcTween testing should go here. How the hell are we going to do that??

    it('timerToggle should start and stop the timer', () => {
      expect(wrapper.vm.started).to.equal(false);

      wrapper.vm.timerToggle();
      expect(wrapper.vm.started).to.equal(true);

      wrapper.vm.timerToggle();
      expect(wrapper.vm.started).to.equal(false);
    });

    describe('timerReset', () => {
      beforeEach(() => {
        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData,
          attachToDocument: true,
          methods: {
            beginCountdownInterval: sinon.spy(),
          },
        });
      });

      it('should set the timeRemaining', () => {
        wrapper.vm.timerReset();
        expect(wrapper.vm.timeRemaining).to.equal(timeRemaining);
      });

      it('should set the timeFraction', () => {
        wrapper.vm.timerReset();
        expect(wrapper.vm.timeFraction).to.equal((100 / timeRemaining) * 0.01);
      });

      it('should set the countdown text', () => {
        wrapper.vm.timerReset();
        expect(wrapper.find('#countdown-text').text()).to.equal('01:05:23');
      });

      it('should reset the chimes (done nofication)', () => {
        const pauseSpy = sinon.spy(wrapper.vm.chimes, 'pause');

        expect(pauseSpy.notCalled).to.equal(true);

        wrapper.vm.timerReset();

        expect(pauseSpy.calledOnce).to.equal(true);
        expect(wrapper.vm.chimes.currentTime).to.equal(0);
      });

      it('should begin the countdown interval', () => {
        expect(wrapper.vm.beginCountdownInterval.notCalled).to.equal(true);

        wrapper.vm.timerReset();

        expect(wrapper.vm.beginCountdownInterval.calledOnce).to.equal(true);
      });
    });

    it('beginCountdownInterval should clear the previous countdown interval and apply it again', () => {
      expect(wrapper.vm.interval).to.equal(null);

      wrapper.vm.beginCountdownInterval();

      const interval1 = wrapper.vm.interval;
      expect(interval1).not.to.equal(null);

      wrapper.vm.beginCountdownInterval();

      const interval2 = wrapper.vm.interval;
      expect(interval2).not.to.equal(null);
      expect(interval2).not.to.equal(interval1);
    });

    describe('timerTick', () => {
      beforeEach(() => {
        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData,
          attachToDocument: true,
          methods: {
            beginCountdownInterval: sinon.spy(),
          },
        });
      });

      it('should call timerDone if the time has run out', () => {
        wrapper.setData({ timeRemaining: 0 });

        const timerDoneSpy = sinon.spy(wrapper.vm, 'timerDone');

        expect(timerDoneSpy.notCalled).to.equal(true);

        wrapper.vm.timerTick();

        expect(timerDoneSpy.called).to.equal(true);
        timerDoneSpy.restore();
      });

      it('should not call timerDone if the time has not run out', () => {
        const timerDoneSpy = sinon.spy(wrapper.vm, 'timerDone');

        expect(timerDoneSpy.notCalled).to.equal(true);

        wrapper.vm.timerTick();

        expect(timerDoneSpy.called).to.equal(false);
        timerDoneSpy.restore();
      });

      it('should update the timePercentage and timeRemaining if the timer has started and time has not run out', () => {
        const timeFraction = wrapper.vm.timeFraction;
        const originalTimerPercentage = wrapper.vm.timerPercentage;
        const originalTimeRemaining = wrapper.vm.timeRemaining;

        wrapper.setData({ started: true });

        wrapper.vm.timerTick();

        expect(wrapper.vm.timerPercentage).to.equal(originalTimerPercentage - timeFraction);
        expect(wrapper.vm.timeRemaining).to.equal(originalTimeRemaining - 1);
      });

      it('should not update the timePercentage and timeRemaining if the timer has not been started', () => {
        const originalTimerPercentage = wrapper.vm.timerPercentage;
        const originalTimeRemaining = wrapper.vm.timeRemaining;

        wrapper.setData({ started: false });

        wrapper.vm.timerTick();

        expect(wrapper.vm.timerPercentage).to.equal(originalTimerPercentage);
        expect(wrapper.vm.timeRemaining).to.equal(originalTimeRemaining);
      });

      it('should update the countdown text if the timer has started and time has not run out', () => {
        const text = wrapper.find('#countdown-text');

        wrapper.setData({ started: true });

        wrapper.vm.timerTick();

        expect(text.text()).to.equal('01:05:22');

        wrapper.vm.timerTick();

        expect(text.text()).to.equal('01:05:21');
      });

      it('should not update the countdown text if the timer has not been started', () => {
        const text = wrapper.find('#countdown-text');

        wrapper.setData({ started: false });

        wrapper.vm.timerTick();

        expect(text.text()).to.equal('01:05:23');

        wrapper.vm.timerTick();

        expect(text.text()).to.equal('01:05:23');
      });
    });

    describe('timerDone', () => {
      it('should stop the timer', () => {
        wrapper.setData({ started: true });

        expect(wrapper.vm.started).to.equal(true);

        wrapper.vm.timerDone();

        expect(wrapper.vm.started).to.equal(false);
      });

      it('should not play the chimes sound if the initial countdown is set to 00:00:00', () => {
        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData: {
            hours: 0,
            minutes: 0,
            seconds: 0,
          },
          attachToDocument: true,
        });

        const playSpy = sinon.spy(wrapper.vm.chimes, 'play');

        expect(playSpy.notCalled).to.equal(true);

        wrapper.vm.timerDone();

        expect(playSpy.notCalled).to.equal(true);
        playSpy.restore();
      });

      it('should play the chimes sound if the initial countdown seconds are set', () => {
        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData: {
            hours: 0,
            minutes: 0,
            seconds: 1,
          },
          attachToDocument: true,
        });

        const playSpy = sinon.spy(wrapper.vm.chimes, 'play');

        expect(playSpy.notCalled).to.equal(true);

        wrapper.vm.timerDone();

        expect(playSpy.called).to.equal(true);
        playSpy.restore();
      });

      it('should play the chimes sound if the initial countdown minutes are set', () => {
        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData: {
            hours: 0,
            minutes: 1,
            seconds: 0,
          },
          attachToDocument: true,
        });

        const playSpy = sinon.spy(wrapper.vm.chimes, 'play');

        expect(playSpy.notCalled).to.equal(true);

        wrapper.vm.timerDone();

        expect(playSpy.called).to.equal(true);
        playSpy.restore();
      });

      it('should play the chimes sound if the initial countdown hours are set', () => {
        wrapper.destroy();

        wrapper = mount(CountdownTimer, {
          propsData: {
            hours: 1,
            minutes: 0,
            seconds: 0,
          },
          attachToDocument: true,
        });

        const playSpy = sinon.spy(wrapper.vm.chimes, 'play');

        expect(playSpy.notCalled).to.equal(true);

        wrapper.vm.timerDone();

        expect(playSpy.called).to.equal(true);
        playSpy.restore();
      });
    });
  });

  describe('watchers', () => {
    it('hours should stop the timer and reset it', (done) => {
      const timerResetSpy = sinon.spy(wrapper.vm, 'timerReset');

      wrapper.setData({ started: true });

      expect(wrapper.vm.started).to.equal(true);
      expect(timerResetSpy.notCalled).to.equal(true);

      wrapper.setProps({ hours: 3 });

      wrapper.vm.$nextTick(() => {
        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.started).to.equal(false);
          expect(timerResetSpy.called).to.equal(true);
          timerResetSpy.restore();
          done();
        });
      });
    });

    it('minutes should stop the timer and reset it', (done) => {
      const timerResetSpy = sinon.spy(wrapper.vm, 'timerReset');

      wrapper.setData({ started: true });

      expect(wrapper.vm.started).to.equal(true);
      expect(timerResetSpy.notCalled).to.equal(true);

      wrapper.setProps({ minutes: 3 });

      wrapper.vm.$nextTick(() => {
        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.started).to.equal(false);
          expect(timerResetSpy.called).to.equal(true);
          timerResetSpy.restore();
          done();
        });
      });
    });

    it('seconds should stop the timer and reset it', (done) => {
      const timerResetSpy = sinon.spy(wrapper.vm, 'timerReset');

      wrapper.setData({ started: true });

      expect(wrapper.vm.started).to.equal(true);
      expect(timerResetSpy.notCalled).to.equal(true);

      wrapper.setProps({ seconds: 3 });

      wrapper.vm.$nextTick(() => {
        wrapper.vm.$nextTick(() => {
          expect(wrapper.vm.started).to.equal(false);
          expect(timerResetSpy.called).to.equal(true);
          timerResetSpy.restore();
          done();
        });
      });
    });
  });
});
