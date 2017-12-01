// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

function selectAndAssertThemeValue(browser, optionValue, backgroundColor, foregroundColor) {
  browser.waitForElementVisible('#settings .theme-selector select', 2000)
    .click('#settings .theme-selector select')
    .waitForElementVisible(`#settings .theme-selector select option[value="${optionValue}"]`, 2000)
    .click(`#settings .theme-selector select option[value="${optionValue}"]`)
    .click('#settings .theme-selector select')
    .pause(1000);

  browser.assert.value('#settings .theme-selector select', `${optionValue}`);
  browser.expect.element('#timer').to.have.css('background-color', backgroundColor);
  browser.assert.attributeEquals('#settings-toggle', 'fill', foregroundColor);
  browser.assert.attributeEquals('#countdown-path', 'fill', foregroundColor);
  browser.assert.attributeEquals('#countdown-text', 'fill', foregroundColor);
  browser.assert.attributeEquals('#reset', 'fill', foregroundColor);
  browser.assert.attributeEquals('#play-pause', 'fill', foregroundColor);
}

function selectTimeSegmentValue(browser, index, value) {
  browser.waitForElementVisible(`#settings .time-segment:nth-child(${index}) select`, 2000)
    .click(`#settings .time-segment:nth-child(${index}) select`)
    .waitForElementVisible(`#settings .time-segment:nth-child(${index}) select option[value="${value}"]`, 2000)
    .click(`#settings .time-segment:nth-child(${index}) select option[value="${value}"]`)
    .click(`#settings .time-segment:nth-child(${index}) select`)
    .pause(1000);
}

module.exports = {
  'Play, Pause, and Reset buttons': function test(browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL;

    browser.url(devServer)
      .waitForElementVisible('#app', 5000)
      .pause(1000);

    browser.expect.element('#countdown-text').text.to.equal('00:10:00');

    browser
      .assert.visible('#play-button')
      .assert.hidden('#pause-button')
      .click('#play-pause')
      .pause(1000)
      .assert.hidden('#play-button')
      .assert.visible('#pause-button')
      .click('#play-pause')
      .pause(1000)
      .assert.visible('#play-button')
      .assert.hidden('#pause-button');

    browser.expect.element('#countdown-text').text.not.to.equal('00:10:00');

    browser
      .assert.visible('#reset')
      .click('#reset')
      .pause(1000);

    browser.expect.element('#countdown-text').text.to.equal('00:10:00');
  },
  'Settings toggle': function test(browser) {
    browser.expect.element('#countdown-text').text.to.equal('00:10:00');

    browser
      .assert.cssClassNotPresent('#settings-toggle', 'expanded')
      .assert.hidden('#settings');

    browser.click('#settings-toggle').pause(500);

    browser
      .assert.cssClassPresent('#settings-toggle', 'expanded')
      .assert.visible('#settings');

    browser.click('#settings-toggle').pause(500);

    browser
      .assert.cssClassNotPresent('#settings-toggle', 'expanded')
      .assert.hidden('#settings');
  },
  'Theme changes': function test(browser) {
    browser.assert.value('#settings .theme-selector select', '0');
    browser.expect.element('#timer').to.have.css('background-color', '#ffffff');
    browser.assert.attributeEquals('#settings-toggle', 'fill', '#000000');
    browser.assert.attributeEquals('#countdown-path', 'fill', '#000000');
    browser.assert.attributeEquals('#countdown-text', 'fill', '#000000');
    browser.assert.attributeEquals('#reset', 'fill', '#000000');
    browser.assert.attributeEquals('#play-pause', 'fill', '#000000');

    browser
      .assert.cssClassNotPresent('#settings-toggle', 'expanded')
      .assert.hidden('#settings');

    browser.click('#settings-toggle');

    browser.waitForElementVisible('#settings', 2000);

    selectAndAssertThemeValue(browser, '1', '#000000', '#ffffff');
    selectAndAssertThemeValue(browser, '2', '#ffffff', '#ff2841');
    selectAndAssertThemeValue(browser, '3', '#ffffff', '#0061ff');
    selectAndAssertThemeValue(browser, '4', '#ffffff', '#37ce46');
    selectAndAssertThemeValue(browser, '5', '#ffffff', '#ffa426');
    selectAndAssertThemeValue(browser, '6', '#ffffff', '#ff68a2');
  },
  'Time segment changes': function test(browser) {
    browser.expect.element('#countdown-text').text.to.equal('00:10:00');

    selectTimeSegmentValue(browser, '1', '18');

    browser.expect.element('#countdown-text').text.to.equal('18:10:00');

    selectTimeSegmentValue(browser, '2', '49');

    browser.expect.element('#countdown-text').text.to.equal('18:49:00');

    selectTimeSegmentValue(browser, '3', '37');

    browser.expect.element('#countdown-text').text.to.equal('18:49:37');
  },
  'Full countdown test': function test(browser) {
    selectTimeSegmentValue(browser, '1', '0');
    selectTimeSegmentValue(browser, '2', '0');
    selectTimeSegmentValue(browser, '3', '5');

    browser.expect.element('#countdown-text').text.to.equal('00:00:05');

    browser
      .assert.visible('#play-button')
      .assert.hidden('#pause-button')
      .click('#play-pause')
      .pause(2000)
      .assert.hidden('#play-button')
      .assert.visible('#pause-button')
      .pause(5000)
      .assert.visible('#play-button')
      .assert.hidden('#pause-button');

    browser.expect.element('#countdown-text').text.to.equal('00:00:00');

    browser.end();
  },
};
