'use strict';

var expect = require('chai').expect;

describe('The emailInvitation lib', function() {

  beforeEach(function(done) {
    var self = this;
    this.depStore = {
      mailer: {
        setTemplatesDir: function() {}
      },
      config: function() {
        return {
          emailInvitation: {
            templatesDir: '/tmp/pipo'
          }
        };
      }
    };
    this.dependencies = function(name) {
      return self.depStore[name];
    };
    require('../../lib/module')(this.dependencies, function(err, lib) {
      expect(err).to.not.exist;
      self.emailInvitation = lib;
      done();
    });
  });

  it('should not instantiate if no config is found for the email templates', function(done) {
    this.depStore.config = function() {
      return null;
    };
    require('../../lib/module')(this.dependencies, function(err, lib) {
      expect(err).to.exist;
      expect(lib).to.not.exist;
      done();
    });
  });

  describe('exposed sendInvitation function', function() {
    it('should throw if from has no id property', function(done) {
      this.emailInvitation.sendInvitation({}, {objectType: 'user', id: 'robert@pipo.com'}, {url: 'anURL'}, function(err) {
        expect(err).to.exist;
        done();
      });
    });

    it('should throw if from has not an email as id property', function(done) {
      this.emailInvitation.sendInvitation({objectType: 'user', id: 'notanemail'}, {objectType: 'user', id: 'robert@pipo.com'}, {url: 'anURL'}, function(err) {
        expect(err).to.exist;
        done();
      });
    });

    it('should throw if to has no id property', function(done) {
      this.emailInvitation.sendInvitation({objectType: 'user', id: 'robert@pipo.com'}, {}, {url: 'anURL'}, function(err) {
        expect(err).to.exist;
        done();
      });
    });

    it('should throw if to has not an email as id property', function(done) {
      this.emailInvitation.sendInvitation({objectType: 'user', id: 'robert@pipo.com'}, {objectType: 'user', id: 'notanemail'}, {url: 'anURL'}, function(err) {
        expect(err).to.exist;
        done();
      });
    });


    it('should call mailer sendMethod', function(done) {
      var from = {objectType: 'user', id: 'robert@pipo.com'};
      var to = {objectType: 'user', id: 'gerard@pipo.com'};

      this.depStore.mailer.sendHTML = function(fromAddr, toAddr, subject, template, locales, callback) {
        expect(fromAddr).to.equal(from.id);
        expect(toAddr).to.equal(to.id);
        return callback();
      };
      this.emailInvitation.sendInvitation(from, to, {url: 'anURL'}, done);
    });
  });

});
