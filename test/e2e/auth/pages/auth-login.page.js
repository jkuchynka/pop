
var config = require('../../config.js');
var commonPage = require('../../common/common.page.js');

var LoginPage = function () {

    this.common = new commonPage();

    this.username = element(by.model('record.username'));
    this.password = element(by.model('record.password'));
    this.submit = element(by.id('submit'));

    this.get = function () {
        this.common.deleteCookies();
        browser.get(config.baseUrl + 'login');
    };

    this.setUsername = function (username) {
        this.username.sendKeys(username);
    };
    this.setPassword = function (password) {
        this.password.sendKeys(password);
    };
    this.clickSubmit = function () {
        this.submit.click();
    };

    this.clickLogout = function () {
        // Close growl if it's open
        this.common.closeMessage();
        // Open slideout menu
        this.common.toggleSlideout();
        // click logout in slideout menu
        this.common.logoutLink.click();
    };

    this.login = function (username, password) {
        this.get();
        this.setUsername(username);
        this.setPassword(password);
        this.clickSubmit();
    };

};

module.exports = LoginPage;
