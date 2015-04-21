
var CommonPage = function () {

    this.message = element(by.css("div[ng-bind-html='message.text']"));
    this.profileLink = element(by.css('div[user-menu] a[ng-bind="user.username"]'));
    this.loginLink = element(by.id('login'));
    this.logoutLink = element(by.id('logout'));
    this.registerLink = element(by.id('register'));

    this.closeMessage = function () {
        var elem = element.all(by.css('.growl-item button.close'));
        if (elem) {
            elem.first().click();
        }
    };

    this.deleteCookies = function () {
        browser.driver.manage().deleteAllCookies();
    };

    this.toggleSlideout = function () {
        element(by.css('div[user-menu] .navbar-toggle-slideout')).click();
    };

};

module.exports = CommonPage;
