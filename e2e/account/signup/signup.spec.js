'use strict';

var config = browser.params;
var UserModel = require(config.serverConfig.root + '/server/api/user/user.model').default;

describe('Signup View', function() {
  var page;

  var loadPage = function() {
    browser.manage().deleteAllCookies();
    browser.get(config.baseUrl + '/signup');
    page = require('./signup.po');
  };

  var testUser = {
    name: 'Test',
    email: 'test@example.com',
    password: 'test',
    confirmPassword: 'test'
  };

  beforeEach(function(done) {
    loadPage();
    browser.wait(function() {
        return browser.executeScript('return !!window.angular');
    }, 5000).then(done);
  });

  it('should include signup form with correct inputs and submit button', function() {
    expect(page.form.name.getAttribute('type')).toBe('text');
    expect(page.form.name.getAttribute('name')).toBe('name');
    expect(page.form.email.getAttribute('type')).toBe('email');
    expect(page.form.email.getAttribute('name')).toBe('email');
    expect(page.form.password.getAttribute('type')).toBe('password');
    expect(page.form.password.getAttribute('name')).toBe('password');
    expect(page.form.confirmPassword.getAttribute('type')).toBe('password');
    expect(page.form.confirmPassword.getAttribute('name')).toBe('confirmPassword');
    expect(page.form.submit.getAttribute('type')).toBe('submit');
    expect(page.form.submit.getText()).toBe('Sign up');
  });

  describe('with local auth', function() {

    beforeAll(function(done) {
      UserModel.remove().then(done);
    });

    it('should signup a new user, log them in, and redirecting to "/"', function() {
      page.signup(testUser);

      var navbar = require('../../components/navbar/navbar.po');

      expect(browser.getCurrentUrl()).toBe(config.baseUrl + '/');
      expect(navbar.navbarAccountGreeting.getText()).toBe('Hello ' + testUser.name);
    });

    it('should indicate signup failures', function() {
      page.signup(testUser);

      expect(browser.getCurrentUrl()).toBe(config.baseUrl + '/signup');
      expect(page.form.email.getAttribute('class')).toContain('ng-invalid-mongoose');

      var helpBlock = page.form.element(by.css('.form-group.has-error .help-block.ng-binding'));
      expect(helpBlock.getText()).toBe('The specified email address is already in use.');
    });

  });
});
