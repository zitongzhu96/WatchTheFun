/* eslint-disable */
// Use function instead of () => {} in controller.js and controllerUnit.test.js
// Since the latter does not contain this

document.head.innerHTML=`<script src="/javascripts/PostController.js" type="text/javascript"></script>`
document.body.innerHTML=`<body ng-controller="dynamicController">
<!-- Navigation bar at the top of the screen -->
<nav class="navbar navbar-expand-lg navbar-light bg-light" id="grid-nav">
    <span class="navbar-brand center">Watch The Fun</span>
        
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
            <div>
                <a class="nav-item nav-link active" id="dashboard" href="/MainPage">
                    <i class="fas fa-atom"></i> Dashboard
                </a>
                <a class="nav-item nav-link" id="friendlistpage" href="/FriendList">
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

<div id="grid-container" ng-controller="readController" >
    <!-- Activity screen -->
    <div id="grid-main">
        <div class="element" ng-repeat="x in injectAll">
            <p class="inline_id" style="display: none;">{{x.post_id}}</p>
            <div class="title">
                <div class="person">
                    <img class="person-icon" ng-src="{{x.icon1}}"/>
                    <p class="person-name">{{x.username}}</p>
                </div>
                <div class="post-time">{{x.time}}</div>
                <div class="tagged_mark">{{x.tagged}}</div>
            </div>
            <div class="content">
                <img ng-src="{{x.picture}}"/>
                <p>{{x.text}}</p>
            </div>
            <div class="tail">
                <div class="like">
                    <div class="like-btn" ng-click="addLike({event: $event})" style="background-color: {{x.bkg_color}};">
                        <a class="{{x.thumb}}" style="color:red;"></a>
                        <p class="like-text">{{x.liked}}</p>
                    </div>
                    <div class="comment-btn" ng-click="sendPostID({event: $event})" data-toggle="modal" data-target="#new-comment">
                        <a class="far fa-comments" style="color:green"></a>
                        <p class="comment-text"> Chat !</p>
                    </div>
                    <div class="like-info">
                        <p class="like-count">{{x.likeCount}}</p>
                        <p> people like this post</p>
                    </div>
                </div>
            </div>
            <div class="comment-list">
                <div class="comment-element" ng-repeat="y in x.commentList">
                    <div class="cmt-title">
                        <div class="cmt-person">{{y.username}}</div>
                        <div class="cmt-time">{{y.time}}</div>
                        <div class="cmt-tag">{{y.tagged}}</div>
                    </div>
                    <div class="cmt-body" style = "{{y.style}}">{{y.cmt_content}}</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Sidebar -->
    <div id="grid-sidebar">
        <!-- Username + Profile corner -->
        <div id="grid-profile">
            <div>
                <img id="grid-user-photo"/>
            </div>
            <div id="grid-username" ng-init="addIcon()">
                UserName
            </div>
        </div>

        <!-- Post your life button, start an embedded window -->
        <div id="grid-post">   
            <a class="btn btn-success" id="post-your-life" data-toggle="modal" data-target="#new-post">
                <i class="fa fa-rocket"> <i class="fa fa-rocket"></i> </i>
                <p>Post Your Life !</p>
            </a>
        </div>

        <!-- Friend list of current user, displays part of all friends -->
        <div id="grid-friend">
            <div id="friend-table">
                Latest updates of your friends
                <ul>

                </ul>
            </div>
            <div>
                <a class="btn btn-info btn-lg">
                    <i class="fa fa-search"></i> Go to your friend list
                </a>
            </div>
            <div id="follower-container">
                <span>Followers</span>
            <table class="friendlist-table">
                    <tr ng-repeat="f2 in follower">
                        <td><button type="button" class="friendbtn" ng-click="goProfile(f2.follow_host)">{{f2.follow_host}}</button></td>
                    </tr>
                  </table>
            </div>
            <div id="following-container">
                <span>Followings</span>
                <table class="friendlist-table">
                    <tr ng-repeat="f1 in following">
                        <td><button type="button" class="friendbtn" ng-click="goProfile(f1.follow_guest)">{{f1.follow_guest}}</button></td>
                    </tr>
                  </table>
            </div>
        </div>


        <!-- Suggestions of new friends, display part of all suggestions -->
        <div id="grid-advice">
            <div id="advice-table">
                See more...
                <ul>

                </ul>
            </div>
            <div>
                <a class="btn btn-info btn-lg">
                    <i class="fa fa-plus-square"></i> Meet new people
                </a>
            </div>
            <div id="suggests">
                <div id="suggest-users">
                    <div class="su-container" ng-repeat="sf in suggest">
                        <img ng-src="{{sf.icon}}">
                        <p id="suggest-username">{{sf.username}}</p>      
                        <button type="submit" class="search-btn" ng-click="followUser({event:$event})">Follow</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<!-- Dialog to create new posting -->
<div class="modal fade" id="new-post" tabindex="-1" role="dialog" aria-hidden="true"> 
    <div class="modal-dialog" role="document">
        <div class="modal-content" style="display: flex; justify-content: center;" ng-controller="postController" href="/newPost">
            <input type="file" id="file-dir" file-model="outimg" accept="image/gif,image/jpg,image/jpeg,image/png,image/tif,image/bmp" style="display: none;"/>
            <div class="modal-header">
                <h5 class="modal-title" id="post-title">
                    Create Your New Post
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="clearPostModal()">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="post-body">
                <textarea class="modal-text" id="post-content" placeholder="Write your feelings here!" ng-model="outtxt"></textarea>
                <div class="modal-functions">
                    <a id="imgfinder">
                        <i class="fas fa-upload"> Upload local image</i>
                    </a>
                    <a class="emoji-finder" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <p class="emoji-dropdown">Find emoji &#128512</p>
                    </a>
                </div>
            </div>
            <div class="preview-panel">
                <div class="preview-title">
                    Preview of new post:
                </div>
                <div id="preview-area">
                    <img id="preview-image"/>
                    <p id="preview-text" ng-bind-html="outtxt | emoji"></p>
                </div>
            </div>
            <div class="modal-footer" id="post-footer">
                <a class="btn btn-danger" id="set-private" ng-click="setPrivate()">Set As Private</a> 
                <a class="btn btn-secondary" data-dismiss="modal" id="close-post">Close</a>
                <a class="btn btn-primary"  data-dismiss="modal" id="add-post" ng-click="addPost()">
                    <i class="fa fa-rocket"></i> Post!
                </a>
            </div>  
        </div>
    </div>
</div>

<!-- Dialog to create new comment -->
<div class="modal fade" id="new-comment" tabindex="-1" role="dialog" aria-hidden="true"> 
    <div class="modal-dialog" role="document">
        <div class="modal-content" style="display: flex; justify-content: center;" href="/newComment">
            <p id="chat-post-id" style="display: none;"></p>
            <div class="modal-header">
                <h5 class="modal-title" id="comment-title">
                    Add Your Comment !
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="clearCommentModal()">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="comment-body">
                <textarea class="modal-text" id="comment-content" placeholder="Write your comments!" ng-model="outcomment"></textarea>
                <div class="modal-functions">
                    <a class="emoji-finder" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <p class="emoji-dropdown">Find emoji &#128512</p>
                    </a>
                </div>
            </div>
            <div class="modal-footer" id="comment-footer">
                <a class="btn btn-secondary" data-dismiss="modal" id="close-comment">Close</a>
                <a class="btn btn-primary"  data-dismiss="modal" id="add-comment" ng-click="addComment({event: $event})">
                    <i class="far fa-comment"></i> Comment
                </a>
            </div>  
        </div>
    </div>
</div>`

require('../node_modules/angular/angular.min.js');
require('../node_modules/angular-mocks/angular-mocks.js');
const sinon = require('sinon');
require('../public/javascripts/ReadController.js');

describe('Main page unit testing', function(){
    beforeEach(angular.mock.module('MyApp'));
  
    var $httpBackend, $rootScope, $controller, createController;
  
    describe('Testing profileController', function(){
      beforeEach(inject(function($injector){
        $httpBackend = $injector.get('$httpBackend');
        $controller = $injector.get('$controller');
        $http = $injector.get('$http');
        $scope = {};
      }));
    
      it('should return error of page loading and get no icons', function(){
        const controller = $controller('readController', { $scope, $http });
        $httpBackend.when('GET', '/injectAll?username=').respond(500, {
            info: 'post tagging error',
            result: [{username: 'zitongzh', post_id: '1', picture: '123', text: 'hello', time:'2019.12.9'}],
            icon: [{username: 'zitongzh', icon:''}],
            like: [{username: 'zitongzh', post_id: '1'}],
            count: [{count:1, post_id: '1'}],
            comment: [{cmt_id: '11', post_id: '1', username:'yfmao', cmt_content:'haha'}],
            postTag: [],
            commentTag: [],
          });
        $httpBackend.expect('GET', '/injectAll?username=');

        $httpBackend.when('GET', '/following?username=').respond(200, {
          status: 'success',
          user: [{follow_guest :'zitongzh'}],
        });
        $httpBackend.expect('GET', '/following?username=');
          
        $httpBackend.when('GET', '/follower?username=').respond(200, {
          status: 'success',
          user: [{follow_host :'zitongzh'}],
        });
        $httpBackend.expect('GET', '/follower?username=');

        $httpBackend.when('GET', '/suggestFriend?username=').respond(200, {
          status: 'followed',
          user: [{follow_guest :'zitongzh'}],
        });
        $httpBackend.expect('GET', '/suggestFriend?username=');

        $httpBackend.when('GET', '/addIcon?user=').respond(200, {
          status: 'success',
          result: JSON.stringify([{icon: 'default'}]),
        });
        $httpBackend.expect('GET', '/addIcon?user=');
        $scope.addIcon();
        const userIcon = document.getElementById('grid-user-photo');
        expect(userIcon.src).toBe('');
        $httpBackend.flush();
        expect($scope.injectAll).toBeUndefined();
      });

      it('should return error of page sidebar loading', function(){
        const controller = $controller('readController', { $scope, $http });
        $httpBackend.when('GET', '/injectAll?username=').respond(200, {
            info: 'post tagging error',
            result: [{username: 'zitongzh', post_id: '1', picture: '123', text: 'hello', time:'2019.12.9'}],
            icon: [{username: 'zitongzh', icon:''}],
            like: [{username: 'zitongzh', post_id: '1'}],
            count: [{count:1, post_id: '1'}],
            comment: [{cmt_id: '11', post_id: '1', username:'yfmao', cmt_content:'haha'}],
            postTag: [],
            commentTag: [],
          });
        $httpBackend.expect('GET', '/injectAll?username=');

        $httpBackend.when('GET', '/following?username=').respond(500, {
          info: 'error',
        });
        $httpBackend.expect('GET', '/following?username=');
          
        $httpBackend.when('GET', '/follower?username=').respond(500, {
          info: 'error',
        });
        $httpBackend.expect('GET', '/follower?username=');

        $httpBackend.when('GET', '/suggestFriend?username=').respond(500, {
          info: 'error',
        });
        $httpBackend.expect('GET', '/suggestFriend?username=');

        $httpBackend.when('GET', '/addIcon?user=').respond(500, {
          info: 'error',
        });
        $httpBackend.expect('GET', '/addIcon?user=');
        $scope.addIcon();
        $httpBackend.flush();
      });


      it('load out the correct content and get correct icon', function(){
        const controller = $controller('readController', { $scope, $http });
        $httpBackend.when('GET', '/injectAll?username=').respond(200, {
            status: 'success',
            result: [{username: 'zitongzh', post_id: '1', picture: '123', text: 'hello', time:'2019.12.9'}],
            icon: [{username: 'zitongzh', icon:''}],
            like: [{username: 'zitongzh', post_id: '1'}],
            count: [{count:1, post_id: '1'}],
            comment: [{cmt_id: '11', post_id: '1', username:'yfmao', cmt_content:'haha'}],
            postTag: [],
            commentTag: [],
          });
        $httpBackend.expect('GET', '/injectAll?username=');

        $httpBackend.when('GET', '/following?username=').respond(200, {
          status: 'success',
          user: [{follow_guest :'zitongzh'}],
        });
        $httpBackend.expect('GET', '/following?username=');
          
        $httpBackend.when('GET', '/follower?username=').respond(200, {
          status: 'success',
          user: [{follow_host :'zitongzh'}],
        });
        $httpBackend.expect('GET', '/follower?username=');

        $httpBackend.when('GET', '/suggestFriend?username=').respond(200, {
          status: 'followed',
          user: [{follow_guest :'zitongzh'}],
        });
        $httpBackend.expect('GET', '/suggestFriend?username=');

        $httpBackend.when('GET', '/addIcon?user=').respond(200, {
          status: 'success',
          result: JSON.stringify([{icon: 'default'}]),
        });
        $httpBackend.expect('GET', '/addIcon?user=');
        $scope.addIcon();
        const userIcon = document.getElementById('grid-user-photo');
        expect(userIcon.src).toBe("http://localhost/default");
        
        $httpBackend.flush();
        expect($scope.injectAll).toEqual(
            [{"bkg_color": "gold", 
            "commentList": [{"cmt_content": "haha", "cmt_id": "11", "post_id": "1", "time": "", "username": "yfmao"}], 
            "icon1": "", 
            "likeCount": 0, 
            "like_count": undefined, 
            "liked": " Liked", 
            "picture": "123", 
            "post_id": "1", 
            "tagged": "", 
            "text": "hello", 
            "thumb": "fas fa-thumbs-up", 
            "time": "2019.12.9", 
            "username": "zitongzh"}]);
      });

      it('should go to the correct profile',() => {
        const controller = $controller('readController', { $scope, $http });
        $httpBackend.when('GET', '/injectAll?username=').respond(200, {
            status: 'success',
            result: [{username: 'zitongzh', post_id: '1', picture: '123', text: 'hello', time:'2019.12.9'}],
            icon: [{username: 'zitongzh', icon:''}],
            like: [{username: 'zitongzh', post_id: '1'}],
            count: [{count:1, post_id: '1'}],
            comment: [{cmt_id: '11', post_id: '1', username:'yfmao', cmt_content:'haha'}],
            postTag: [],
            commentTag: [],
          });
        $httpBackend.expect('GET', '/injectAll?username=');

        $httpBackend.when('GET', '/following?username=').respond(200, {
          status: 'success',
          user: [{follow_guest :'zitongzh'}],
        });
        $httpBackend.expect('GET', '/following?username=');

        $httpBackend.when('GET', '/follower?username=').respond(201, {
            status: 'success',
            user: [{follow_host :'zitongzh'}],
        });
        $httpBackend.expect('GET', '/follower?username=');

        $httpBackend.when('GET', '/suggestFriend?username=').respond(200, {
            status: 'followed',
            user: [{follow_guest :'zitongzh'}],
          });
        $httpBackend.expect('GET', '/suggestFriend?username=');
    
        $httpBackend.when('GET', '/goFollowing/zitongzh?followGuest=zitongzh&username=').respond(201, {
            status: 'success',
            user: 'zitongzh',
        });
        $httpBackend.expect('GET', '/goFollowing/zitongzh?followGuest=zitongzh&username=');        
        $scope.goProfile('zitongzh');
        const stub = sinon.stub(window.location, 'assign').callsFake(function fakeFn() {return 'http://localhost:8081/GuestProfile/yfmao/zitongzh';});
        expect(window.location.assign()).toBe('http://localhost:8081/GuestProfile/yfmao/zitongzh');
        $httpBackend.flush();
        stub.restore();
      });

      it('should return error on profile direction',() => {
        const controller = $controller('readController', { $scope, $http });
        $httpBackend.when('GET', '/injectAll?username=').respond(200, {
            status: 'success',
            result: [{username: 'zitongzh', post_id: '1', picture: '123', text: 'hello', time:'2019.12.9'}],
            icon: [{username: 'zitongzh', icon:''}],
            like: [{username: 'zitongzh', post_id: '1'}],
            count: [{count:1, post_id: '1'}],
            comment: [{cmt_id: '11', post_id: '1', username:'yfmao', cmt_content:'haha'}],
            postTag: [],
            commentTag: [],
        });
        $httpBackend.expect('GET', '/injectAll?username=');

        $httpBackend.when('GET', '/following?username=').respond(200, {
          status: 'success',
          user: [{follow_guest :'zitongzh'}],
        });
        $httpBackend.expect('GET', '/following?username=');

        $httpBackend.when('GET', '/follower?username=').respond(201, {
            status: 'success',
            user: [{follow_host :'zitongzh'}],
        });
        $httpBackend.expect('GET', '/follower?username=');

        $httpBackend.when('GET', '/suggestFriend?username=').respond(200, {
            status: 'followed',
            user: [{follow_guest :'zitongzh'}],
          });
        $httpBackend.expect('GET', '/suggestFriend?username=');
    
        $httpBackend.when('POST', '/followSuggest').respond(200, {
            status: 'sucess',
            user: [{follow_guest :'zitongzh'}],
          });
        $httpBackend.expect('POST', '/followSuggest');
    
        myEvent={event:{}};
        myEvent.event.currentTarget = {};
        myEvent.event.currentTarget.innerHTML = 'Follow';
        myEvent.event.currentTarget = 'yfmao';
        myEvent.event.path = [0,{children: [0, {innerHTML: 'zitongzh'}]}];
        const stub = sinon.stub(window, 'alert').callsFake(function fakeFn() {return 'Followed:)';});
        $scope.followUser(myEvent);
        $httpBackend.flush();
        expect($scope.suggest).toEqual({status: 'followed', user: [{follow_guest :'zitongzh'}]});
        expect(window.alert()).toBe('Followed:)'); 
        stub.restore()
      });

      it('should return to suggested person',() => {
        const controller = $controller('readController', { $scope, $http });
        $httpBackend.when('GET', '/injectAll?username=').respond(200, {
            status: 'success',
            result: [{username: 'zitongzh', post_id: '1', picture: '123', text: 'hello', time:'2019.12.9'}],
            icon: [{username: 'zitongzh', icon:''}],
            like: [{username: 'zitongzh', post_id: '1'}],
            count: [{count:1, post_id: '1'}],
            comment: [{cmt_id: '11', post_id: '1', username:'yfmao', cmt_content:'haha'}],
            postTag: [],
            commentTag: [],
        });
        $httpBackend.expect('GET', '/injectAll?username=');

        $httpBackend.when('GET', '/following?username=').respond(200, {
          status: 'success',
          user: [{follow_guest :'zitongzh'}],
        });
        $httpBackend.expect('GET', '/following?username=');

        $httpBackend.when('GET', '/follower?username=').respond(201, {
            status: 'success',
            user: [{follow_host :'zitongzh'}],
        });
        $httpBackend.expect('GET', '/follower?username=');

        $httpBackend.when('GET', '/suggestFriend?username=').respond(200, {
            status: 'followed',
            user: [{follow_guest :'zitongzh'}],
          });
        $httpBackend.expect('GET', '/suggestFriend?username=');
    
        $httpBackend.when('POST', '/followSuggest').respond(200, {
            status: 'sucess',
            user: [{follow_guest :'zitongzh'}],
          });
        $httpBackend.expect('POST', '/followSuggest');
    
        myEvent={event:{}};
        myEvent.event.currentTarget = {};
        myEvent.event.currentTarget.innerHTML = 'Follow';
        myEvent.event.currentTarget = 'yfmao';
        myEvent.event.path = [0,{children: [0, {innerHTML: 'zitongzh'}]}];
        const stub = sinon.stub(window, 'alert').callsFake(function fakeFn() {return 'Followed:)';});
        $scope.followUser(myEvent);
        $httpBackend.flush();
        expect($scope.suggest).toEqual({status: 'followed', user: [{follow_guest :'zitongzh'}]});
        expect(window.alert()).toBe('Followed:)'); 
        stub.restore();
      });

      it('should return error on suggestions',() => {
        const controller = $controller('readController', { $scope, $http });
        $httpBackend.when('GET', '/injectAll?username=').respond(200, {
            status: 'success',
            result: [{username: 'zitongzh', post_id: '1', picture: '123', text: 'hello', time:'2019.12.9'}],
            icon: [{username: 'zitongzh', icon:''}],
            like: [{username: 'zitongzh', post_id: '1'}],
            count: [{count:1, post_id: '1'}],
            comment: [{cmt_id: '11', post_id: '1', username:'yfmao', cmt_content:'haha'}],
            postTag: [],
            commentTag: [],
        });
        $httpBackend.expect('GET', '/injectAll?username=');

        $httpBackend.when('GET', '/following?username=').respond(200, {
          status: 'success',
          user: [{follow_guest :'zitongzh'}],
        });
        $httpBackend.expect('GET', '/following?username=');

        $httpBackend.when('GET', '/follower?username=').respond(201, {
            status: 'success',
            user: [{follow_host :'zitongzh'}],
        });
        $httpBackend.expect('GET', '/follower?username=');

        $httpBackend.when('GET', '/suggestFriend?username=').respond(200, {
            status: 'followed',
            user: [{follow_guest :'zitongzh'}],
          });
        $httpBackend.expect('GET', '/suggestFriend?username=');
    
        $httpBackend.when('POST', '/followSuggest').respond(500, {
            info: 'Database error:'
          });
        $httpBackend.expect('POST', '/followSuggest');
    
        myEvent={event:{}};
        myEvent.event.currentTarget = {};
        myEvent.event.currentTarget.innerHTML = 'Follow';
        myEvent.event.currentTarget = 'yfmao';
        myEvent.event.path = [0,{children: [0, {innerHTML: 'zitongzh'}]}];
        $scope.followUser(myEvent);
        $httpBackend.flush();
        expect($scope.suggest).toEqual({status: 'followed', user: [{follow_guest :'zitongzh'}]});
      });



      afterEach(function(){
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        });
    });
});




