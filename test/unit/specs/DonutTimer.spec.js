import Vue from 'vue';
import DonutTimer from '@/components/DonutTimer';

Vue.config.devtools = false;

describe('DonutTimer.vue', () => {
  const Timer = Vue.extend(DonutTimer);

  it('sets the correct default data', () => {
    expect(typeof DonutTimer.data).to.equal('function');

    const defaultData = DonutTimer.data();

    expect(defaultData.timeRemaining).to.equal(0);
    expect(defaultData.started).to.equal(0);
    expect(defaultData.interval).to.equal(null);
    expect(defaultData.timerPercentage).to.equal(1);
    expect(defaultData.timeFraction).to.equal(0);
  });

  it('should render correctly', () => {
    const vm = new Timer({
      propsData: {
        hours: 1,
        minutes: 5,
        seconds: 23,
      },
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
    expect(text.getAttribute('style')).to.equal('font-size: 60px;');
    expect(text.innerHTML).to.equal('--:--:--');

    const playPause = donut.querySelector('#play-pause');
    const playPauseRect = playPause.querySelector('rect.opacity-0');
    const playPauseGroups = playPause.querySelectorAll('g');

    expect(playPause).to.not.equal(null);
    expect(playPause.getAttribute('viewBox')).to.equal('0 0 100 100');
    expect(playPause.getAttribute('width')).to.equal('60px');
    expect(playPause.getAttribute('height')).to.equal('60px');
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
    expect(reset.getAttribute('width')).to.equal('60px');
    expect(reset.getAttribute('height')).to.equal('60px');
    expect(reset.getAttribute('fill')).to.equal('#000000');
    expect(resetRect.getAttribute('width')).to.equal('100%');
    expect(resetRect.getAttribute('height')).to.equal('100%');
    expect(resetGroups.length).to.equal(4);
    expect(resetGroups[0].querySelector('polygon')).to.not.equal(null);
    expect(resetGroups[1].querySelector('path')).to.not.equal(null);
    expect(resetGroups[2].querySelectorAll('path').length).to.equal(2);
    expect(resetGroups[3].querySelector('polygon')).to.not.equal(null);
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
        new Timer({
          propsData: {
            minutes: 5,
            seconds: 23,
          },
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Missing required prop: "hours"')).to.not.equal(-1);
      });

      it('should be a Number', () => {
        new Timer({
          propsData: {
            hours: 'test',
            minutes: 5,
            seconds: 23,
          },
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: type check failed for prop "hours". Expected Number, got String.')).to.not.equal(-1);
      });

      it('should be greater than 0', () => {
        new Timer({
          propsData: {
            hours: -1,
            minutes: 5,
            seconds: 23,
          },
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: custom validator check failed for prop "hours"')).to.not.equal(-1);
      });

      it('should be less than 59', () => {
        new Timer({
          propsData: {
            hours: 60,
            minutes: 5,
            seconds: 23,
          },
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: custom validator check failed for prop "hours"')).to.not.equal(-1);
      });
    });

    describe('minutes property', () => {
      it('should be required', () => {
        new Timer({
          propsData: {
            hours: 1,
            seconds: 23,
          },
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Missing required prop: "minutes"')).to.not.equal(-1);
      });

      it('should be a Number', () => {
        new Timer({
          propsData: {
            hours: 1,
            minutes: 'test',
            seconds: 23,
          },
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: type check failed for prop "minutes". Expected Number, got String.')).to.not.equal(-1);
      });

      it('should be greater than 0', () => {
        new Timer({
          propsData: {
            hours: 1,
            minutes: -1,
            seconds: 23,
          },
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: custom validator check failed for prop "minutes"')).to.not.equal(-1);
      });

      it('should be less than 59', () => {
        new Timer({
          propsData: {
            hours: 1,
            minutes: 60,
            seconds: 23,
          },
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: custom validator check failed for prop "minutes"')).to.not.equal(-1);
      });
    });

    describe('seconds property', () => {
      it('should be required', () => {
        new Timer({
          propsData: {
            hours: 1,
            minutes: 5,
          },
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Missing required prop: "seconds"')).to.not.equal(-1);
      });

      it('should be a Number', () => {
        new Timer({
          propsData: {
            hours: 1,
            minutes: 5,
            seconds: 'test',
          },
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: type check failed for prop "seconds". Expected Number, got String.')).to.not.equal(-1);
      });

      it('should be greater than 0', () => {
        new Timer({
          propsData: {
            hours: 1,
            minutes: 5,
            seconds: -1,
          },
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: custom validator check failed for prop "seconds"')).to.not.equal(-1);
      });

      it('should be less than 59', () => {
        new Timer({
          propsData: {
            hours: 1,
            minutes: 5,
            seconds: 60,
          },
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: custom validator check failed for prop "seconds"')).to.not.equal(-1);
      });
    });

    describe('foregroundColor property', () => {
      it('should default to #000000', () => {
        const vm = new Timer({
          propsData: {
            hours: 1,
            minutes: 5,
            seconds: 23,
          },
        }).$mount();

        expect(vm.foregroundColor).to.equal('#000000');
      });

      it('should be a String', () => {
        new Timer({
          propsData: {
            hours: 1,
            minutes: 5,
            seconds: 23,
            foregroundColor: true,
          },
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: type check failed for prop "foregroundColor". Expected String, got Boolean.')).to.not.equal(-1);
      });
    });

    describe('backgroundColor property', () => {
      it('should default to #ffffff', () => {
        const vm = new Timer({
          propsData: {
            hours: 1,
            minutes: 5,
            seconds: 23,
          },
        }).$mount();

        expect(vm.backgroundColor).to.equal('#ffffff');
      });

      it('should be a String', () => {
        new Timer({
          propsData: {
            hours: 1,
            minutes: 5,
            seconds: 23,
            backgroundColor: true,
          },
        }).$mount();

        expect(consoleSpy.lastCall.args[0].indexOf('Invalid prop: type check failed for prop "backgroundColor". Expected String, got Boolean.')).to.not.equal(-1);
      });
    });
  });

  describe('computed properties', () => {
    it('timeReadable should display time in hh:mm:ss format', () => {
      const vm = new Timer({
        propsData: {
          hours: 1,
          minutes: 5,
          seconds: 23,
        },
      }).$mount();

      expect(vm.timeReadable).to.equal('01:05:23');
    });

    it('hoursReadable should pad the hours to two digits with a leading zero for digits 1 through 9', (done) => {
      const vm = new Timer({
        propsData: {
          hours: 1,
          minutes: 5,
          seconds: 23,
        },
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
      const vm = new Timer({
        propsData: {
          hours: 1,
          minutes: 5,
          seconds: 23,
        },
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
      const vm = new Timer({
        propsData: {
          hours: 1,
          minutes: 5,
          seconds: 23,
        },
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
  });
});
