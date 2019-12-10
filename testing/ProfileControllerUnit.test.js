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
require('../public/javascripts/ProfileController.js');


describe('profile page unit testing', function(){
    beforeEach(angular.mock.module('MyApp'));
  
    var $httpBackend, $rootScope, $controller, createController;
  
    describe('Testing profileController', function(){
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
        $httpBackend.when('GET', '/injectMain?guest=&username=' ).respond(404, {
          status: 'success',
          result: 'yfmao',
          like: [],
          count: [],
          comment :[],
        });
        $httpBackend.expect('GET', '/injectMain?guest=&username=');
        $httpBackend.when('GET', '/countPost?guest=&username=' ).respond(404, {
            status: 'success',
            user: 'yfmao',
          });
          $httpBackend.expect('GET', '/countPost?guest=&username=');
          $httpBackend.when('GET', '/countFollower?username=' ).respond(404, {
            status: 'success',
            user: 'yfmao',
          });
          $httpBackend.expect('GET', '/countFollower?username=' );
          $httpBackend.when('GET', '/countFollowing?username='  ).respond(404, {
            status: 'success',
            user: 'yfmao',
          });
          $httpBackend.expect('GET','/countFollowing?username=' );
        $httpBackend.when('GET', '/addIcon?user=' ).respond(404, {
            status: 'success',
            user: 'yfmao',
          });
        $httpBackend.expect('GET', '/addIcon?user=');
        $scope.addIcon();
        $scope.selectIcon();
        $httpBackend.flush();
      });

      it('should change icon', function(){
        const controller = createController();
        $httpBackend.when('GET', '/injectMain?guest=&username=' ).respond(200, [{
            status: 'success',
            result: 'yfmao',
            like: [{u:1,p:1}],
            count: [{u:1,p:1}],
            comment :[{u:1,p:1,c:1}],
          }]);
        $httpBackend.expect('GET', '/injectMain?guest=&username=');
        $httpBackend.when('GET', '/countPost?guest=&username=' ).respond(200, [{
            status: 'success',
            countPost: 0,
          }]);
          $httpBackend.expect('GET', '/countPost?guest=&username=');
          $httpBackend.when('GET', '/countFollower?username=' ).respond(200, [{
            status: 'success',
            countFollower: 0,
          }]);
          $httpBackend.expect('GET', '/countFollower?username=' );
          $httpBackend.when('GET', '/countFollowing?username='  ).respond(200, [{
            status: 'success',
            countFollowing: 0,
          }]);
          $httpBackend.expect('GET','/countFollowing?username=' );
        $httpBackend.when('GET', '/addIcon?user=' ).respond(200, [{
            status: 'success',
            result: "",
          }]);
        $httpBackend.expect('GET', '/addIcon?user=');
        $httpBackend.when('PUT', '/changeIcon' ).respond(200, {
            status: 'success',
            user: 'yfmao',
            img: '',
          });
        $httpBackend.expect('PUT', '/changeIcon');
        $scope.addIcon();
        $scope.selectIcon();
        $scope.changeIcon();
        const stub = sinon.stub(window.location, 'reload').callsFake(function fakeFn() {return 'http://localhost:8081/Profile/yfmao';});
        expect(window.location.reload()).toBe('http://localhost:8081/Profile/yfmao');
        $httpBackend.flush();
      });

      afterEach(function(){
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        });
    });
});