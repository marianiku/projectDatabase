'use strict';

/**
 * This is a test.
 *
 * @param {type} param1
 * @param {type} param2
 */
angular.module('mean.organisations').controller('OrganisationsController', ['$scope', '$stateParams', '$location', '$window', 'Global', 'Organisations', 'MeanUser', 'Circles', 'Projects', 'OrgProjects',
    function ($scope, $stateParams, $location, $window, Global, Organisations, MeanUser, Circles, Projects, OrgProjects) {
        $scope.global = Global;

        $scope.organisation = undefined;
        $scope.organisations = [];

        $scope.hasAuthorization = function (organisation) {
            if (!organisation)
                return false;
            return MeanUser.isAdmin;
        };

        $scope.find = function () {
            var ordering  = $location.search().ordering;
            var ascending = $location.search().ascending;
            var page      = $location.search().page;
            if (typeof ordering === 'undefined') {
                ordering = 'name';
            }
            if (typeof ascending === 'undefined') {
                ascending = 'true';
            }
            if (typeof page === 'undefined') {
                page = 1;
            }
            $scope.ordering  = ordering;
            $scope.ascending = ascending === 'true';
            $scope.page      = page;
            Organisations.query({
                    ordering:   ordering,
                    ascending:  ascending,
                    page:       page
                },
                function(results) {
                    $scope.organisations = results;
                }
            );
        };

        $scope.findOne = function () {
            Organisations.get({
                organisationId: $stateParams.organisationId
            }, function (organisation) {
                $scope.organisation = organisation;
            });
        };


        $scope.findOrgProjects = function () {
            OrgProjects.findProjects($stateParams.organisationId).success(function (projects) {
                $scope.orgProjects = projects;
            })
        };

        /**
         * The sorting predicate used in organisation listing. Initial value is
         * "name".
         */
        $scope.ordering = 'name';

        /**
         * <tt>true</tt> iff the projects will be listed in ascending order.
         */
        $scope.ascending = 'true';

        /**
         * Current page number.
         */
        $scope.page = 1;

        /**
         * The number of projects to be listed on a single page.
         */
        $scope.pageSize = 10;

        /**
         * An array containing JSON objects for pagination.
         */
        $scope.pages;

        /**
         * Updates the page number and reloads the view.
         *
         * @param {String} page Number of the page to be displayed.
         */
        $scope.updatePage = function(page) {
            $window.location = '/organisations?ordering=' + $scope.ordering
                    + '&ascending=' + $scope.ascending
                    + '&page=' + page;
        };

        /**
         * Updates the ordering and reloads the view.
         *
         * @param {String} ordering The ordering predicate (eg. "name").
         */
        $scope.updateOrdering = function(ordering) {
            $window.location = '/organisations?ordering=' + ordering
                    + '&ascending=' + (ordering === $scope.ordering
                            ? !$scope.ascending : true)
                    + '&page=' + $scope.page;
        };

        /**
         * Calculates the number of and links to pages and writes the output to
         * $scope.pages.
         *
         * @returns {undefined}
         */
        $scope.paginate = function() {
            Organisations.countOrganisations(function(result) {
                var pageCount, numberOfPages, pagination;
                pageCount = result.orgCount;
                numberOfPages = Math.ceil(pageCount / $scope.pageSize);
                pagination = document.getElementById('pagination');
                $scope.pages = [];
                for (var i = 1; i <= numberOfPages; ++i) {
                    $scope.pages.push({number: i});
                }
            });
        };
    }
]);
