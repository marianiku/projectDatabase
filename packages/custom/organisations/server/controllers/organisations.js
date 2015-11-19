'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Organisation = mongoose.model('Organisation'),
    BankAccount = mongoose.model('BankAccount'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

module.exports = function(Organisations) {

    return {
        organisation: function(req, res, next, id) {
            Organisation.load(id, function(err, organisation) {
                if (err) return next(err);
                if (!organisation) return next(new Error('Järjestön ' + id + ' lataus epäonnistui.'));
                req.organisation = organisation;
                next();
              });
        },

        show: function(req, res) {

            Organisations.events.publish({
                action: 'viewed',
                name: req.organisation.name,
                url: config.hostname + '/organisations/' + req.organisation._id
            });

            res.json(req.organisation);
        },
        
        create: function(req,res) {
            var bank_account;
            var organisation = new Organisation(req.body);
            var bank_account = new BankAccount(req.body.bank_account);
            organisation.bank_account = bank_account._id;
            bank_account.save();
            organisation.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Järjestöä ei voi tallentaa'
                    });
                }
                res.json(organisation);
            });
        },

         all: function(req, res) {
             var query = Organisation.find();

             query
             .sort({name: 'asc'})
             .populate({path: 'bank_account', model: 'BankAccount'})
             .exec(function(err, organisations) {
                 if (err) {
                     return res.status(500).json({
                         error: 'Järjestöjä ei voi näyttää'
                     });
                 }
                 res.json(organisations)
             });

         }
    };
}
