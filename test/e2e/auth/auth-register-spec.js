
var registerPage = require('./pages/auth-register.page.js');
var commonPage = require('../common/common.page.js');

describe('Auth Register', function () {

    var common = new commonPage();
    var register = new registerPage();

    beforeEach(function () {
        common.deleteCookies();
        register.get();
    });

    it('can register', function () {
        // this user shouldn't exist yet, so this should be successful
        register.setUsername('testuser');
        register.setEmail('testuser@example.org');
        register.setPassword('Password');
        register.setPasswordConfirm('Password');
        register.clickSubmit();
        expect(register.successText.getText()).toContain('Your account has been created');
    });

    xit('should show errors on invalid form', function () {});
    xit('should show errors on already existing username', function () {});
    xit('should show errors on already existing email', function () {});

});
