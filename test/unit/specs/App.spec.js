import Vue from 'vue';
import App from '@/App';

Vue.config.devtools = false;

describe('App.vue', () => {
  const Application = Vue.extend(App);

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

  it('sets the correct default data', () => {
    expect(typeof App.data).to.equal('function');

    const defaultData = App.data();

    expect(defaultData.hours).to.equal(0);
    expect(defaultData.minutes).to.equal(10);
    expect(defaultData.seconds).to.equal(0);
    expect(defaultData.theme).to.equal(0);
    expect(defaultData.backgroundColor).to.equal('#ffffff');
    expect(defaultData.foregroundColor).to.equal('#000000');
    expect(`${defaultData.timeSegmentOptions}`).to.equal(`${timeSegmentOptions}`);
    expect(`${defaultData.themeOptions}`).to.equal(`${themeOptions}`);
    expect(defaultData.expanded).to.equal(false);
  });

  it('should render correctly', () => {
    const vm = new Application().$mount();
    const nav = vm.$el.querySelector('nav');

    expect(nav).to.not.equal(null);

    const toggle = nav.querySelector('svg#settings-toggle');
    expect(toggle).not.to.equal(null);
    expect(toggle.querySelector('rect.opacity-0')).not.to.equal(null);
    expect(toggle.querySelector('g > polygon')).not.to.equal(null);

    const settingsDropDown = nav.querySelector('div#settings');
    expect(settingsDropDown).not.to.equal(null);

    const timeSegments = settingsDropDown.querySelectorAll('div.time-segment');
    expect(timeSegments.length).to.equal(3);
    expect(timeSegments[0].querySelector('span').innerHTML).to.equal('H');
    expect(timeSegments[0].querySelectorAll('select > option').length).to.equal(timeSegmentOptions.length);
    expect(timeSegments[1].querySelector('span').innerHTML).to.equal('M');
    expect(timeSegments[1].querySelectorAll('select > option').length).to.equal(timeSegmentOptions.length);
    expect(timeSegments[2].querySelector('span').innerHTML).to.equal('S');
    expect(timeSegments[2].querySelectorAll('select > option').length).to.equal(timeSegmentOptions.length);

    const themeSelector = settingsDropDown.querySelector('div.theme-selector');
    expect(themeSelector.length).not.to.equal(null);
    expect(themeSelector.querySelector('svg > g > path')).not.to.equal(null);
    expect(themeSelector.querySelectorAll('select > option').length).to.equal(themeOptions.length);

    expect(vm.$el.querySelector('#timer')).not.to.equal(null);
  });

  it('should initialize the timer with the correct properties', () => {
    const vm = new Application().$mount();
    const timerProps = vm.$children[0].$props;

    expect(timerProps.backgroundColor).to.equal(themeOptions[0].backgroundColor);
    expect(timerProps.foregroundColor).to.equal(themeOptions[0].foregroundColor);
    expect(timerProps.hours).to.equal(0);
    expect(timerProps.minutes).to.equal(10);
    expect(timerProps.seconds).to.equal(0);
  });
});
