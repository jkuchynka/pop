
var loginPage = require('../auth/pages/auth-login.page.js');

describe('Users Profile', function () {

    var login = new loginPage();

    beforeEach(function () {
        login.login('admin', 'password');
    });

    it('should have a title', function () {
        expect(browser.getTitle()).toContain("admin's Profile");
    });

});
