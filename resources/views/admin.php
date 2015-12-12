<!DOCTYPE html>
<html ng-app="myApp">
<head>
    <meta charset="UTF-8">

    <!-- Bootstrap -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">

    <style>
        .marg-top-25 { margin-top: 25px; }
    </style>
</head>
<body>
    <div class="container">

        <div ng-controller="AppController">
            <h3>Angular Example App</h3>

            <div class="row">
                <div class="col-md-8 marg-top-25">
                    <p>Variable binded to <code>$scope.helloMessage</code> with <code>ng-model</code>, initialized from the controller:</p>

                    <div class="form-group">
                        <input type="text" class="form-control" ng-model="helloMessage">
                    </div>

                    <p><strong>Raw message:</strong> {{ helloMessage }}</p>
                    <p><strong>With <code>uppercase</code> filter:</strong> {{ helloMessage | uppercase }}</p>
                    <p><strong>With <code>lowercase</code> filter:</strong> {{ helloMessage | lowercase }}</p>
                    <p><strong>Custom filter, removing bowels:</strong> {{ helloMessage | withoutBowels }}</p>
                </div>
            </div>

            <div class="row marg-top-25">
                <div class="col-md-8">
                    <p>Another example, a number binded to <code>$scope.amount</code>:</p>

                    <div class="form-group">
                        <input type="text" class="form-control" ng-model="amount">
                    </div>

                    <p><strong>Through the <code>currency</code> filter</strong>: {{ amount | currency }}</p>
                </div>
            </div>

            <div class="row marg-top-25">
                <div class="col-md-8">
                    <p>Populating a dropdown from a list in Javascript:</p>

                    <div class="form-group">
                        <select class="form-control"
                            ng-model="selectedName"
                            ng-options="option.name for option in availableNames">
                            <option value="" disabled="true">None selected yet</option>
                        </select>
                    </div>

                    <p>The selected element is in <code>$scope.selectedName</code>: {{ selectedName && selectedName.name || '(empty)' }}</p>

                    <p>The two-way data binding allows the code to modify <code>$scope</code> data directly, and the view will
                    be automatically updated. For example, The following button will call <code>addNameToList</code>, which adds an entry
                    to the list of available names.</p>

                    <div class="row form-group">
                        <div class="col-md-10">
                            <input type="text" class="form-control" ng-model="newNameToAdd">
                        </div>
                        <div class="col-md-2">
                            <button type="button" class="btn btn-danger"
                                ng-click="addNameToList(newNameToAdd)"
                                ng-disabled="!newNameToAdd || newNameToAdd.trim().length === 0"
                                >Add Name</button>
                        </div>
                    </div>

                    <p>You can also make loops and conditionals with Angular. These are the available names:</p>

                    <ul>
                        <li ng-repeat="person in availableNames">
                            <strong>{{ person.name }}</strong>.
                            <i ng-show="person.addedByUser === true">Added by you! </i>
                            <i ng-show="person.id === selectedName.id">The selected name!</i>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    </div>

    <!-- AngularJS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.0-rc.0/angular.min.js"></script>

    <!-- Funciones JS propias  -->
    <script src="/js/scripts.js"></script>
</body>
</html>
