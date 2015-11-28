'use strict';

/* jshint -W098 */
angular.module('mean.search').controller('SearchController', ['$scope', '$stateParams',
  '$location', '$window', '$http', 'Global', 'Search', 'OrgSearch', 'OrgProjects', 'MeanUser',
  function($scope, $stateParams, $location, $window, $http, Global, Search, OrgSearch, OrgProjects, MeanUser) {
    $scope.global = Global;

    $scope.states = function() {
      $http.get('api/states').success(function(states) {
        $scope.states = states;
      });
    };

    $scope.searchByOrgName = function() {
        OrgSearch.findOrgs($scope.selected).success(function(org) {
          OrgProjects.findProjects(org._id).success(function (projects) {
              $scope.searchresults = projects;
          });
        });
    };

    $scope.searchByState = function() {
        Search.query({state: $scope.selectedState}, function(searchresults) {
            $scope.searchresults = searchresults;
        });
    };
   /* $scope.search = function() {
      Search.query({tag:$scope.selectedTag}, function(articles) {
        $scope.articles = articles;
      });
    };*/
    /*$scope.findOne = function() {
      Projects.get({
        projectId: $stateParams.projectId
      }, function(project) {
        $scope.project = project;
      });
    };*/

  }
]);