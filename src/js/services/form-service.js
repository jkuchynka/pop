
app.factory('Form', function () {

    var form = function ($scope, params, formConfig) {
        _.each(formConfig.elements, function (elem) {
            var opts = {
                type: elem.type,
                id: elem.id,
                name: elem.id
            };
        });
    };

    return {
        form: form
    };

});
