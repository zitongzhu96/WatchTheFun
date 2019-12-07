/* eslint-disable */
// Use function instead of () => {} in controller.js and controllerUnit.test.js
// Since the latter does not contain this
require('../node_modules/angular/angular.min.js');
require('../node_modules/angular-mocks/angular-mocks.js');
const sinon = require('sinon');
require('../public/javascripts/LoginController.js');

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

      // Flush after every testing
      $httpBackend.flush();
    });





    afterEach(function(){
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });
});
