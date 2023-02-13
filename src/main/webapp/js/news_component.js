app.component('newsComponent', {
	bindings: { news: '<' },
	controller: function ($scope, $sce) {
		$scope.addedDate = this.news.data.addedDate;
		$scope.caption = this.news.data.caption;
		$scope.content = $sce.trustAsHtml(this.news.data.content);
		$scope.fileName = this.news.data.fileName;
	},
	templateUrl: 'html/dynamic_language/news_component.html'
})