// https://stackoverflow.com/questions/17922557/angularjs-how-to-check-for-changes-in-file-input-fields

app.directive('customOnChange', function() {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			if(scope) {
				var onChangeHandler = scope.$eval(attrs.customOnChange);
				element.on('change', onChangeHandler);
				element.on('$destroy', function() {
					element.off();
				});
				element.bind('change', onChangeHandler.bind(scope));	  
			}
		}
	};
});