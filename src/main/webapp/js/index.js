// per IC email 01/18/2017, use his GA account

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-90538790-1', 'auto');
ga('send', 'pageview');

var lang = 'en';

var app = angular.module('canchek', ['pascalprecht.translate', 'ui.router', 'ui.router.state.events'])

app.config(['$translateProvider', function ($translateProvider) {
    // https://angular-translate.github.io/docs/#/guide/19_security
    $translateProvider.useSanitizeValueStrategy('escape');
    $translateProvider
        .translations('en', translations_en)
        .preferredLanguage('en');
    $translateProvider
        .translations('fr', translations_fr);
}]);

app.config(function ($stateProvider, $urlRouterProvider) { //, $location) {

    $urlRouterProvider.otherwise('/home');
    
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: function() {
            return 'html/' + lang + '/public/home.html';
        }
    })

    .state('overview', {
        url: '/overview',
        templateUrl: function() {
            return 'html/' + lang + '/public/overview.html';
        }
    })

    .state('features', {
        url: '/features',
        templateUrl: function() {
            return 'html/' + lang + '/public/features.html';
        }
    })

    .state('benefits', {
        url: '/benefits',
        templateUrl: function() {
            return 'html/' + lang + '/public/benefits.html';
        },
    })
	
    .state('pricing', {
        url: '/pricing',
        templateUrl: function() {
            return 'html/' + lang + '/public/pricing.html';
        }
    })
	
    .state('privacy_policy', {
        url: '/privacy_policy',
        templateUrl: function() {
            return 'html/' + lang + '/public/privacy_policy.html';
        }
    })
	
    .state('terms_of_use', {
        url: '/terms_of_use',
        templateUrl: function() {
            return 'html/' + lang + '/public/terms_of_use.html';
        }
    })
	
    .state('contact_us', {
        url: '/contact_us',
        templateUrl: function() {
            return 'html/' + lang + '/public/contact_us.html';
        }

    })

    .state('login', {
        // We need a valid URL here so that the hover icon is correct
        // The actual navigation is handled in loginPreController
        url: '/home',
        // TODO is there a FRENCH issue here?
        templateUrl: 'html/en/public/home.html'
        //url: '/login',
        //templateUrl: 'html/app.html'
    })

    .state('sign_up', {
        // We need a valid URL here so that the hover icon is correct
        // The actual navigation is handled in loginPreController
        // TODO: IS HARD-CODED EN A PROBLEM HERE?
        url: '/sign_up',
        templateUrl: function() {
            return 'html/dynamic_language/sign_up.html';
        }
    })
	
    .state('more_news', {
        url: '/more_news',
        templateUrl: 'html/dynamic_language/more_news.html'
    })
		
	.state('newsText', {
		url: '/news/{id}',
		component: 'newsComponent',
		resolve: {
			news: function(newsService, $transition$) {
				return newsService.getOne($transition$.params().id);
			}
		},
	})
    
});

// https://stackoverflow.com/questions/30220947/how-would-i-have-ui-router-go-to-an-external-link-such-as-google-com
// Note, this is dependent on specific versions of jsStateEvents, UI Router, and Angular itself.

app.run(function($rootScope, $window) {
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		if (toState.external) {
			event.preventDefault();
			$window.open(toState.url, '_blank');
		}
	});
})