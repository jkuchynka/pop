
window.pop = {

    ucwords: function (str) {
        return (str + '')
            .replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1) {
                return $1.toUpperCase();
            });
    },
    spinner: null,
    spin: function (show) {
        if (show) {
            $('#spinner').show();
            pop.spinner = new Spinner().spin(document.getElementById('spinner'));
        } else {
            $('#spinner').hide();
            pop.spinner.stop();
        }
    },

};
