
app.factory('App', function ($location, $upload, store) {

    var getHost = function () {
        var hostname = $location.protocol() + '://' + $location.host();
        var port = $location.port();
        if (port && port != '80') {
            hostname += ':' + port;
        }
        return hostname;
    };

    var modalTemplate = function () {
        return '<div class="modal-header"><h3 ng-bind="title"></h3></div><div class="modal-body"><p ng-bind="message"></p></div><div class="modal-footer"><button ng-repeat="btn in buttons" ng-bind="btn.label" class="btn" ng-class="btn.class" ng-click="btn.click()"></button></div>';
    };

    var parseDate = function (dateStr) {
        return moment(dateStr, ["YYYY-MM-DD hh:mm:ss"]).valueOf();
    };

    var userIsAdmin = function (user) {
        var ret = false;
        _.each(user.roles, function (role) {
            if (role.name == 'admin') {
                ret = true;
            }
        });
        return ret;
    };

    var userIsAuthed = function () {
        var user = store.get('user');
        if (!user || !user.id) {
            return false;
        }
        return user.id > 0;
    };

    return {
        getHost: getHost,
        modalTemplate: modalTemplate,
        parseDate: parseDate,
        userIsAdmin: userIsAdmin,
        userIsAuthed: userIsAuthed
    };

});
