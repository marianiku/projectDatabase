'use strict';

/**
 * This is a test.
 *
 * @param {type} param1
 * @param {type} param2
 */
angular.module('mean.organisations').controller('OrganisationsController', ['$scope', '$stateParams', '$location', 'Global', 'Organisations', 'MeanUser', 'Circles',
  function($scope, $stateParams, $location, Global, Organisations, MeanUser, Circles) {
    $scope.global = Global;

    $scope.hasAuthorization = function(organisation) {
      if (!project) return false;
      return MeanUser.isAdmin;
    };

    $scope.find = function() {
      Organisations.query(function(organisations) {
        $scope.organisations = organisations;
      });
    };

    $scope.findOne = function() {
      Organisations.get({
        organisationId: $stateParams.organisationId
      }, function(organisation) {
        $scope.organisation = organisation;
      });
    };
  }
]);
