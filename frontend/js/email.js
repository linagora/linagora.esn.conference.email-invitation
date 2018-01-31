'use strict';

angular.module('linagora.esn.conference.email-invitation', [
  'meetings.invitation'
])
.config(['invitationServiceProvider', function(invitationServiceProvider) {
  var EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  var impl = {
    lookup: function(text) {
      return { objectType: 'email', id: text };
    },
    validate: function(text) {
      return text && !!text.match(EMAIL_REGEX);
    }
  };

  invitationServiceProvider.register(100, impl);
}])
.directive('invitationDialogUserEmail', ['invitationService', function(invitationService) {
  var templateUrl = '/linagora.esn.conference.email-invitation/views/invitation-dialog-email.html';

  return invitationService.createContactDirective(templateUrl);
}]);
