
angular.module('app')

.directive('validAvailable', function (Api, $q) {
    return {
        require: 'ngModel',
        scope: {
            type: '=type'
        },
        link: function (scope, elem, attrs, ctrl) {
            ctrl.$asyncValidators.validAvailable = function (modelValue, viewValue) {
                if (!viewValue) {
                    return $q.when(true);
                }

                var def = $q.defer();

                if (attrs.validAvailable == 'username') {
                    Api.all('users').getList({ where: 'username,' + modelValue }).then(function (users) {
                        if (users[0]) {
                            def.reject();
                        } else {
                            def.resolve();
                        }
                    });
                } else if (attrs.validAvailable == 'email') {
                    Api.all('users').getList({ where: 'email,' + modelValue }).then(function (users) {
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
