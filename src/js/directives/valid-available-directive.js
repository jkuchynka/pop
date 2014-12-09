
angular.module('app')

.directive('validAvailable', function (Api, $q) {
    return {
        require: 'ngModel',
        scope: {
            type: '=type'
        },
        link: function (scope, elem, attrs, ctrl) {
            ctrl.$asyncValidators.validAvailable = function (modelValue, viewValue) {
                var def = $q.defer();

                if (attrs.validAvailable == 'username') {
                    Api.Users.getList({ where: 'username,' + modelValue }).then(function (users) {
                        if (users[0]) {
                            def.reject();
                        } else {
                            def.resolve();
                        }
                    });
                } else if (attrs.validAvailable == 'email') {
                    Api.Users.getList({ where: 'email,' + modelValue }).then(function (users) {
                        if (users[0]) {
                            def.reject();
                        } else {
                            def.resolve();
                        }
                    });
                } else {
                    def.reject();
                }

                return def.promise;
            };
        }
    };
});
