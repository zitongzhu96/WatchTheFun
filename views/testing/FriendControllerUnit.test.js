/* eslint-disable */
// Use function instead of () => {} in controller.js and controllerUnit.test.js
// Since the latter does not contain this

document.body.innerHTML=`    <body ng-controller="dynamicController">
<div id="grid-container">
    <!-- Navigation bar at the top of the screen -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light" id="grid-nav">
        <span class="navbar-brand center">Watch The Fun</span>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav">
                    <div>
                        <a class="nav-item nav-link" id="dashboard" href="/MainPage">
                            <i class="fas fa-atom"></i> Dashboard
                        </a>
                        <a class="nav-item nav-link active" id="friendlistpage" href="/FriendList">
                            <i class="far fa-address-book"></i> Friend List
                        </a>
                        <a class="nav-item nav-link" id="profilepage" href="/Profile">
                            <i class="fas fa-user-circle"></i> My Profile
                        </a>
                    </div>
                    
                    <a class="nav-item nav-link" id="loginpage" ng-click="logout()">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </a>
                </div>
            </div>
    </nav>
<div id="main-container">
<div id="search-container" ng-controller="searchController">
    <div id="search-label">FIND NEW FRIENDS HERE:</div>
    <input type="text" id="search-input" ng-model="searchname" placeholder="SEARCH OTHER USERS">
    <button type="submit" id="search-btn" ng-click="searchUser()">Search</button>
</div>
<center><span id="search-label" style="font-size:30px">SEE YOUR FRIENDS HERE! </span></center>
<div id="users-container">   
 <div id="friendlist" ng-controller="friendlistController">
<div id="following-box">
    <div id="following-label">
        F<br>O<br>L<br>L<br>O<br>W<br>I<br>N<br>G
    </div>
    <div id="following-container">
        <table class="friendlist-table">
            <tr ng-repeat="f1 in following">
                <td><button type="button" class="friendbtn" ng-click="goProfile(f1.follow_guest)">
                    <span class="smicon"><img style="height:40px; width:40px" class="person-icon" ng-src="{{f1.icon}}"/><span class="person-name">{{f1.follow_guest}}</span></span>
                </button></td>
            </tr>
          </table>
    </div>
</div>
<div id="follower-box">
        <div id="follower-label">
                F<br>O<br>L<br>L<br>O<br>W<br>E<br>R
        </div>
        <div id="follower-container">
            <table class="friendlist-table">
                <tr ng-repeat="f2 in follower">
                        <td><button type="button" class="friendbtn" ng-click="goProfile(f2.follow_host)">
                            <span class="smicon"><img style="height:40px; width:40px" class="person-icon" ng-src="{{f2.icon}}"/><span class="person-name">{{f2.follow_host}}</span></span>
                        </button></td>
                </tr>
              </table>
        </div>
</div>

<div id="suggests" ng-controller="suggestController">
    <div id="suggests-label">S<br>U<br>G<br>G<br>E<br>S<br>T </div>
        <table class="suggest-table">
            <tr ng-repeat="sf in suggest" >
                <td><button type="button" class="friendbtn"  ng-click="goProfile(sf.username)">
                    <span class="smicon"><img style="height:40px; width:40px" class="person-icon" ng-src="{{sf.icon}}"><span id="suggest-username">{{sf.username}}</span>
                    </span>
                </button></td>
                <td><button type="submit" class="search-btn" ng-click="followUser({event:$event})">Follow</button></td>
                </tr>
        </table> 
</div>
</div>
</div>
</div>
</div>
</body>
`

require('../node_modules/angular/angular.min.js');
require('../node_modules/angular-mocks/angular-mocks.js');
const sinon = require('sinon');
require('../public/javascripts/FriendController.js');

describe('friend page unit testing', function(){
  beforeEach(
    angular.mock.module('MyApp')
  );

  var $httpBackend, $rootScope, $controller, createController;

  describe('Testing searchController', function(){
    beforeEach(inject(function($injector){
      $httpBackend = $injector.get('$httpBackend');
      $controller = $injector.get('$controller');
      $http = $injector.get('$http');
      $scope = {};
      createController = function() {
        return $controller('searchController', { $scope, $http });
      };
    }));

    it('should find user successfully', function(){
      const controller = createController();
      $scope.searchname = 'yfmao';
      $httpBackend.when('GET', '/searchUser?searchname=yfmao&username=' ).respond(201, {
        status: 'success',
        user: 'yfmao',
      });
      $httpBackend.expect('GET', '/searchUser?searchname=yfmao&username=');
      $scope.searchUser();
      const stub = sinon.stub(window.location, 'assign').callsFake(function fakeFn() {return 'http://localhost:8081/GuestProfile/yfmao/zitongzh';});
      expect(window.location.assign()).toBe( 'http://localhost:8081/GuestProfile/yfmao/zitongzh');
      $httpBackend.flush();
      stub.restore();
    });

    it('should find myself', function(){
        const controller = createController();
        $scope.searchname = 'yfmao';
        $httpBackend.when('GET', '/searchUser?searchname=yfmao&username=' ).respond(200, {
          status: 'myself',
          user: 'yfmao',
          token: '1',
        });
        $httpBackend.expect('GET', '/searchUser?searchname=yfmao&username=');
        $scope.searchUser();
        const stub = sinon.stub(window.location, 'assign').callsFake(function fakeFn() {return 'http://localhost:8081/Profile/yfmao';});
        expect(window.location.assign()).toBe( 'http://localhost:8081/Profile/yfmao');
        $httpBackend.flush();
        stub.restore();
      });

    it('should say user unexist', function(){
        const controller = createController();
        $scope.searchname = 'deepdark';
        $httpBackend.when('GET', '/searchUser?searchname=deepdark&username=' ).respond(404, {
          status: 'unexist',
          info: 'Database error',
        });
        $httpBackend.expect('GET', '/searchUser?searchname=deepdark&username=');
        $scope.searchUser();
        const stub = sinon.stub(window, 'alert').callsFake(function fakeFn() {return 'http://localhost:8081/GuestProfile/yfmao/zitongzh';});
        expect(window.alert()).toBe( 'http://localhost:8081/GuestProfile/yfmao/zitongzh');
        expect(window.location.href).toBe('http://localhost/');  
        $httpBackend.flush();
        stub.restore();
      });
      afterEach(function(){
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });
    });


  describe('Testing friendlistController', function(){
    beforeEach(inject(function($injector){
      $httpBackend = $injector.get('$httpBackend');
      $controller = $injector.get('$controller');
      $http = $injector.get('$http');
      $scope = {};
      $scope.following = [];
      createController = function() {
        return $controller('friendlistController', { $scope, $http });
      };
    }));

    it('should go to the guestprofile', function(){
      const controller = createController();
      $httpBackend.when('GET', '/following?username=').respond(201, {
        status: 'success',
        user: [{follow_guest :'zitongzh'}],
      });
      $httpBackend.expect('GET', '/following?username=');
      
      $httpBackend.when('GET', '/follower?username=').respond(201, {
        status: 'success',
        user: [{follow_host :'zitongzh'}],
      });
      $httpBackend.expect('GET', '/follower?username=');

      $httpBackend.when('GET', '/goFollowing/zitongzh?followGuest=zitongzh&username=').respond(201, {
        status: 'success',
        user: 'zitongzh',
      });
      $httpBackend.expect('GET', '/goFollowing/zitongzh?followGuest=zitongzh&username=');
      $scope.goProfile('zitongzh');
      const stub = sinon.stub(window.location, 'assign').callsFake(function fakeFn() {return 'http://localhost:8081/GuestProfile/yfmao/zitongzh';});
      expect(window.location.assign()).toBe('http://localhost:8081/GuestProfile/yfmao/zitongzh');
      $httpBackend.flush();
      expect($scope.following).toEqual({status: 'success',user: [{follow_guest :'zitongzh'}]});
      expect($scope.follower).toEqual({status: 'success',user: [{follow_host :'zitongzh'}]});
      stub.restore();
    });
        
    afterEach(function(){
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });

  describe('Testing suggestController', function(){
    beforeEach(inject(function($injector){
      $httpBackend = $injector.get('$httpBackend');
      $controller = $injector.get('$controller');
      $http = $injector.get('$http');
      $scope = {};
      createController = function() {
        return $controller('suggestController', { $scope, $http });
      };
    }));

    it('Test the suggestion bar following functionality', () => {
      const controller = createController();
      $httpBackend.when('GET', '/suggestFriend?username=').respond(200, {
        status: 'followed',
        user: [{follow_guest :'zitongzh'}],
      });
      $httpBackend.expect('GET', '/suggestFriend?username=');
      
      $httpBackend.when('POST', '/followSuggest').respond(200, {
        status: 'followed',
        user: [{follow_guest :'zitongzh'}],
      });
      $httpBackend.expect('POST', '/followSuggest');

      myEvent={event:{}};
      myEvent.event.currentTarget = {};
      myEvent.event.currentTarget.innerHTML = 'Follow';
      myEvent.event.currentTarget = 'yfmao';
      myEvent.event.path = [0,1,{children: [{children: [{children :[{children :[0,{innerHTML: 'zitongzh'}]}]}]}]}];

      const stub = sinon.stub(window, 'alert').callsFake(function fakeFn() {return 'Followed:)';});
      $scope.followUser(myEvent);
      $httpBackend.flush();
      expect($scope.suggest).toEqual({status: 'followed', user: [{follow_guest :'zitongzh'}]})
      expect(window.alert()).toBe( 'Followed:)');
      stub.restore();
    });

    it('Test the suggestion bar unfolllowing functionality', () => {
      const controller = createController();
      $httpBackend.when('GET', '/suggestFriend?username=').respond(200, {
        status: 'unfollowed',
        user: [{follow_guest :'zitongzh'}],
      });
      $httpBackend.expect('GET', '/suggestFriend?username=');
      
      $httpBackend.when('POST', '/followSuggest').respond(200, {
        status: 'unfollowed',
        user: [{follow_guest :'zitongzh'}],
      });
      $httpBackend.expect('POST', '/followSuggest');

      myEvent={event:{}};
      myEvent.event.currentTarget = {};
      myEvent.event.currentTarget.innerHTML = 'Unfollow';
      myEvent.event.currentTarget = 'yfmao';
      myEvent.event.path = [0,1,{children: [{children: [{children :[{children :[0,{innerHTML: 'zitongzh'}]}]}]}]}];

      const stub = sinon.stub(window, 'alert').callsFake(function fakeFn() {return 'Unfollowed:(';});
      $scope.followUser(myEvent);
      $httpBackend.flush();
      expect($scope.suggest).toEqual({status: 'unfollowed', user: [{follow_guest :'zitongzh'}]})
      expect(window.alert()).toBe( 'Unfollowed:(');
      stub.restore();
    });

    it('Test the suggestion bar functionality', () => {
      const controller = createController();
      $httpBackend.when('GET', '/suggestFriend?username=').respond(500, {
        info: 'Unexpect error',
      });
      $httpBackend.expect('GET', '/suggestFriend?username=');
      
      $httpBackend.when('POST', '/followSuggest').respond(500, {
        info: 'Unexpect error',
      });
      $httpBackend.expect('POST', '/followSuggest');

      myEvent={event:{}};
      myEvent.event.currentTarget = {};
      myEvent.event.currentTarget.innerHTML = 'Follow';
      myEvent.event.currentTarget = 'yfmao';
      myEvent.event.path = [0,1,{children: [{children: [{children :[{children :[0,{innerHTML: 'zitongzh'}]}]}]}]}];
      $scope.followUser(myEvent);
      $httpBackend.flush();
      expect($scope.suggest).toBeUndefined();
    });

    afterEach(function(){
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      });
    });
});
