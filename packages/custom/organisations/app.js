'use strict';

/**
 * Defining the Package
 */
var Module = require('meanio').Module;

var Organisations = new Module('organisations');

/**
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */

Organisations.register(function(app, auth, database, circles) {

  //We enable routing. By default the Package Object is passed to the routes
  Organisations.routes(app, auth, database);

  Organisations.aggregateAsset('css', 'organisations.css');
  Organisations.aggregateAsset('js', 'view.js', {global:true,  absolute: false});


  //We are adding a link to the main menu for all authenticated users
  Organisations.menus.add({
    'roles': ['authenticated'],
    'title': 'Järjestölistaus',
    'link': 'all organisations'
  });

  Organisations.events.defaultData({
    type: 'post',
    subtype: 'organisation'
  });

  return Organisations;
});