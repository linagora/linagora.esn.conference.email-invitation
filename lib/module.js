'use strict';

function ensureTrailingSlash(url) {
  return url[(url.length - 1)] === '/' ? url : url + '/';
}

/**
 *
 * @param {hash} dependencies
 * @param {Function} callback
 * @return {*}
 */
module.exports = function(dependencies, callback) {
  var mailer = dependencies('mailer');
  var logger = dependencies('logger');
  var config = dependencies('config')('default');
  var esnConfig = dependencies('esn-config');

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

  var getSender = function(callback) {
    esnConfig('mail').get(function(err, data) {
      if (err) {
        return callback(err);
      }

      if (data && data.mail && data.mail.noreply) {
        return callback(null, data.mail.noreply);
      }

      return callback();
    });
  };

  var lib = {};
  lib.sendInvitation = function(from, to, conference, baseUrl, callback) {
    if (!isValidEmailAddress(to.id)) {
      return callback(new Error('Cannot send email invitation : user email address is invalid.'));
    }

    getSender(function(err, sender) {
      if (err) {
        logger.error('Error while getting email sender', err);
        return callback(new Error('Error while getting email sender'));
      }

      if (!sender) {
        return callback(new Error('Can not get a valid email sender'));
      }

      var subject = 'You are invited to join a web conference on Hublin';
      var template = 'invitation';
      var locales = {
        from: from,
        to: to,
        conference: conference,
        baseUrl: ensureTrailingSlash(baseUrl)
      };
      var message = {
        from: sender,
        to: to.id,
        subject: subject
      };

      mailer.sendHTML(message, template, locales, callback);
    });
  };

  return callback(null, lib);
};
