'use strict';

var expect = require('chai').expect;

describe('The emailInvitation awesome module', function() {

  it('should provide a deploy state', function() {
    var module = require('../../lib/index');
    expect(module.settings.states.deploy).to.exist;
    expect(module.settings.states.deploy).to.be.a('function');
  });
});

