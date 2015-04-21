
var config = require('../../config.js');
var commonPage = require('../../common/common.page.js');

var RegisterPage = function () {

    this.common = new commonPage();

    this.username = element(by.model('record.username'));
    this.email = element(by.model('record.email'));
    this.password = element(by.model('record.password'));
    this.passwordConfirm = element(by.model('record.password_confirmation'));
    this.submit = element(by.id('submit'));
    this.successText = element(by.css('.success'));

    this.get = function () {
        browser.get(config.baseUrl + 'register');
    };

    this.setUsername = function (username) {
        this.username.sendKeys(username);
    };
    this.setEmail = function (email) {
        this.email.sendKeys(email);
    };
    this.setPassword = function (password) {
        this.password.sendKeys(password);
    };
    this.setPasswordConfirm = function (password) {
        this.passwordConfirm.sendKeys(password);
    };
    this.clickSubmit = function () {
        this.submit.click();
    };

};

module.exports = RegisterPage;
