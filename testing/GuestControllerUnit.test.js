/* eslint-disable */
// Use function instead of () => {} in controller.js and controllerUnit.test.js
// Since the latter does not contain this


document.body.innerHTML=`<div id="grid-container" ng-controller="profileController">
<div id="grid-profile">
    <input type="file" id="dir" file-model="outimg" accept="image/gif,image/jpg,image/jpeg,image/png,image/tif,image/bmp" style="display: none;"/>
    <div id='saved-img' style="display: none;"></div>
    <div id="user-info">
        <img id="grid-user-photo" ng-click="selectIcon()"/> 
        <div id="grid-username" ng-init="addIcon()"></div> 
        <div id="upload-icon" ng-click="changeIcon()" style="display: none;"></div>
        <button type="submit" id="search-btn" ng-click="followUser()"><p id="followbtn"></p></button>
    </div>
    <div class="user-record">
            <div class="records">Posts<br><center></br><p id="numPosts"> </p></center></div>  
            <div class="records">Followers<br><center></br><p id="numFollowers"> </p></center></div>
            <div class="records">Following<br><center></br><p id="numFollowings"> </p></center></div>
    </div> 
</div>

<div id="grid-main">
    <div class="element" ng-repeat="x in injectMain">
        <p style="display: none;">{{x.post_id}}</p>
        <div class="title">
            <div class="person">
                <p class="person-name">{{x.username}}</p>
            </div>
            <div class="post-time">{{x.time}}</div>
            <div class="fas fa-times" data-toggle="modal" data-target="#delete-post" ng-click="sendPostID({event: $event})"> Delete Post</div>
        </div>
        <div class="content">
            <img ng-src="{{x.picture}}"/>
            <p>{{x.text}}</p>
        </div>
        <div class="tail">
            <div class="like">
                <div class="like-btn" ng-click="addLike({event: $event})" style="background-color:{{x.bkg_color}};">
                    <a class="{{x.thumb}}" style="color:red;"></a>
                    <p class="like-text">{{x.liked}}</p>
                </div>
                <div class="comment-btn" ng-click="sendPostID({event: $event})" data-toggle="modal" data-target="#new-comment">
                    <a class="far fa-comments" style="color:green"></a>
                    <p class="comment-text"> Chat !</p>
                </div>
                <div class="like-info">
                    <p class="like-count">{{x.like_count}}</p>
                    <p> people like this post</p>
                </div>
            </div>
        </div>
        <div class="comment_list">
            <div class="comment-element" ng-repeat="y in x.commentList">
                <div class="cmt-title">
                    <p class="cmt-id" style="display: none;">{{y.cmt_id}}</p>
                    <div class="cmt-person">{{y.username}}</div>
                    <div class="cmt-time">{{y.time}}</div>
                    <div class="fas fa-times" data-toggle="modal" data-target="#delete-comment" ng-click="sendPostID({event: $event})"> Delete Comment</div>
                </div>
                <div class="cmt-body">{{y.cmt_content}}</div>
            </div>
        </div>
    </div>
</div>           
</div>`

require('../node_modules/angular/angular.min.js');
require('../node_modules/angular-mocks/angular-mocks.js');
const sinon = require('sinon');
require('../public/javascripts/GuestProfileController.js');


describe('Guestprofile page unit testing', function(){
    beforeEach(angular.mock.module('MyApp'));
  
    var $httpBackend, $rootScope, $controller, createController;
  
    describe('Testing GuestProfileController', function(){
      beforeEach(inject(function($injector){
        $httpBackend = $injector.get('$httpBackend');
        $controller = $injector.get('$controller');
        $http = $injector.get('$http');
        $scope = {};
        createController = function() {
          return $controller('profileController', { $scope, $http });
        };
      }));

      it('should add icon and username', function(){
        const controller = createController();
        $httpBackend.when('GET', '/injectMain?guest=&username=localhost').respond(404, {
          status: 'error',
          result: 'yfmao',
          like: [],
          count: [],
          comment :[],
        });
        $httpBackend.expect('GET', '/injectMain?guest=&username=localhost');
        $httpBackend.when('GET', '/countPost?guest=&username=localhost' ).respond(404, {
            status: 'error',
            user: 'yfmao',
          });
          $httpBackend.expect('GET', '/countPost?guest=&username=localhost');
          $httpBackend.when('GET', '/countFollower?username=localhost' ).respond(404, {
            status: 'error',
            user: 'yfmao',
            
          });
          $httpBackend.expect('GET', '/countFollower?username=localhost' );
          $httpBackend.when('GET', '/countFollowing?username=localhost'  ).respond(404, {
            status: 'error',
            user: 'yfmao',
            
          });
          $httpBackend.expect('GET','/countFollowing?username=localhost' );
          $httpBackend.when('GET', '/followStatus?followGuest=localhost&followHost=' ).respond(404,{
            status: 'success',
            result: 'yfmao',
            like: [],
            count: [],
            comment :[],
            
          });
          $httpBackend.expect('GET', '/followStatus?followGuest=localhost&followHost=');
        $httpBackend.when('GET', '/addIcon?user=localhost' ).respond(404, {
            status: 'error',
            user: 'yfmao',
            
          });
        $httpBackend.expect('GET', '/addIcon?user=localhost');
        $scope.addIcon();
        $httpBackend.flush();     
      });

      it('should follow user', function(){
        const controller = createController();
        $httpBackend.when('GET', '/injectMain?guest=&username=localhost').respond(200, [{
            status: 'success',
            result: 'yfmao',
            like: [{u:1,p:1}],
            count: [{u:1,p:1}],
            comment :[{u:1,p:1,c:1}],
            
          }]);
        $httpBackend.expect('GET', '/injectMain?guest=&username=localhost');
        $httpBackend.when('GET', '/countPost?guest=&username=localhost' ).respond(200, [{
            status: 'success',
            countPost: 0,
            
          }]);
          $httpBackend.expect('GET', '/countPost?guest=&username=localhost');
          $httpBackend.when('GET', '/countFollower?username=localhost' ).respond(200, [{
            status: 'success',
            countFollower: 0,
            
          }]);
          $httpBackend.expect('GET', '/countFollower?username=localhost' );
          $httpBackend.when('GET', '/countFollowing?username=localhost'  ).respond(200, [{
            status: 'success',
            countFollowing: 0,
            
          }]);
          $httpBackend.expect('GET','/countFollowing?username=localhost' );
          $httpBackend.when('GET', '/followStatus?followGuest=localhost&followHost=').respond(200, 　[{
            status: 'success',
            result: 'yfmao',
            like: [],
            count: [],
            comment :[],
            
          }]);
          $httpBackend.expect('GET', '/followStatus?followGuest=localhost&followHost=');
        $httpBackend.when('POST', '/follow' ).respond(200, {
            status: 'followed',
            
          });
        $httpBackend.expect('POST', '/follow');
        $scope.followUser();
        const stub = sinon.stub(window, 'alert').callsFake(function fakeFn() {return 'followed';});
        expect(window.alert()).toBe('followed');
        $httpBackend.flush();       
        stub.restore();
      });

      it('should follow user', function(){
        const controller = createController();
        $httpBackend.when('GET', '/injectMain?guest=&username=localhost').respond(200, [{
            status: 'success',
            result: 'yfmao',
            like: [{u:1,p:1}],
            count: [{u:1,p:1}],
            comment :[{u:1,p:1,c:1}],
            
          }]);
        $httpBackend.expect('GET', '/injectMain?guest=&username=localhost');
        $httpBackend.when('GET', '/countPost?guest=&username=localhost' ).respond(200, [{
            status: 'success',
            countPost: 0,
            
          }]);
          $httpBackend.expect('GET', '/countPost?guest=&username=localhost');
          $httpBackend.when('GET', '/countFollower?username=localhost' ).respond(200, [{
            status: 'success',
            countFollower: 0,
            
          }]);
          $httpBackend.expect('GET', '/countFollower?username=localhost' );
          $httpBackend.when('GET', '/countFollowing?username=localhost'  ).respond(200, [{
            status: 'success',
            countFollowing: 0,
            
          }]);
          $httpBackend.expect('GET','/countFollowing?username=localhost' );
          $httpBackend.when('GET', '/followStatus?followGuest=localhost&followHost=').respond(200, 　[{
            status: 'success',
            result: 'yfmao',
            like: [],
            count: [],
            comment :[],
            
          }]);
          $httpBackend.expect('GET', '/followStatus?followGuest=localhost&followHost=');
        $httpBackend.when('POST', '/follow' ).respond(404);
        $httpBackend.expect('POST', '/follow');
        $scope.followUser();
        const stub = sinon.stub(window, 'alert').callsFake(function fakeFn() {return 'unfollowed';});
        expect(window.alert()).toBe('unfollowed');
        $httpBackend.flush();       
        stub.restore();
      });

      afterEach(function(){
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        });
    });
});