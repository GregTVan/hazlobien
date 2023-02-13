app.config(function (helpProvider, $stateProvider, $urlRouterProvider) {

    /* Default route, this is used when (a) someone types something nonsensical into the address bar,
       or (b) when some error in our code triggers a non-existent route. Send them to the Search page. */
     
    $urlRouterProvider.otherwise('/search');
    
    /* These pages are defined by helpProvider, which is special because (a) it has to be available at the
       point we configure routing (basically, a Provider is, but a Service isn't), and (b) we want to share
       the help page definition with the helpController so it can dynamically show a list of help pages. */

    var help_pages = helpProvider.$get()();

    for(var i=0;i<help_pages.length;i++) {
        for(var j=0;j<help_pages[i].entries.length;j++) {
            var page = help_pages[i].entries[j].file_name;
            $stateProvider.state('help_' + page, {
                url: '/help_' + page,
                // TODO: support FR users (need a function here, probably)
                templateUrl: 'html/en/help/' + page + '.html'
            })
        }
    }
    
    /* These are simple pages with no routing parameters */
    
    var simple_pages = ['activity', 'administration', 'eid', 'help', 'reference'];

    for(var i=0;i<simple_pages.length;i++) {
        var page = simple_pages[i];
        $stateProvider.state(page, {
            url: '/' + page,
            templateUrl: 'html/dynamic_language/' + page + '.html'
        })
    }
    
    /* These are pages with page-specific routing parameters */

    $stateProvider.state('insiderDetail/:sediId', {
        url: '/insiderDetail/:sediId',
        templateUrl: 'html/dynamic_language/insider_detail.html'
    })

    .state('search', {
        resolve: {
            getConfig: function(configuration) {
                return configuration.getPromise().then(function(reply) {
                    // ??
                });
            }
        },
        templateUrl: 'html/dynamic_language/search.html',
        url: '/search?lang'
    });

});