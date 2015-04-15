angular
    .module('myApp')
    .controller('myCtrl', MyCtrl)
    .controller('myChildCtrl', MyCtrl)
;

MyCtrl.$inject = ['$scope'];
function MyCtrl($scope, myUserService) {
    $scope.user = myUserService;

    $scope.$watch('user.isLoggedIn', function (newValue, oldValue) {
        // if our user was logged inand now isn't, tell the children controllers about it
        if (oldValue && !newValue) {
            $scope.$broadcast('user:loggedOut');
        }
    });
}

MyChildCtrl.$inject = ['$scope'];
function MyChildCtrl($scope) {
    $scope.comments = [];

    $scope.$on('user:loggedOut', function () {
        // empty the comments
        $scope.comments = [];
    });

    // click a submit button for a comment
    $scope.addComment = function (comment) {
        // update our state
        $scope.comments.push(comment);
        // AND cause parent state to update; this is not good
        $scope.$emit('user:addComment', comment);
    };

    // ^^ AND we didn't bind the function returned from $on, so we could have a memory leak
}
