/* eslint-disable */
document.body.innerHTML = `
<body ng-controller="dynamicController">
        <div id="grid-container" ng-controller="profileController">
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
        </div>

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
        </div>

        <div class="modal fade" id="delete-post" tabindex="-1" role="dialog" aria-hidden="true"> 
            <div class="modal-dialog" role="document">
                <div class="modal-content" style="display: flex; justify-content: center;" href="/deletePost">
                    <p id="delete-post-id" style="display: none;"></p>
                    <div class="modal-header">
                        <h5 class="modal-title" id="del-post-title">
                            Deleting Post, Are you sure?
                        </h5>
                    </div>
                    <div class="modal-footer" id="del-post-footer">
                        <a class="btn btn-secondary" data-dismiss="modal" id="close-del-post">Withdraw</a>
                        <a class="btn btn-danger"  data-dismiss="modal" id="del-post" ng-click="deletePost()">
                            <i class="fas fa-comment-slash"></i> Confirm & Delete
                        </a>
                    </div>  
                </div>
            </div>
        </div>

        <div class="modal fade" id="delete-comment" tabindex="-1" role="dialog" aria-hidden="true"> 
            <div class="modal-dialog" role="document">
                <div class="modal-content" style="display: flex; justify-content: center;" href="/deleteComment">
                    <p id="delete-comment-id" style="display: none;"></p>
                    <div class="modal-header">
                        <h5 class="modal-title" id="del-comment-title">
                            Deleting Comment, Are you sure?
                        </h5>
                    </div>
                    <div class="modal-footer" id="del-comment-footer">
                        <a class="btn btn-secondary" data-dismiss="modal" id="close-del-comment">Withdraw</a>
                        <a class="btn btn-danger"  data-dismiss="modal" id="del-comment" ng-click="deleteComment()">
                            <i class="fas fa-comment-slash"></i> Confirm & Delete
                        </a>
                    </div>  
                </div>
            </div>
        </div>
</body>`


require('../node_modules/angular/angular.min.js');
require('../node_modules/angular-mocks/angular-mocks.js');
const sinon = require('sinon');
require('../public/javascripts/DynamicController.js');

describe('Like and commenting page unit testing', function(){
  beforeEach(
    angular.mock.module('MyApp')
  );

  var $httpBackend, $rootScope, $controller, createController;

  describe('Testing dynamicController', function(){
    let myEvent;
    beforeEach(inject(function($injector){
      $httpBackend = $injector.get('$httpBackend');
      $controller = $injector.get('$controller');
      $http = $injector.get('$http');
      $scope = {};
    }));

    it('test adding likes', () => {
      const controller = $controller('dynamicController', { $scope, $http });
      myEvent = {event: {path: [0,
        {firstElementChild: {setAttribute: function(a, b) {return 'good';}},
        lastElementChild: {innerHTML: ' Like !'}},
        {firstElementChild: {style: {backgroundColor : 'gold'}},
        lastElementChild: {firstElementChild: {innerHTML: 1}}},
        3,
        {firstElementChild: '1'},
      ]}};
      $httpBackend.when('POST', '/addLike' ).respond(200, {
        status: 'success',
      });
      $httpBackend.expect('POST', '/addLike');
      $scope.addLike(myEvent);
      $httpBackend.flush();
      expect(myEvent.event.path[1].firstElementChild.setAttribute('class', 'fas fa-thumbs-up')).toBe('good');
      expect(myEvent.event.path[1].lastElementChild.innerHTML).toBe(' Liked');
      expect(myEvent.event.path[2].firstElementChild.style.backgroundColor).toBe('gold');
      expect(myEvent.event.path[2].lastElementChild.firstElementChild.innerHTML).toBe(2);
    });

    it('test cancelling likes', () => {
        const controller = $controller('dynamicController', { $scope, $http });
        myEvent = {event: {path: [0,
          {firstElementChild: {setAttribute: function(a, b) {return 'good';}},
          lastElementChild: {innerHTML: ' Liked'}},
          {firstElementChild: {style: {backgroundColor : 'gold'}},
          lastElementChild: {firstElementChild: {innerHTML: 1}}},
          3,
          {firstElementChild: '1'},
        ]}};
        $httpBackend.when('PUT', '/cancelLike' ).respond(200, {
          status: 'success',
        });
        $httpBackend.expect('PUT', '/cancelLike');
        $scope.addLike(myEvent);
        $httpBackend.flush();
        expect(myEvent.event.path[1].firstElementChild.setAttribute('class', 'fas fa-thumbs-up')).toBe('good');
        expect(myEvent.event.path[1].lastElementChild.innerHTML).toBe(' Like !');
        expect(myEvent.event.path[2].firstElementChild.style.backgroundColor).toBe('');
        expect(myEvent.event.path[2].lastElementChild.firstElementChild.innerHTML).toBe(0);
      });

    it('test sending id functions 1', () => {
      const controller = $controller('dynamicController', { $scope, $http });
      myEvent = {event: {path: [0,
        {firstElementChild: {setAttribute: function(a, b) {return 'good';}},
        lastElementChild: {innerHTML: ' Like !'}},
        {firstElementChild: {style: {backgroundColor : 'gold'}},
        lastElementChild: {firstElementChild: {innerHTML: 1}}},
        3,
        {firstElementChild: {innerHTML: '1'}},],
        currentTarget: {getAttribute: function(a){
            return '#new-comment';}}}};
      $scope.sendPostID(myEvent);
      expect(document.getElementById('chat-post-id').getAttribute('innerHTML')).toBe('1')
    });

    it('test sending id functions 2', () => {
        const controller = $controller('dynamicController', { $scope, $http });
        myEvent = {event: {path: [0,
          {firstElementChild: {setAttribute: function(a, b) {return 'good';}},
          lastElementChild: {innerHTML: ' Like !'}},
          {firstElementChild: {style: {backgroundColor : 'gold'},
                innerHTML: '2'},
          lastElementChild: {firstElementChild: {innerHTML: 1}}},
          3,
          4,],
          currentTarget: {getAttribute: function(a){
              return '#delete-post';}}}};
        $scope.sendPostID(myEvent);
        expect(document.getElementById('delete-post-id').getAttribute('innerHTML')).toBe('2')
      });

      it('test sending id functions 1', () => {
        const controller = $controller('dynamicController', { $scope, $http });
        myEvent = {event: {path: [0,
            {firstElementChild: {setAttribute: function(a, b) {return 'good';}, innerHTML: '3'},
            lastElementChild: {innerHTML: ' Like !'}},
            {firstElementChild: {style: {backgroundColor : 'gold'}},
            lastElementChild: {firstElementChild: {innerHTML: 1}}},
            3,
            4,],
          currentTarget: {getAttribute: function(a){
              return '#delete-comment';}}}};
        $scope.sendPostID(myEvent);
        expect(document.getElementById('delete-comment-id').getAttribute('innerHTML')).toBe('3')
      });

      it('test comment adding successfully', () => {
        const controller = $controller('dynamicController', { $scope, $http });
        myEvent = {event: {path: [0,
            {firstElementChild: {setAttribute: function(a, b) {return 'good';}},
            lastElementChild: {innerHTML: ' Like !'}},
            {firstElementChild: {style: {backgroundColor : 'gold'}, innerHTML: '2'},
                children: [0,1,{firstElementChild: {nextElementSibling:{value: 'hi'}}}],
                lastElementChild: {firstElementChild: {innerHTML: 1}}},
            3,
            4,]}};
        $httpBackend.when('POST', '/addComment' ).respond(200, {
          status: 'success',
        });
        $httpBackend.expect('POST', '/addComment');
        const stub1 = sinon.stub(document.getElementById('close-comment'),'click').callsFake(() => {return 'closed';})
        const stub2 = sinon.stub(window,'alert').callsFake(() => {return "Comment successfully added!";})
        $scope.addComment(myEvent)
        expect(document.getElementById('close-comment').click()).toBe('closed');
        expect(window.alert()).toBe('Comment successfully added!');
        stub1.restore();
        stub2.restore();
        $httpBackend.flush();
      });

      it('test comment adding error', () => {
        const controller = $controller('dynamicController', { $scope, $http });
        myEvent = {event: {path: [0,
          {firstElementChild: {setAttribute: function(a, b) {return 'good';}},
          lastElementChild: {innerHTML: ' Like !'}},
          {firstElementChild: {style: {backgroundColor : 'gold'}, innerHTML: '2'},
              children: [0,1,{firstElementChild: {nextElementSibling:{value: 'hi'}}}],
              lastElementChild: {firstElementChild: {innerHTML: 1}}},
          3,
          4,]}};
        $httpBackend.when('POST', '/addComment' ).respond(500, {
          info: 'Commment tagging insert error',
        });
        $httpBackend.expect('POST', '/addComment');
        const stub1 = sinon.stub(document.getElementById('close-comment'),'click').callsFake(() => {return 'closed';})
        $scope.addComment(myEvent)
        expect(document.getElementById('close-comment').click()).toBe('closed');
        stub1.restore();
        $httpBackend.flush();
      });

      it('test deleting post functions',() => {
        const controller = $controller('dynamicController', { $scope, $http });
        document.getElementById('delete-post-id').setAttribute('innerHTML','1');
        $httpBackend.when('PUT', '/deletePost' ).respond(200, {
            status: 'success',
          });
        $httpBackend.expect('PUT', '/deletePost');
        const stub1 = sinon.stub(document.getElementById('close-del-post'),'click').callsFake(() => {return 'closed';})
        const stub2 = sinon.stub(window,'alert').callsFake(function fakeFn(){return "Comment deleted!";})
        $scope.deletePost();
        expect(window.alert()).toBe('Comment deleted!');
        expect(document.getElementById('close-del-post').click()).toBe('closed');
        $httpBackend.flush();
        stub1.restore();
        stub2.restore();
      });

      it('test deleting post errors',() => {
        const controller = $controller('dynamicController', { $scope, $http });
        document.getElementById('delete-post-id').setAttribute('innerHTML','1');
        $httpBackend.when('PUT', '/deletePost' ).respond(500, {
            info: 'Database error:',
          });
        $httpBackend.expect('PUT', '/deletePost');
        const stub1 = sinon.stub(document.getElementById('close-del-post'),'click').callsFake(() => {return 'closed';})
        $scope.deletePost();
        expect(document.getElementById('close-del-post').click()).toBe('closed');
        $httpBackend.flush();
        stub1.restore();
      });


      it('test deleting comment functions',() => {
        const controller = $controller('dynamicController', { $scope, $http });
        document.getElementById('delete-comment-id').setAttribute('innerHTML','1');
        $httpBackend.when('PUT', '/deleteComment' ).respond(200, {
            status: 'success',
          });
        $httpBackend.expect('PUT', '/deleteComment');
        const stub1 = sinon.stub(document.getElementById('close-del-comment'),'click').callsFake(() => {return 'closed';})
        const stub2 = sinon.stub(window,'alert').callsFake(() => {return "Comment deleted!";})
        $scope.deleteComment();
        expect(window.alert()).toBe('Comment deleted!');
        expect(document.getElementById('close-del-comment').click()).toBe('closed');
        $httpBackend.flush();
        stub1.restore();
        stub2.restore();
      });

      it('test deleting comment errors',() => {
        const controller = $controller('dynamicController', { $scope, $http });
        document.getElementById('delete-comment-id').setAttribute('innerHTML','1');
        $httpBackend.when('PUT', '/deleteComment' ).respond(500, {
            info: 'Database error:',
          });
        $httpBackend.expect('PUT', '/deleteComment');
        const stub1 = sinon.stub(document.getElementById('close-del-comment'),'click').callsFake(() => {return 'closed';})
        $scope.deleteComment();
        expect(document.getElementById('close-del-comment').click()).toBe('closed');
        $httpBackend.flush();
        stub1.restore();
      });

      it('test logging out', () => {
        const controller = $controller('dynamicController', { $scope, $http });
        $httpBackend.when('GET', '/logout' ).respond(200, {
            status: 'logout',
          });
        $httpBackend.expect('GET', '/logout');
        $scope.logout();
        expect(window.location.href).toBe('http://localhost/')
        $httpBackend.flush();
      });

    afterEach(function(){
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });
});