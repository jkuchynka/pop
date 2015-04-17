
app.filter('unsafe', function($sce) {
    return $sce.trustAsHtml;
});
