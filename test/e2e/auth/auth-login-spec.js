
var config = require('../config.js');
var commonPage = require('../common/common.page.js');
var loginPage = require('./pages/auth-login.page.js');

describe('Auth Login', function () {

    var common = new commonPage();
    var login = new loginPage();

    beforeEach(function () {
        login.get();
    });

    it('can login and logout', function () {
        login.setUsername('admin');
        login.setPassword('password');
        login.clickSubmit();
        // Redirects to profile
        expect(browser.getCurrentUrl()).toBe(config.baseUrl + 'profile');
        // Growl message
        expect(common.message.getText()).toBe('Welcome back, admin !');
        // User profile link in header
        expect(common.profileLink.getText()).toBe('admin');

        // Logout user
        login.clickLogout();

        expect(common.message.getText()).toBe("You have logged out.");
        // Redirects to homepage
        expect(browser.getCurrentUrl()).toEqual(config.baseUrl);
    });

    xit('should redirect to login page if trying to load protected route', function () {});
    xit('should show errors on invalid form', function () {});
    xit('should show errors on invalid credentials', function () {});

});
