
var config = require('../config.js');
var commonPage = require('../common/common.page.js');

describe('Homepage', function () {

    var common = new commonPage();

    beforeEach(function () {
        // Goto homepage
        browser.get(config.baseUrl);
    });

    it('should have a title', function () {
        expect(browser.getTitle()).toBe('Welcome to Pop | Pop');
    });

    it('can navigate to login', function () {
        common.loginLink.click();
        expect(browser.getCurrentUrl()).toBe(config.baseUrl + 'login');
        expect(browser.getTitle()).toContain('Login');
    });

    it('can navigate to register', function () {
        common.registerLink.click();
        expect(browser.getCurrentUrl()).toBe(config.baseUrl + 'register');
        expect(browser.getTitle()).toContain('Register');
    });

});
