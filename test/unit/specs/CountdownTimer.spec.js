/**
 * Please note that all of these tests must be run in a 1280x720 browser or they will fail.
 * The headless Chrome running these tests has been set up accordingly. See karma.conf.js
 * for more details.
 */

import { mount } from '@vue/test-utils';
import merge from 'lodash/merge';

import CountdownTimer from '@/components/CountdownTimer';

const d3 = require('d3');

describe('CountdownTimer.vue', () => {
  const tau = 2 * Math.PI;
  const timeRemaining = 3923;

  let wrapper;

  function initializeWrapper(options) {
    const defaultOptions = {
      propsData: {
        hours: 1,
        minutes: 5,
        seconds: 23,
      },
      attachToDocument: true,
    };

    const mergedOptions = merge({}, defaultOptions, options);

    return mount(CountdownTimer, mergedOptions);
  }

  beforeEach(() => {
    wrapper = initializeWrapper();
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

  it('renders correctly', () => {
    const donut = wrapper.find('#timer > #donut');

    expect(donut.exists()).to.equal(true);
    expect(donut.attributes('width')).to.equal('100%');
    expect(donut.attributes('height')).to.equal('100%');
    expect(donut.attributes('preserveAspectRatio')).to.equal('xMinYMin meet');

    const path = donut.find('g > #countdown-path');

    expect(path.exists()).to.equal(true);
    expect(path.attributes('fill')).to.equal('#000000');
    expect(path.attributes('d')).to.equal(`${wrapper.vm.arc}`);

    const text = donut.find('#countdown-text');

    expect(text.exists()).to.equal(true);
    expect(text.attributes('text-anchor')).to.equal('middle');
    expect(text.attributes('fill')).to.equal('#000000');
    expect(text.attributes('x')).to.equal(`${wrapper.vm.radius}`);
    expect(text.attributes('style')).to.equal('font-size: 72px;');
    expect(text.text()).to.equal('01:05:23');

    const playPause = donut.find('#play-pause');
    const playPauseRect = playPause.find('rect.opacity-0');
    const playPauseGroups = playPause.findAll('g');

    expect(playPause.exists()).to.equal(true);
    expect(playPause.attributes('viewBox')).to.equal('0 0 100 100');
    expect(playPause.attributes('width')).to.equal('72px');
    expect(playPause.attributes('height')).to.equal('72px');
    expect(playPause.attributes('fill')).to.equal('#000000');
    expect(playPauseRect.attributes('width')).to.equal('100%');
    expect(playPauseRect.attributes('height')).to.equal('100%');
    expect(playPauseGroups.length).to.equal(2);
    expect(playPauseGroups.at(0).find('polygon').exists()).to.equal(true);
    expect(playPauseGroups.at(1).findAll('rect').length).to.equal(2);

    const reset = donut.find('#reset');
    const resetRect = reset.find('rect.opacity-0');
    const resetGroups = reset.findAll('g');

    expect(reset.exists()).to.equal(true);
    expect(reset.attributes('viewBox')).to.equal('0 0 100 100');
    expect(reset.attributes('width')).to.equal('72px');
    expect(reset.attributes('height')).to.equal('72px');
    expect(reset.attributes('fill')).to.equal('#000000');
    expect(resetRect.attributes('width')).to.equal('100%');
    expect(resetRect.attributes('height')).to.equal('100%');
    expect(resetGroups.length).to.equal(4);
    expect(resetGroups.at(0).find('polygon').exists()).to.equal(true);
    expect(resetGroups.at(1).find('path').exists()).to.equal(true);
    expect(resetGroups.at(2).findAll('path').length).to.equal(2);
    expect(resetGroups.at(3).find('polygon').exists()).to.equal(true);
  });

  it('calls the correct initialization functions on mount', () => {
    wrapper.destroy();

    const setCountdownCoordsStub = sinon.stub();
    const setResetCoordsStub = sinon.stub();
    const setPlayCoordsStub = sinon.stub();
    const setPathEndAngleStub = sinon.stub();
    const timerResetStub = sinon.stub();

    wrapper = initializeWrapper({
      methods: {
        setCountdownCoords: setCountdownCoordsStub,
        setResetCoords: setResetCoordsStub,
        setPlayCoords: setPlayCoordsStub,
        setPathEndAngle: setPathEndAngleStub,
        timerReset: timerResetStub,
      },
    });

    expect(setCountdownCoordsStub.calledOnce).to.equal(true);
    expect(setResetCoordsStub.calledOnce).to.equal(true);
    expect(setPlayCoordsStub.calledOnce).to.equal(true);
    expect(setPathEndAngleStub.calledOnce).to.equal(true);
    expect(timerResetStub.calledOnce).to.equal(true);
  });

  describe('props', () => {
    describe('hours property', () => {
      it('is required', () => {
        expect(CountdownTimer.props.hours.required).to.equal(true);
      });

      it('is a Number', () => {
        expect(CountdownTimer.props.hours.type).to.equal(Number);
      });

      it('is greater than 0', () => {
        expect(CountdownTimer.props.hours.validator(-1)).to.equal(false);
      });

      it('is less than 59', () => {
        expect(CountdownTimer.props.hours.validator(60)).to.equal(false);
      });
    });

    describe('minutes property', () => {
      it('is required', () => {
        expect(CountdownTimer.props.minutes.required).to.equal(true);
      });

      it('is a Number', () => {
        expect(CountdownTimer.props.minutes.type).to.equal(Number);
      });

      it('is greater than 0', () => {
        expect(CountdownTimer.props.minutes.validator(-1)).to.equal(false);
      });

      it('is less than 59', () => {
        expect(CountdownTimer.props.minutes.validator(60)).to.equal(false);
      });
    });

    describe('seconds property', () => {
      it('is required', () => {
        expect(CountdownTimer.props.seconds.required).to.equal(true);
      });

      it('is a Number', () => {
        expect(CountdownTimer.props.seconds.type).to.equal(Number);
      });

      it('is greater than 0', () => {
        expect(CountdownTimer.props.seconds.validator(-1)).to.equal(false);
      });

      it('is less than 59', () => {
        expect(CountdownTimer.props.seconds.validator(60)).to.equal(false);
      });
    });

    describe('foregroundColor property', () => {
      it('defaults to #000000', () => {
        expect(CountdownTimer.props.foregroundColor.default).to.equal('#000000');
      });

      it('is a String', () => {
        expect(CountdownTimer.props.foregroundColor.type).to.equal(String);
      });
    });

    describe('backgroundColor property', () => {
      it('defaults to #ffffff', () => {
        expect(CountdownTimer.props.backgroundColor.default).to.equal('#ffffff');
      });

      it('is a String', () => {
        expect(CountdownTimer.props.backgroundColor.type).to.equal(String);
      });
    });
  });

  describe('computed properties', () => {
    describe('timeReadable', () => {
      it('displays time in hh:mm:ss format', () => {
        expect(wrapper.vm.timeReadable).to.equal('01:05:23');
      });
    });

    describe('hoursReadable', () => {
      it('pads the hours to two digits with a leading zero for digits 1 through 9', () => {
        wrapper.setProps({ hours: 7 });

        expect(wrapper.vm.hoursReadable).to.equal('07');

        wrapper.setProps({ hours: 9 });

        expect(wrapper.vm.hoursReadable).to.equal('09');

        wrapper.setProps({ hours: 24 });

        expect(wrapper.vm.hoursReadable).to.equal('24');

        wrapper.setProps({ hours: 48 });

        expect(wrapper.vm.hoursReadable).to.equal('48');
      });
    });

    describe('minutesReadable', () => {
      it('pads the minutes to two digits with a leading zero for digits 1 through 9', () => {
        wrapper.setProps({ minutes: 7 });

        expect(wrapper.vm.minutesReadable).to.equal('07');

        wrapper.setProps({ minutes: 9 });

        expect(wrapper.vm.minutesReadable).to.equal('09');

        wrapper.setProps({ minutes: 24 });

        expect(wrapper.vm.minutesReadable).to.equal('24');

        wrapper.setProps({ minutes: 48 });

        expect(wrapper.vm.minutesReadable).to.equal('48');
      });
    });

    describe('secondsReadable', () => {
      it('pads the seconds to two digits with a leading zero for digits 1 through 9', () => {
        wrapper.setProps({ seconds: 7 });

        expect(wrapper.vm.secondsReadable).to.equal('07');

        wrapper.setProps({ seconds: 9 });

        expect(wrapper.vm.secondsReadable).to.equal('09');

        wrapper.setProps({ seconds: 24 });

        expect(wrapper.vm.secondsReadable).to.equal('24');

        wrapper.setProps({ seconds: 48 });

        expect(wrapper.vm.secondsReadable).to.equal('48');
      });
    });

    describe('svgBounds', () => {
      it('returns windowHeight if it is less than windowWidth', () => {
        const windowHeight = 500;
        const windowWidth = 600;

        wrapper.destroy();

        wrapper = initializeWrapper({
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

      it('returns windowWidth if it is less than windowHeight', () => {
        const windowHeight = 800;
        const windowWidth = 400;

        wrapper.destroy();

        wrapper = initializeWrapper({
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

      it('returns windowHeight if it is equal to windowWidth', () => {
        const windowHeight = 700;
        const windowWidth = 700;

        wrapper.destroy();

        wrapper = initializeWrapper({
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
      it('returns svgBounds divided by 2', () => {
        wrapper.destroy();

        wrapper = initializeWrapper({
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
      it('returns radius divided by 5 in pixels', () => {
        wrapper.destroy();

        wrapper = initializeWrapper({
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
      it('returns the viewBox attribute for donut timer SVG using svgBounds', () => {
        wrapper.destroy();

        wrapper = initializeWrapper({
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
      it('returns the translation function for the donut timer group transform attribute using radius', () => {
        wrapper.destroy();

        wrapper = initializeWrapper({
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
      it('returns the arc function used for the countdown path within the donut timer', () => {
        wrapper.destroy();

        wrapper = initializeWrapper({
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
    describe('setCountdownCoords', () => {
      it('sets and returns the x/y coordinates for the countdown text', () => {
        const coordinates = wrapper.vm.setCountdownCoords();
        const countdownOffset = wrapper.vm.$el.querySelector('#countdown-text').getBoundingClientRect().height / 4;
        const expectedY = wrapper.vm.radius + countdownOffset;

        expect(coordinates.x).to.equal('360');
        expect(coordinates.y).to.equal(`${expectedY}`);
      });
    });

    describe('setResetCoords', () => {
      it('sets and returns the x/y coordinates for the reset SVG', () => {
        const coordinates = wrapper.vm.setResetCoords();
        const reload = wrapper.vm.$el.querySelector('#reset');
        const expectedX = wrapper.vm.radius - reload.getBoundingClientRect().width;
        const expectedY = wrapper.vm.radius + (reload.getBoundingClientRect().height / 1.5);

        expect(coordinates.x).to.equal(`${expectedX}`);
        expect(coordinates.y).to.equal(`${expectedY}`);
      });
    });

    describe('setPlayCoords', () => {
      it('sets and returns the x/y coordinates for the play/pause SVG', () => {
        const coordinates = wrapper.vm.setPlayCoords();
        const playPause = wrapper.vm.$el.querySelector('#play-pause');
        const expectedX = wrapper.vm.radius;
        const expectedY = wrapper.vm.radius + (playPause.getBoundingClientRect().height / 1.5);

        expect(coordinates.x).to.equal(`${expectedX}`);
        expect(coordinates.y).to.equal(`${expectedY}`);
      });
    });

    describe('setPathEndAngle', () => {
      it('sets and returns the endAngle datum for the donut countdown path', () => {
        const endAngle = wrapper.vm.setPathEndAngle();

        expect(endAngle).to.equal(0 * tau);
      });
    });

    describe('timerToggle', () => {
      it('starts and stops the timer', () => {
        expect(wrapper.vm.started).to.equal(false);

        wrapper.vm.timerToggle();
        expect(wrapper.vm.started).to.equal(true);

        wrapper.vm.timerToggle();
        expect(wrapper.vm.started).to.equal(false);
      });
    });

    describe('timerReset', () => {
      it('sets the timeRemaining', () => {
        wrapper.vm.timerReset();
        expect(wrapper.vm.timeRemaining).to.equal(timeRemaining);
      });

      it('sets the timeFraction', () => {
        wrapper.vm.timerReset();
        expect(wrapper.vm.timeFraction).to.equal((100 / timeRemaining) * 0.01);
      });

      it('sets the countdown text', () => {
        wrapper.vm.timerReset();
        expect(wrapper.find('#countdown-text').text()).to.equal('01:05:23');
      });

      it('resets the chimes (done nofication)', () => {
        const pauseSpy = sinon.spy(wrapper.vm.chimes, 'pause');

        expect(pauseSpy.notCalled).to.equal(true);

        wrapper.vm.timerReset();

        expect(pauseSpy.calledOnce).to.equal(true);
        expect(wrapper.vm.chimes.currentTime).to.equal(0);
      });

      it('begins the countdown interval', () => {
        const beginCountdownIntervalSpy = sinon.spy(wrapper.vm, 'beginCountdownInterval');

        expect(beginCountdownIntervalSpy.notCalled).to.equal(true);

        wrapper.vm.timerReset();

        expect(beginCountdownIntervalSpy.calledOnce).to.equal(true);
      });
    });

    describe('beginCountdownInterval', () => {
      it('clears the previous countdown interval and applies it again', () => {
        const interval1 = wrapper.vm.interval;
        expect(interval1).not.to.equal(null);

        wrapper.vm.beginCountdownInterval();

        const interval2 = wrapper.vm.interval;
        expect(interval2).not.to.equal(null);
        expect(interval2).not.to.equal(interval1);
      });
    });

    describe('timerTick', () => {
      it('calls timerDone if the time has run out', () => {
        wrapper.setData({ timeRemaining: 0 });

        const timerDoneSpy = sinon.spy(wrapper.vm, 'timerDone');

        expect(timerDoneSpy.notCalled).to.equal(true);

        wrapper.vm.timerTick();

        expect(timerDoneSpy.called).to.equal(true);
        timerDoneSpy.restore();
      });

      it('does not call timerDone if the time has not run out', () => {
        const timerDoneSpy = sinon.spy(wrapper.vm, 'timerDone');

        expect(timerDoneSpy.notCalled).to.equal(true);

        wrapper.vm.timerTick();

        expect(timerDoneSpy.called).to.equal(false);
        timerDoneSpy.restore();
      });

      it('updates the timePercentage and timeRemaining if the timer has started and time has not run out', () => {
        const timeFraction = wrapper.vm.timeFraction;
        const originalTimerPercentage = wrapper.vm.timerPercentage;
        const originalTimeRemaining = wrapper.vm.timeRemaining;

        wrapper.setData({ started: true });

        wrapper.vm.timerTick();

        expect(wrapper.vm.timerPercentage).to.equal(originalTimerPercentage - timeFraction);
        expect(wrapper.vm.timeRemaining).to.equal(originalTimeRemaining - 1);
      });

      it('does not update the timePercentage and timeRemaining if the timer has not been started', () => {
        const originalTimerPercentage = wrapper.vm.timerPercentage;
        const originalTimeRemaining = wrapper.vm.timeRemaining;

        wrapper.setData({ started: false });

        wrapper.vm.timerTick();

        expect(wrapper.vm.timerPercentage).to.equal(originalTimerPercentage);
        expect(wrapper.vm.timeRemaining).to.equal(originalTimeRemaining);
      });

      it('updates the countdown text if the timer has started and time has not run out', () => {
        const text = wrapper.find('#countdown-text');

        wrapper.setData({ started: true });

        wrapper.vm.timerTick();

        expect(text.text()).to.equal('01:05:22');

        wrapper.vm.timerTick();

        expect(text.text()).to.equal('01:05:21');
      });

      it('does not update the countdown text if the timer has not been started', () => {
        const text = wrapper.find('#countdown-text');

        wrapper.setData({ started: false });

        wrapper.vm.timerTick();

        expect(text.text()).to.equal('01:05:23');

        wrapper.vm.timerTick();

        expect(text.text()).to.equal('01:05:23');
      });
    });

    describe('timerDone', () => {
      it('stops the timer', () => {
        wrapper.setData({ started: true });

        expect(wrapper.vm.started).to.equal(true);

        wrapper.vm.timerDone();

        expect(wrapper.vm.started).to.equal(false);
      });

      it('does not play the chimes sound if the initial countdown is set to 00:00:00', () => {
        wrapper.destroy();

        wrapper = initializeWrapper({
          propsData: {
            hours: 0,
            minutes: 0,
            seconds: 0,
          },
        });

        const playSpy = sinon.spy(wrapper.vm.chimes, 'play');

        expect(playSpy.notCalled).to.equal(true);

        wrapper.vm.timerDone();

        expect(playSpy.notCalled).to.equal(true);
        playSpy.restore();
      });

      it('plays the chimes sound if the initial countdown seconds are set', () => {
        wrapper.destroy();

        wrapper = initializeWrapper({
          propsData: {
            hours: 0,
            minutes: 0,
            seconds: 1,
          },
        });

        const playSpy = sinon.spy(wrapper.vm.chimes, 'play');

        expect(playSpy.notCalled).to.equal(true);

        wrapper.vm.timerDone();

        expect(playSpy.called).to.equal(true);
        playSpy.restore();
      });

      it('plays the chimes sound if the initial countdown minutes are set', () => {
        wrapper.destroy();

        wrapper = initializeWrapper({
          propsData: {
            hours: 0,
            minutes: 1,
            seconds: 0,
          },
        });

        const playSpy = sinon.spy(wrapper.vm.chimes, 'play');

        expect(playSpy.notCalled).to.equal(true);

        wrapper.vm.timerDone();

        expect(playSpy.called).to.equal(true);
        playSpy.restore();
      });

      it('plays the chimes sound if the initial countdown hours are set', () => {
        wrapper.destroy();

        wrapper = initializeWrapper({
          propsData: {
            hours: 1,
            minutes: 0,
            seconds: 0,
          },
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
    describe('hours', () => {
      it('stops the timer and resets it', (done) => {
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
    });

    describe('minutes', () => {
      it('stops the timer and resets it', (done) => {
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
    });

    describe('seconds', () => {
      it('stops the timer and resets it', (done) => {
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
});
