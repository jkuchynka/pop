var HtmlReporter = require('protractor-html-screenshot-reporter');
var path = require('path');

exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['e2e/**/*spec.js'],
    capabilities: {
        browserName: 'chrome'
    },
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    },
    onPrepare: function() {
        // Add a screenshot reporter and store screenshots to `/tmp/pop/screnshots`:
        jasmine.getEnv().addReporter(new HtmlReporter({
            baseDirectory: '/tmp/pop/screenshots',
            docTitle: 'pop reporter',
            docName: 'pop-reporter.html',
            pathBuilder: function pathBuilder(spec, descriptions, results, capabilities) {
                // Return '<browser>/<specname>' as path for screenshots:
                // Example: 'firefox/list-should work'.
                return path.join(capabilities.caps_.browserName, descriptions.join('-'));
            }
        }));
   }
};
