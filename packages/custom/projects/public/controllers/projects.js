'use strict';

/**
 * This is a test.
 *
 * @param {type} param1
 * @param {type} param2
 */

angular.module('mean.projects').controller('ProjectsController', ['$scope', '$stateParams',
    '$location', '$window', '$q', '$http', 'Global', 'Projects', 'MeanUser', 'Circles', 'Organisations',
    function ($scope, $stateParams, $location, $window, $q, $http, Global, Projects, MeanUser, Circles, Organisations) {
        $scope.global = Global;
        $scope.coordinators = ['Teppo Tenhunen', 'Kaisa Koordinaattori', 'Maija Maa', 'Juha Jokinen'];
        $scope.themes = ['Oikeusvaltio ja demokratia', 'TSS-oikeudet', 'Oikeus koskemattomuuteen ja inhimilliseen kohteluun',
            'Naisten oikeudet ja sukupuolten välinen tasa-arvo', 'Lapsen oikeudet',
            'Haavoittuvien ryhmien, dalitien ja vammaisten henkilöiden oikeudet', 'Etniset vähemmistöt ja alkuperäiskansat',
            'LHBTIQ', 'Ihmisoikeuspuolustajat'];
        $scope.methodNames = ['Tietoisuuden lisääminen', 'Ihmisoikeuskasvatus ja -koulutus', 'Kapasiteetin vahvistaminen',
            'Kampanjointi ja/tai lobbaus', 'Vaikuttamistyö', 'Dokumentaatio ja monitorointi', 'Oikeusapu ja -neuvonta',
            'Strategiset ja/tai perusoikeuskanteet ja/tai ryhmäkanteet', 'Oikeusturvan saatavuuden parantaminen', 'Palveluiden saatavuuden parantaminen',
            'Ihmisoikeuspuolustajien suojelu', 'Verkostoituminen', 'Alueellinen yhteistyö', 'Toimintatuki', 'Muu'];
        $scope.methodLevels = ['Kansainvälinen', 'Kansallinen', 'Paikallinen', 'Yhteisö'];
        $scope.addedMethods = [];
        $scope.plannedPayments = [];
        $scope.deadlines = [];
        $scope.themeSelection = [];
        $scope.objectiveComments = [];
        $scope.rejcategories = ["1 Hanke ei ole ihmisoikeushanke", "2 Järjestöllä ei ole ihmisoikeushankkeen toteutuskapasiteettia",
            "3 Järjestöllä ei ole hallintokapasiteettia", "4 Hanke on epärealistinen tai muuten heikosti suunniteltu",
            "5 Hankkeen budjetti on epärealistinen", "6 Huonot tai puuttuvat referenssit", "7 Strategia", "8 Muu, mikä?"];
        $scope.addedRejections = [];
        $scope.toggleThemeSelection = function toggleThemeSelection(theme) {
            var idx = $scope.themeSelection.indexOf(theme);
            // is currently selected
            if (idx > -1) {
                $scope.themeSelection.splice(idx, 1);
            }
            // is newly selected
            else {
                $scope.themeSelection.push(theme);
            }
        };
        $scope.convertDate = function (day, month, year) {
            var parsed = new Date(year, month-1, day+1).toISOString();
            return parsed;
        };
        
        $scope.hasAuthorization = function (project) {
            if (!project)
                return false;
            return MeanUser.isAdmin;
        };
        /**
         * Creates new project by checking if organisation already exists (i.e. organisation
         * has been selected from dropdown list) or if organisation is new.
         * If organisation is new, first creates new organisation by calling
         * organisation server-side controller and after that creates project.
         * If organisation is selected from list, uses existing organisation._id and
         * creates project.
         *
         * @param {type} isValid checks if project creation form is valid
         * @returns {undefined}
         */
        $scope.create = function (isValid) {
            if (isValid) {
                var project = new Projects($scope.project);
                if ($scope.newOrg) {
                    var org = new Organisations($scope.project.organisation);
                    org.$save(function (response) {
                        var orgId = response._id;
                        project.organisation = orgId;
                        project.$save(function (response) {
                            $location.path('projects/' + response._id);
                        });
                        $scope.project = {};
                    });
                } else {
                    project.organisation = $scope.project.listOrganisation;
                    project.$save(function (response) {
                        $location.path('projects/' + response._id);
                    });
                    $scope.project = {};
                }
            } else {
                $scope.submitted = true;
            }
        };
        /**
         * 
         * @param {type} isValid
         * @returns {undefined}
         */
        $scope.update = function (isValid) {
            // TODO: add convertDate to all date-objects!!
            if (isValid) {
                var project = $scope.project;

                if ($scope.projectEditForm.approved_day.$dirty || $scope.projectEditForm.approved_month.$dirty
                        || $scope.projectEditForm.approved_year.$dirty) {
                    project.approved.approved_date = $scope.convertDate($scope.approved_day, $scope.approved_month, $scope.approved_year);
                }

                if ($scope.projectEditForm.board_notified_day.$dirty || $scope.projectEditForm.board_notified_month.$dirty
                        || $scope.projectEditForm.board_notified_year.$dirty) {
                    project.approved.board_notified = $scope.convertDate($scope.notified_day, $scope.notified_month, $scope.notified_year);
                }

                if ($scope.projectEditForm.signed_date_day.$dirty || $scope.projectEditForm.signed_date_day.$dirty
                        || $scope.projectEditForm.signed_date_day.$dirty) {
                    project.signed.signed_date = $scope.convertDate($scope.signed_day, $scope.signed_month, $scope.signed_year);
                }

                if (typeof project.signed.date !== 'undefined') {
                    project.signed.intreport_deadlines = [];
                    angular.forEach($scope.deadlines, function (obj) {
                        project.signed.intreport_deadlines.push({report: obj.report,
                            date: $scope.convertDate(obj.deadline_day, obj.deadline_month, obj.deadline_year)});
                    });

                    project.signed.planned_payments = [];
                    angular.forEach($scope.plannedPayments, function (obj) {
                        project.signed.planned_payments.push({date: $scope.convertDate(obj.planned_day, obj.planned_month, obj.planned_year),
                            sum_eur: obj.sum_eur});
                    });
                }

                if (project.intermediary_reports.length > 0) {
                    
                }

                if ($scope.projectEditForm.audit_day.$dirty || $scope.projectEditForm.audit_month.$dirty
                        || $scope.projectEditForm.audit_year.$dirty) {
                    project.end_report.audit.date = $scope.convertDate($scope.audit_day, $scope.audit_month, $scope.audit_year);
                }

                if ($scope.projectEditForm.er_approved_day.$dirty || $scope.projectEditForm.er_approved_month.$dirty
                        || $scope.projectEditForm.er_approved_year.$dirty) {

                    project.end_report.approved_date = $scope.convertDate($scope.er_approved_day, $scope.er_approved_month, $scope.er_approved_year);
                }

                if ($scope.projectEditForm.endNotifiedDay.$dirty || $scope.projectEditForm.endNotifiedMonth.$dirty ||
                        $scope.projectEditForm.endNotifiedYear.$dirty) {
                    project.ended.board_notified = $scope.convertDate($scope.end_notified_day, $scope.end_notified_month, $scope.end_notified_year);
                }

                if ($scope.projectEditForm.endDay.$dirty || $scope.projectEditForm.endMonth.$dirty || $scope.projectEditForm.endYear.$dirty) {
                    project.ended.end_date = $scope.convertDate($scope.end_day, $scope.end_month, $scope.end_year);
                }

                if (!project.updated) {
                    project.updated = [];
                }

                project.updated.push({time: new Date().getTime(), user: MeanUser.user.name});
                project.$update(function () {
                    $location.path('projects/' + project._id);
                });
            } else {
                $scope.submitted = true;
            }
        };

        /**
         * 
         * @returns {undefined}
         */
        $scope.initEditing = function () {

            Projects.get({
                projectId: $stateParams.projectId
            }, function (project) {
                $scope.project = project;
                $scope.addedMethods = [];
                $scope.plannedPayments = [];
                $scope.deadlines = [];
//                $scope.int_reports = [];
                if (typeof project.approved !== 'undefined') {
                    var date = new Date(project.approved.approved_date);
                    $scope.approved_day = date.getDate();
                    $scope.approved_month = date.getMonth() + 1;
                    $scope.approved_year = date.getFullYear();

                    var notified_date = new Date(project.approved.board_notified);
                    $scope.notified_day = notified_date.getDate();
                    $scope.notified_month = notified_date.getMonth() + 1;
                    $scope.notified_year = notified_date.getFullYear();

                    angular.forEach(project.approved.methods, function (obj) {
                        $scope.addedMethods.push({name: obj.name, level: obj.level});
                    });
                    angular.forEach(project.approved.themes, function (obj) {
                        $scope.themeSelection.push(obj);
                    });
                }

                if (typeof project.signed !== 'undefined') {
                    var date = new Date(project.signed.signed_date);
                    $scope.signed_day = date.getDate();
                    $scope.signed_month = date.getMonth() + 1;
                    $scope.signed_year = date.getFullYear();

                    angular.forEach(project.signed.planned_payments, function (obj) {
                        var date = new Date(obj.date);
                        $scope.plannedPayments.push({planned_day: date.getDate(), planned_month: date.getMonth() + 1,
                            planned_year: date.getFullYear(), sum_eur: obj.sum_eur});
                    });
                    angular.forEach(project.signed.intreport_deadlines, function (obj) {
                        var date = new Date(obj.date);
                        $scope.deadlines.push({report: obj.report, deadline_day: date.getDate(), deadline_month: date.getMonth() + 1,
                            deadline_year: date.getFullYear()});
                    });
                }

                if (project.intermediary_reports.length > 0) {
                    angular.forEach(project.intermediary_reports, function (obj) {
                        var date = new Date(obj.date_approved);

                        $scope.project.intermediary_reports[project.intermediary_reports.indexOf(obj)].intRDateAppr_day = date.getDate();
                        $scope.project.intermediary_reports[project.intermediary_reports.indexOf(obj)].intRDateAppr_month = date.getMonth() + 1;
                        $scope.project.intermediary_reports[project.intermediary_reports.indexOf(obj)].intRDateAppr_year = date.getFullYear();
                    });
                }

                //                        $scope.int_reports.push({methods: obj.methods, overall_rating_kios: obj.overall_rating_kios,
//                        comments: obj.comments, approved_by: obj.approved_by, date: obj.date, })

                if (typeof project.end_report.date !== 'undefined') {
                    var date = new Date(project.end_report.approved_date);
                    $scope.er_approved_year = date.getFullYear();
                    $scope.er_approved_month = date.getMonth() + 1;
                    $scope.er_approved_day = date.getDate();

                    var audit_date = new Date(project.end_report.audit.date);
                    $scope.audit_day = audit_date.getDate();
                    $scope.audit_month = audit_date.getMonth() + 1;
                    $scope.audit_year = audit_date.getFullYear();
                }

                if (typeof project.ended !== 'undefined') {
                    var date = new Date(project.ended.end_date);
                    $scope.end_day = date.getDate();
                    $scope.end_month = date.getMonth() + 1;
                    $scope.end_year = date.getFullYear();

                    var notified_date = new Date(project.ended.board_notified);
                    $scope.end_notified_day = notified_date.getDate();
                    $scope.end_notified_month = notified_date.getMonth() + 1;
                    $scope.end_notified_year = notified_date.getFullYear();
                }
            });
        };
        /**
         *
         *
         * @returns {undefined}
         */
        $scope.find = function () {
            var ordering = $location.search().ordering;
            var ascending = $location.search().ascending;
            var page = $location.search().page;
            if (typeof ordering === 'undefined') {
                ordering = 'project_ref';
            }
            if (typeof ascending === 'undefined') {
                ascending = 'true';
            }
            if (typeof page === 'undefined') {
                page = 1;
            }
            $scope.ordering = ordering;
            $scope.ascending = ascending === 'true';
            $scope.page = page;
            Projects.query({
                ordering: ordering,
                ascending: ascending,
                page: page
            },
            function (results) {
                $scope.now = new Date().toISOString();
                $scope.projects = results;
            }
            );
        };

        $scope.findOne = function () {
            Projects.get({
                projectId: $stateParams.projectId
            }, function (project) {
                $scope.project = project;
            });
        };
        /**
         * Fetches states
         *
         * @param {String}
         * @returns {undefined}
         */
        $scope.findState = function () {
            Projects.get({
                projectId: $stateParams.projectId}, function (project) {
                $http.get('/api/states').success(function (data) {
                    data.forEach(function (state) {
                        if (state.current_state === project.state) {
                            $scope.state = state;
                        }
                    });
                });
            });
        };
        $scope.confirm = function (project) {
            if (confirm('Haluatko varmasti poistaa hankkeen "' + project.title + '"?')) {
                $scope.remove(project);
            }
        };
        $scope.remove = function (project) {
            if (project) {
                project.$remove(function (response) {
                    for (var i in $scope.projects) {
                        if ($scope.projects[i] === project) {
                            $scope.projects.splice(i, 1);
                        }
                    }
                    $location.path('projects');
                });
            } else {
                $scope.project.$remove(function (response) {
                    $location.path('projects');
                    $window.location.reload();
                });
            }
        };
        /**
         * Updates project with "in review" state data
         *
         * @param {type} isValid checks if project creation form is valid
         * @returns {undefined}
         */
        $scope.addReviewState = function (isValid) {
            if (isValid) {
                var project = $scope.project;
                project.in_review.date = Date.now();
                project.state = $scope.global.newState;
                project.$addReview(function (response) {
                    $location.path('projects/' + response._id);
                });
            }

        };
        /**
         * Updates project with "approved" state data
         *
         * @param {type} isValid checks if project creation form is valid
         * @returns {undefined}
         */
        $scope.addApprovedState = function (isValid) {
            if (isValid) {
                var project = $scope.project;
                project.approved.date = Date.now();
                project.approved.approved_date = $scope.convertDate($scope.approved_day, $scope.approved_month, $scope.approved_year);
                project.approved.board_notified = $scope.convertDate($scope.notified_day, $scope.notified_month, $scope.notified_year);
                project.approved.themes = $scope.themeSelection;
                project.approved.methods = $scope.addedMethods;
                project.state = $scope.global.newState;
                project.$addApproved(function (response) {
                    $location.path('projects/' + response._id)
                });
            }

        };
        /**
         * Updates project with "rejected" state data
         *
         * @param {type} isValid checks if project creation form is valid
         * @returns {undefined}
         */
        $scope.addRejectedState = function (isValid) {
            if (isValid) {
                var project = $scope.project;
                project.rejected.date = Date.now();
                project.rejected.rejection_categories = $scope.addedRejections;
                project.state = $scope.global.newState;
                project.$addRejected(function (response) {
                    $location.path('projects/' + response._id);
                });
            }

        };
        /**
         * Updates project with "signed" state data
         *
         * @param {type} isValid checks if project creation form is valid
         * @returns {undefined}
         */
        $scope.addSignedState = function (isValid) {
            if (isValid) {

                var signed_date = $scope.convertDate($scope.signed_day, $scope.signed_month, $scope.signed_year);
                var project = $scope.project;
                project.signed.date = Date.now();
                project.signed.signed_date = signed_date;
                $scope.parsedDeadlines = [];
                $scope.parsedPlannedPayments = [];
                var plpms = $scope.plannedPayments;
                for (var i = 0; i < plpms.length; i++) {
                    var pp = $scope.convertDate(plpms[i].day, plpms[i].month, plpms[i].year);
                    $scope.parsedPlannedPayments.push({date: pp, sum_eur: plpms[i].sum_eur, sum_local: plpms[i].sum_local})
                }
                project.signed.planned_payments = $scope.parsedPlannedPayments;
                var dls = $scope.deadlines;
                for (var i = 0; i < dls.length; i++) {
                    var dl = $scope.convertDate(dls[i].day, dls[i].month, dls[i].year);
                    $scope.parsedDeadlines.push({report: dls[i].report, date: dl});
                }
                project.signed.intreport_deadlines = $scope.parsedDeadlines;
                project.state = $scope.global.newState;
                project.$addSigned(function (response) {

                    $location.path('projects/' + response._id);
                });
            }

        };
        /**
         * Adds payment to project
         *
         * @param {type} isValid checks if project creation form is valid
         * @returns {undefined}
         */
        $scope.addPaymentInfo = function (isValid) {
            if (isValid) {
                var project = $scope.project;
                var payment_date = $scope.convertDate($scope.payment_day, $scope.payment_month, $scope.payment_year);
                project.payment.payment_date = payment_date;
                var index = project.payments.length;
                if (index === undefined) {
                    project.payment.payment_number = 1;
                } else {
                    project.payment.payment_number = project.payments.length + 1;
                }
                project.$addPayment(function (response) {
                    $window.location.reload();
                });
            }

        };
        /**
         * Updates project with "int report" state data
         *
         * @param {type} isValid checks if project creation form is valid
         * @returns {undefined}
         */
        $scope.addIntReportState = function (isValid) {
            if (isValid) {
                var project = $scope.project;
                project.intermediary_report.date = Date.now();
                project.intermediary_report.date_approved = $scope.convertDate($scope.intRDateAppr_day, $scope.intRDateAppr_month, $scope.intRDateAppr_year);
                project.state = $scope.global.newState;
                project.intermediary_report.methods = $scope.addedMethods;
                project.intermediary_report.objectives = $scope.objectiveComments;
                var index = project.intermediary_reports.length;
                if (index === undefined || index === 0) {
                    project.intermediary_report.reportNumber = 1;
                } else {
                    project.intermediary_report.reportNumber = project.intermediary_reports.length + 1;
                }

                project.$addIntReport(function (response) {
                    $location.path('projects/' + response._id);
                });
            }

        };
        /**
         * Updates project with "end report" state data
         *
         * @param {type} isValid checks if project creation form is valid
         * @returns {undefined}
         */
        $scope.addEndReportState = function (isValid) {
            if (isValid) {
                var project = $scope.project;
                project.end_report.date = Date.now();
                project.state = $scope.global.newState;
                project.end_report.approved_date = $scope.convertDate($scope.er_approved_day, $scope.er_approved_month, $scope.er_approved_year);
                project.end_report.audit.date = $scope.convertDate($scope.audit_day, $scope.audit_month, $scope.audit_year);
                project.$addEndReport(function (response) {
                    $location.path('projects/' + response._id);
                });
            }

        };
        /**
         * Updates project with "ended" state data
         *
         * @param {type} isValid checks if project creation form is valid
         * @returns {undefined}
         */
        $scope.addEndedState = function (isValid) {
            if (isValid) {
                var project = $scope.project;
                project.ended.date = Date.now();
                project.ended.end_date = $scope.convertDate($scope.end_day, $scope.end_month, $scope.end_year);
                project.ended.board_notified = $scope.convertDate($scope.notified_day, $scope.notified_month, $scope.notified_year);
                project.state = $scope.global.newState;
                project.$addEnded(function (response) {
                    $location.path('projects/' + response._id)
                });
            }

        };
        $scope.changeState = function (changeTo) {
            Projects.get({
                projectId: $stateParams.projectId
            }, function (project) {
                $scope.project = project;
                $scope.global.newState = changeTo;
                $location.path('projects/' + project._id + "/change");
            });
        };
        $scope.addMethod = function () {
            $scope.addedMethods.push({name: '', level: ''});
        };
        $scope.removeMethod = function () {
            $scope.addedMethods.splice(-1, 1);
        };
        $scope.addRejection = function () {
            $scope.addedRejections.push({rejection: ''});
        };
        $scope.removeRejection = function () {
            $scope.addedRejections.splice(-1, 1);
        };
        $scope.addPlannedPayment = function () {
            $scope.plannedPayments.push({day: '', month: '', year: '', sum_eur: ''});
        };
        $scope.removePlannedPayment = function () {
            $scope.plannedPayments.splice(-1, 1);
        };
        $scope.addDeadline = function () {
            $scope.deadlines.push({report: '', day: '', month: '', year: ''});
        };
        $scope.removeDeadline = function () {
            $scope.deadlines.splice(-1, 1);
        };
        $scope.addNewOrg = function () {
            $scope.newOrg = true;
            $scope.orgs = null;
        };
        $scope.addOrgFromDb = function () {
            $scope.newOrg = false;
            Organisations.query(function (organisations) {
                $scope.orgs = organisations;
            });
        };
        /**
         * Finds project's intermediary report and puts the given report to $scope.report
         * so that report's details can be shown on intreport.html
         */
        $scope.findIntReport = function () {
            Projects.get({
                projectId: $stateParams.projectId
            }, function (project) {
                $scope.report = project.intermediary_reports[$stateParams.reportId - 1];
            });
        };
        /**
         * The sorting predicate used in project listing. Initial value is
         * "project_ref".
         */
        $scope.ordering = 'project_ref';
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
        $scope.updatePage = function (page) {
            $window.location = '/projects?ordering=' + $scope.ordering
                    + '&ascending=' + $scope.ascending
                    + '&page=' + page;
        };
        /**
         * Updates the ordering and reloads the view.
         *
         * @param {String} ordering The ordering predicate (eg. "project_ref").
         */
        $scope.updateOrdering = function (ordering) {
            $window.location = '/projects?ordering=' + ordering
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
        $scope.paginate = function () {
            Projects.countProjects(function (result) {
                var numberOfPages, pagination;
                numberOfPages = Math.ceil(result.projectCount / $scope.pageSize);
                pagination = document.getElementById('pagination');
                $scope.pages = [];
                for (var i = 1; i <= numberOfPages; ++i) {
                    $scope.pages.push({number: i});
                }
            });
        };
    }
]);
