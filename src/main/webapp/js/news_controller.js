/*
 * Important! News is paged client-side because I couldn't get NG-Router to work with
 * dynamically created routes. It seemed to work but didn't in all cases. So now we
 * get all the news once at startup, do all the routing once, and then page it by hiding
 * the DIV's that are outside the selected page. It's actually elegant enough, but will
 * be less efficient as news grows. Oh well.
 */

app.controller('newsController', function($http, $scope, /*runtimeStates*/ configuration, $httpParamSerializer, newsService) {

	$scope.showNewerNewsButton = false;
	$scope.showOlderNewsButton = false;
	$scope.showStory;
	
	var pageSize = 3;
	
	$scope.showHref = function(contentType) {
		return contentType === 'FILE';
	}

	$scope.showSref = function(contentType) {
		return contentType === 'TEXT';
	}
	
    $scope.updateFromServer = function(reply) {
		$scope.news = reply.data;
		$scope.showStory = [];
		for(var i=0;i<$scope.news.length;i++) {
			$scope.news[i].prettyDate = $scope.getPrettyDate($scope.news[i].addedDate);
			if($scope.news[i].contentType === 'FILE') {
				$scope.news[i].href = $scope.news[i].fileName;
			}
			if($scope.news[i].contentType === 'TEXT') {
				$scope.news[i].stateHandler = 'newsText({id:' + $scope.news[i].key + '})';
			}
			$scope.showStory[i] = (i <= (pageSize - 1));
		}
		$scope.updatePagingButtons();
    }
	
	newsService.getAllShort($scope.updateFromServer);

	// TODO: put into common routines OR does NG have a filter for this?
    $scope.getPrettyDate = function (dateString) {
        if (dateString && !(isNaN(dateString.replace(/-/g, '')))) {
            var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            var dateParts = dateString.split('-');
            if (dateParts.length == 3) {
                var monthIndex = dateParts[1];
                if(monthIndex >= 1 && monthIndex <= 12) {
                    monthIndex--;
                    // removes leading zeroes
                    var day = Number(dateParts[2]).toString();
                    var ret = months[monthIndex] + ' ' + day + ', ' + dateParts[0];
                    return ret;
                }
            }
        }
        return '';
    }
	
	$scope.getMoreNewsClick = function(direction) {
		var from, to;
		var firstVisibleStory = $scope.getFirstVisibleStory();
		$scope.showAllStories(firstVisibleStory, $scope.showStory.length, false);
		if(direction.toUpperCase() == 'NEWER') {
			from = firstVisibleStory - pageSize;
			to = firstVisibleStory;
		}
		if(direction.toUpperCase() == 'OLDER') {
			to = firstVisibleStory + (pageSize * 2);
			if(to > $scope.showStory.length) {
				to = $scope.showStory.length;
			}
			from = firstVisibleStory + pageSize;
		}
		$scope.showAllStories(from, to, true);
		$scope.updatePagingButtons();
	};
	
	$scope.getFirstVisibleStory = function() {
		for(var i=0;i<$scope.showStory.length;i++) {
			if($scope.showStory[i]) {
				return i;
			}
		}
	}		
	
	$scope.showAllStories = function(from, to, isVisible) {
		for(var i=from;i<to;i++) {
			$scope.showStory[i] = isVisible;
		}
	}
	
	$scope.updatePagingButtons = function() {
		var firstVisibleStory = $scope.getFirstVisibleStory();
		$scope.showNewerNewsButton = firstVisibleStory > 0 && $scope.news.length > pageSize;
		$scope.showOlderNewsButton = firstVisibleStory + pageSize < $scope.news.length;
	}

})