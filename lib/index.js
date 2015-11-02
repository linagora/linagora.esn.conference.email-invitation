'use strict';

var AwesomeModule = require('awesome-module');
var Dependency = AwesomeModule.AwesomeModuleDependency;

var emailInvitationModule = new AwesomeModule('om-email-invitation', {
  dependencies: [
    new Dependency(Dependency.TYPE_NAME, 'linagora.io.invitation', 'invitation'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.io.mailer', 'mailer'),
    new Dependency(Dependency.TYPE_ABILITY, 'logger', 'logger'),
    new Dependency(Dependency.TYPE_ABILITY, 'config', 'config'),
    new Dependency(Dependency.TYPE_ABILITY, 'esn-config', 'esn-config'),
    new Dependency(Dependency.TYPE_NAME, 'webserver.wrapper', 'webserver-wrapper')
  ],

  states: {
    deploy: function(dependencies, callback) {
      require('./module')(dependencies, function(err, lib) {
        if (err) {
          return callback(err);
        }
        var invitationModule = dependencies('invitation');
        invitationModule.registerInvitationSender('email', lib);

        var app = require('./webserver');
        var webserverWrapper = dependencies('webserver-wrapper');
        webserverWrapper.injectAngularModules('om-email-invitation', 'email.js', ['om-email-invitation'], ['live-conference']);
        webserverWrapper.addApp('om-email-invitation', app);

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
