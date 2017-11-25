import Vue from 'vue';
import DonutTimer from '@/components/DonutTimer';

describe('DonutTimer.vue', () => {
  it('should render correctly', () => {
    const Constructor = Vue.extend(DonutTimer);
    const vm = new Constructor().$mount();
    const donut = vm.$el.querySelector('#timer > #donut');

    expect(donut).to.not.equal(null);
    expect(donut.getAttribute('width')).to.equal('100%');
    expect(donut.getAttribute('height')).to.equal('100%');
    expect(donut.getAttribute('preserveAspectRatio')).to.equal('xMinYMin meet');
  });
});
