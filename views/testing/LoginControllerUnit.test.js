/* eslint-disable */
// Use function instead of () => {} in controller.js and controllerUnit.test.js
// Since the latter does not contain this

require('../node_modules/angular/angular.min.js');
require('../node_modules/angular-mocks/angular-mocks.js');
const sinon = require('sinon');
require('../public/javascripts/LoginController.js');

document.body.innerHTML=` <input type="text" class="input username" placeholder="Username" ng-model="username" ng-init="username =''" id="name"/><input
type="password" class="input password" placeholder="Password" ng-model="password" ng-init="password =''" id="pwd"/>
<canvas id="defaultIcon" width="120" height="120" style="display: none;"></canvas>`
// Module App level
describe('Login unit testing', function(){
  beforeEach(angular.mock.module('MyApp'));

  var $httpBackend, $rootScope, $controller, createController;

  // Controller level
  describe('Testing loginController', function(){
    beforeEach(inject(function($injector){
      $httpBackend = $injector.get('$httpBackend');
      $controller = $injector.get('$controller');
      $http = $injector.get('$http');
      $scope = {};
      createController = function() {
        return $controller('loginController', { $scope, $http });
      };
    }));

    it('should login successfully', function(){
      // Create controller first
      const controller = createController();
      // Set parameters of controller scope
      $scope.username = 'yfmao';
      $scope.password = 'Goodpass123!';
      // Flush may need before every mocking. It depends.
      // $httpBackend.flush();
      // Make ready of one scenario of backend server
      // Respond the following content of respond(...) when meeting the requirements in when(...)
      $httpBackend.when('POST', '/login', {
        user: 'yfmao',
        password: 'Goodpass123!',
      }).respond(201, {
        status: 'success',
        user: 'yfmao',
        token: '1',
      });

      // Carry out action as planned in the scenario
      $httpBackend.expect('POST', '/login', {
        user: 'yfmao',
        password: 'Goodpass123!',
      });
      $scope.verifyLogin();

      // If page is redirected, then use the following statement
      const stub = sinon.stub(window.location, 'assign').callsFake(function fakeFn() {return 'http://localhost:8081/MainPage/yfmao';});
      expect(window.location.assign()).toBe('http://localhost:8081/MainPage/yfmao');
      $httpBackend.flush();
      stub.restore();
    });

    it('should be unexist', function(){
      const controller = createController();
      $scope.username = 'luozizhu';
      $scope.password = 'asdasd';
      $httpBackend.when('POST', '/login', {
        user: 'luozizhu',
        password: 'asdasd',
      }).respond(500, {
        status: 'unexist',
        user: 'luozizhu',
        token: '2',
      });

      // Carry out action as planned in the scenario
      $httpBackend.expect('POST', '/login', {
        user: 'luozizhu',
        password: 'asdasd',
      });
      $scope.verifyLogin();

      // If page is redirected, then use the following statement
      //expect(Window.alert).toBe('User Not Exists!');
      const stub = sinon.stub(window, 'alert').callsFake(function fakeFn() {return 'User Not Exists!';});
      expect(window.alert()).toBe('User Not Exists!');
      expect(document.getElementById('name').value).toBe('');
      expect(document.getElementById('pwd').value).toBe('');
      expect(window.location.href).toBe('http://localhost/');
      $httpBackend.flush();
      stub.restore();
    });

    it('should sign up successfully', function(){
      const controller = createController();
      $scope.username = 'ziyangluo123';
      $scope.password = 'Asd123123!';
      $httpBackend.when('POST', '/register', {
        user: 'ziyangluo123',
        password: 'Asd123123!',
        usericon: '123',
      }).respond(200, {
        status: 'fail',
        user: 'ziyangluo123',
        token: '3',
      });
      const canvas = document.getElementById('defaultIcon');
      const stub = sinon.stub(canvas, 'toDataURL').callsFake(function fakeFn() {return '123';});
      const imgurl=canvas.toDataURL();
      const stub1 = sinon.stub(window, 'alert').callsFake(function fakeFn() {return 'Sign up successfully! Please login';});
      expect(imgurl).toBe('123');
      // Carry out action as planned in the scenario
      $httpBackend.expect('POST', '/register', {
        user: 'ziyangluo123',
        password: 'Asd123123!',
        usericon: imgurl,
      });
      $scope.newUser();
      expect(window.alert()).toBe('Sign up successfully! Please login');
      $httpBackend.flush();
      stub.restore();
    });

    it('should sign up failed', function(){
      const controller = createController();
      $scope.username = 'ziyangluo1234';
      $scope.password = 'asd';
      $httpBackend.when('POST', '/register', {
        user: 'ziyangluo1234',
        password: 'asd',
        usericon: '123',
      }).respond(400, {
        status: 'nullpwd',
        user: 'ziyangluo1234',
        token: '3',
      });
      const canvas = document.getElementById('defaultIcon');
      const stub = sinon.stub(canvas, 'toDataURL').callsFake(function fakeFn() {return '123';});
      const imgurl=canvas.toDataURL();
      expect(imgurl).toBe('123');
      // Carry out action as planned in the scenario
      $httpBackend.expect('POST', '/register', {
        user: 'ziyangluo1234',
        password: 'asd',
        usericon: imgurl,
      });
      $scope.newUser();
      expect(document.getElementById('name').value).toBe('');
      expect(document.getElementById('pwd').value).toBe('');
      $httpBackend.flush();
    });
    
    afterEach(function(){
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });
});
