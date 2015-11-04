/* jshint -W079 */
/* Related to https://github.com/linnovate/mean/issues/898 */
'use strict';

/**
 * Module dependencies.
 */
var expect = require('expect.js'),
        mongoose = require('mongoose'),
        Project = mongoose.model('Project'),
        Organisation = mongoose.model('Organisation'),
        BankAccount = mongoose.model('BankAccount'),
        User = mongoose.model('User'),
        InReview = mongoose.model('InReview');

var project1;
var project2;
var project3;
var project4;
var organisation;
var organisation3;
var organisation4;
var bank_account;
var bank_account3;
var bank_account4;
var user;
var in_review;

describe('<Unit Test>', function () {
    describe('Model Project:', function () {
        beforeEach(function (done) {
            this.timeout(10000);

            user = new User({
                name: 'Full name',
                email: 'test@test.com',
                username: 'user',
                password: 'password'});
            user.save();
            bank_account = new BankAccount({
                "bank_contact_details": "Branch, address",
                "iban": "abcdefg1234",
                "swift": "OKOYFI",
                "holder_name": "John Smith"});
            bank_account.save();
            organisation = new Organisation({
                "name": "Humanrights org",
                "representative": "Representative",
                "exec_manager": "Manager",
                "address": {
                    "street": "Street 123911",
                    "postal_code": "22039",
                    "city": "Oslo",
                    "country": "Norway"
                },
                "tel": "123445",
                "email": "email@org.com",
                "website": "www.org.com",
                "legal_status": "legal status",
                "history_status": "history status",
                "int_links": "international links",
                "nat_links": "local human rights org",
                "bank_account": bank_account});
            organisation.save();
            project1 = new Project(
                    {"title": "Human rights",
                        "coordinator": "Teppo Tenhunen",
                        "organisation": organisation,
                        "reg_date": "12.10.2014",
                        "funding": {
                            "applied_curr_local": "50 000",
                            "applied_curr_eur": "10 000",
                            "granted_curr_local": "50 000",
                            "granted_curr_eur": "10 000"},
                        "duration_months": 30,
                        "description": "A short description of project",
                        "description_en": "Description in english",
                        "categories": [
                            "naiset",
                            "yleiset ihmisoikeudet"
                        ],
                        "background": "Project background",
                        "beneficiaries": "The project benefits...",
                        "gender_aspect": "Gender aspects include...",
                        "project_goal": "Project goal is...",
                        "sustainability_risks": "Some data here",
                        "reporting_evaluation": "Data",
                        "other_donors_proposed": "Donated amount",
                        "dac": "abcd123",
                        "region": "Itä-Aasia"});
            project1.save();
            project2 = new Project(
                    {"title": "Humans",
                        "coordinator": "Teppo Tenhunen",
                        "organisation": organisation,
                        "reg_date": "12.9.2014",
                        "funding": {
                            "applied_curr_local": "50 000",
                            "applied_curr_eur": "11 000",
                            "granted_curr_local": "50 000",
                            "granted_curr_eur": "11 000"},
                        "duration_months": 12,
                        "description": "A short description of project",
                        "description_en": "Description in english",
                        "categories": [
                            "lapset"
                        ],
                        "background": "Project background 2",
                        "beneficiaries": "The project benefits such and such",
                        "gender_aspect": "Gender aspects include this and that",
                        "project_goal": "Project goal is...",
                        "sustainability_risks": "Some data here",
                        "reporting_evaluation": "More data",
                        "other_donors_proposed": "Donated amount",
                        "dac": "abcd123",
                        "region": "Itä-Aasia"
                    });
            project2.save();
            done();
        });

        describe('Method All', function () {

            it('should list all projects', function (done) {

                this.timeout(10000);
                var query = Project.find();

                return query.sort({"name": "asc"}).exec(function (err, data) {
                    expect(err).to.be(null);
                    expect(data.length).to.be(2);
//                    expect(data[0].title).to.equal("Human rights");
//                    expect(data[1].status).to.be("approved");
                    done();
                });
            });
        });

        describe('Method Show', function () {

            it('should find given project', function (done) {
                this.timeout(10000);
                var query = Project;
                return query.findOne({title: 'Humans'}).exec(function (err, data) {
                    expect(err).to.be(null);
                    expect(data.title).to.be("Humans");
                    done();
                });
            });
        });

        describe('Method Destroy', function () {
            it('should delete given project', function (done) {
                this.timeout(10000);
                var query = Project;
                return query.remove({title: "Humans"}).exec(function (err) {
                    expect(err).to.be(null);
                    done();
                });
            });

        });

        describe('Method Save', function () {

            beforeEach(function (done) {
                this.timeout(10000);

                organisation3 = new Organisation({
                    "name": "Children rights org",
                    "representative": "Mr Jackson",
                    "exec_manager": "Manager3",
                    "address": {
                        "street": "Address Road 123",
                        "postal_code": "011325",
                        "city": "Cityham",
                        "country": "Countryland"
                    },
                    "tel": "+111123445",
                    "email": "email@childrenorg.com",
                    "website": "www.childrenorg.com",
                    "legal_status": "non-profit",
                    "history_status": "history status",
                    "int_links": "international links",
                    "nat_links": "local human rights org 2",
                    "bank_account": bank_account});
                bank_account3 = new BankAccount({
                    "bank_contact_details": "Bank Branch, address",
                    "iban": "EU11111113333334",
                    "swift": "NDEAFIHH",
                    "holder_name": "Jack Jackson"});
                project3 = new Project(
                        {"title": "Children rights",
                            "coordinator": "Maija Maa",
                            "organisation": organisation3,
                            "funding": {
                                "applied_curr_local": "50 000",
                                "applied_curr_eur": "11 000",
                                "granted_curr_local": "50 000",
                                "granted_curr_eur": "11 000"},
                            "duration_months": 19,
                            "description": "A short description of project",
                            "description_en": "Description in english",
                            "categories": [
                                "yleiset ihmisoikeudet"
                            ],
                            "background": "Project background 3",
                            "beneficiaries": "The project benefits such and such",
                            "gender_aspect": "Gender aspects include this and that",
                            "project_goal": "Project goal is...",
                            "sustainability_risks": "Some data here",
                            "reporting_evaluation": "More data",
                            "other_donors_proposed": "Donated amount",
                            "dac": "19191123",
                            "region": "Itä-Aasia"
                        });
                done();
            });

            it('should be able to save project and new organisation without problems', function (done) {

                this.timeout(10000);

                return project3.save(function (err, data) {
                    expect(err).to.be(null);
                    expect(data.title).to.equal('Children rights');
                    expect(data.coordinator).to.equal('Maija Maa');
                    expect(data.organisation.name).to.equal('Children rights org');
                    expect(data.organisation.bank_account).to.not.equal(0);
                    expect(data.reg_date.length).to.not.equal(0);

                    project3.remove();
                    organisation3.remove();
                    bank_account3.remove();
                    done();
                });
            });

            it('should show an error when try to save without a title', function (done) {
                this.timeout(10000);

                project3.title = null;
                return project3.save(function (err) {
                    expect(err).to.not.be(null);

                    project3.remove();
                    organisation3.remove();
                    bank_account3.remove();
                    done();
                });
            });

            it('should be able to save project with with empty not-required field', function (done) {
                this.timeout(10000);

                project3.other_donors_proposed = '';
                return project3.save(function (err, data) {
                    expect(err).to.be(null);
                    expect(data.other_donors_proposed).to.equal('');

                    project3.remove();
                    organisation3.remove();
                    bank_account3.remove();
                    done();
                });
            });

            it('should be able to save project if organisation already exists', function (done) {
                this.timeout(1000);
                organisation4 = new Organisation({
                    "name": "Humanrights org",
                    "representative": "Representative",
                    "exec_manager": "Manager4",
                    "address": {
                        "street": "Street road 123",
                        "postal_code": "211325",
                        "city": "Madrid",
                        "country": "Spain"
                    },
                    "tel": "123445",
                    "email": "email@hrorg.com",
                    "website": "www.hrorg.com",
                    "legal_status": "legal status",
                    "history_status": "history status",
                    "int_links": "international links",
                    "nat_links": "local human rights org 4",
                    "bank_account": bank_account4});

                bank_account4 = new BankAccount({
                    "bank_contact_details": "Bank Branch, address",
                    "iban": "abcdefg1234",
                    "swift": "HELSFIHH",
                    "holder_name": "Jane Smith"});

                organisation4.save();

                project4 = new Project(
                        {"title": "Women rights",
                            "coordinator": "Maija Maa",
                            "organisation": organisation4,
                            "funding": {
                                "applied_curr_local": "150 000",
                                "applied_curr_eur": "111 000"},
                            "duration_months": 29,
                            "description": "A short description of project",
                            "description_en": "Description in english",
                            "categories": [],
                            "background": "Project background 3",
                            "beneficiaries": "The project benefits such and such",
                            "gender_aspect": "Gender aspects include this and that",
                            "project_goal": "Project goal is...",
                            "sustainability_risks": "Some data here",
                            "reporting_evaluation": "More data",
                            "other_donors_proposed": "Donated amount",
                            "dac": "1234",
                            "region": "Itä-Aasia"
                        });
                return project4.save(function (err, data) {
                    expect(err).to.be(null);
                    expect(data.organisation.name).to.equal('Humanrights org');

                    project4.remove();
                    organisation4.remove();
                    bank_account4.remove();
                    done();
                });
            });

        });

        describe('Method byOrg', function() {
            it('should get projects where given organisation is the organisation', function(done) {
                this.timeout(10000);
                return Project.find({organisation: organisation}).exec(function(err, data) {
                    expect(err).to.be(null);
                    expect(data.length).to.be(2);
                    done();
                });
            });
        });

        describe('Method Update', function () {

            it('should create a new "in review" state update given project with its id', function (done) {
                this.timeout(10000);
                in_review = new InReview({
                    "user": user,
                    "comments": "this is a comment"});

                return Project.findOne({title: 'Humans'}).exec(function (err, proj) {
                    in_review.save();
                    proj.state = "käsittelyssä";
                    proj.in_review = in_review;
                    proj.save();
                    expect(err).to.be(null);
                    expect(proj.state).to.be("käsittelyssä");
                    expect(proj.in_review.comments).to.be("this is a comment");
                    done();
                });
            });
        });

        afterEach(function (done) {
            this.timeout(10000);
            project1.remove();
            project2.remove();
            organisation.remove();
            bank_account.remove();
            done();
        });
    });
});
