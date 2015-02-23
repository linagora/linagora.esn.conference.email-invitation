'use strict';

var AwesomeModule = require('awesome-module');
var Dependency = AwesomeModule.AwesomeModuleDependency;

var PREFIX = 'linagora.io.';

var emailInvitationModule = new AwesomeModule(PREFIX + 'emailInvitation', {
  dependencies: [
    new Dependency(Dependency.TYPE_NAME, 'linagora.io.invitation', 'invitation'),
    new Dependency(Dependency.TYPE_ABILITY, 'logger', 'logger'),
    new Dependency(Dependency.TYPE_ABILITY, 'config', 'config')
  ],

  states: {
    deploy: function(dependencies, callback) {
      require('./module')(dependencies, function(err, lib) {
        if (err) {
          return callback(err);
        }
        var invitationModule = dependencies('invitation');
        invitationModule.registerInvitationSender('email', lib);
        return callback();
      });
    }
  }
});

/**
 *
 * @type {AwesomeModule}
 */
module.exports = emailInvitationModule;
