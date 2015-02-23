'use strict';

/**
 *
 * @param {hash} dependencies
 * @param {Function} callback
 * @return {*}
 */
module.exports = function(dependencies, callback) {
  var mailer = dependencies('mailer');
  var config = dependencies('config')('default');

  if (!config || !config.emailInvitation || !config.emailInvitation.templatesDir) {
    return callback(new Error('Could not find configuration for email invitations.'));
  }
  var templatesDir = config.emailInvitation.templatesDir;
  mailer.setTemplatesDir(templatesDir);

  var emailAddresses = require('email-addresses');
  var isValidEmailAddress = function(emailAddress) {
    if (!emailAddress) {
      return false;
    }
    return emailAddresses.parseOneAddress(emailAddress) !== null;
  };

  var lib = {};
  lib.sendInvitation = function(from, to, conference, callback) {
      if (!isValidEmailAddress(from.id) || !isValidEmailAddress(to.id)) {
        return callback(new Error('Cannot send email invitation : user email address is invalid.'));
      }

      var subject = 'You are invited to join a web conference on Hublin';
      var template = 'invitation';
      var locales = {
        user: from.displayName,
        url: conference.url
      };
      mailer.sendHTML(from.id, to.id, subject, template, locales, callback);
  };

  return callback(null, lib);
};
