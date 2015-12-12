var module = angular.module('myApp', []);

module.filter('withoutBowels', function() {
	return function(input) {
		// regexp to replace any bowels with an empty string
		return input.replace(/[aeiou]/g, '');
	};
});

module.controller('AppController', function($scope) {
	$scope.helloMessage = 'Hello World!';

	$scope.amount = 123;

	$scope.availableNames = [
		{ id: 1, name: 'Jose' },
		{ id: 2, name: 'Roberto' },
		{ id: 3, name: 'Marta' },
		{ id: 4, name: 'Yolanda' },
		{ id: 5, name: 'Julian' }
	];

	$scope.addNameToList = function(name) {
		// add the new name to the list
		$scope.availableNames.push({
			id: $scope.availableNames.length + 1,
			name: name,
			addedByUser: true
		});

		// clear the input of new names
		$scope.newNameToAdd = '';
	}
});
