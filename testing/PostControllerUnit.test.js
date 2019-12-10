/* eslint-disable */
document.body.innerHTML = `
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
                        </div>
                    </div>
                    <div class="preview-panel">
                        <div class="preview-title">
                            Preview of new post:
                        </div>
                        <div id="preview-area">
                            <img id="preview-image"/>
                            <p id="preview-text" ng-bind-html="outtxt  | emoji"></p>
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
`



require('../node_modules/angular/angular.min.js');
require('../node_modules/angular-mocks/angular-mocks.js');
const sinon = require('sinon');
require('../public/javascripts/PostController.js');

describe('Post modal page unit testing', function(){
  beforeEach(
    angular.mock.module('MyApp'),
  );

  var $httpBackend, $rootScope, $controller, createController;

  describe('Testing postController', function(){
    beforeEach(inject(function($injector){
      $httpBackend = $injector.get('$httpBackend');
      $controller = $injector.get('$controller');
      $http = $injector.get('$http');
      $scope = {};
    }));

    it('test setting as public', () => {
      const controller = $controller('postController', { $http, $scope });
      const privacy = document.getElementById('set-private');
      privacy.setAttribute('innerHTML', 'Set As Private');
      $scope.setPrivate();
      expect(privacy.getAttribute('innerHTML')).toBe('Set As Public');
    });

    it('test setting as private', () => {
      const controller = $controller('postController', { $http, $scope });
      const privacy = document.getElementById('set-private');
      privacy.setAttribute('innerHTML', 'Set As Public');
      $scope.setPrivate();
      expect(privacy.getAttribute('innerHTML')).toBe('Set As Private');
    });

    it('test post generation process', () => {
      const controller = $controller('postController', { $http, $scope });
      document.getElementById('set-private').setAttribute('innerHTML','Set As Private');
      document.getElementById('post-content').setAttribute('value','@yfmao');
      document.getElementById('preview-image').setAttribute('src','123');
      $httpBackend.when('POST', '/newPost' ).respond(200, {
        status: 'success',
      });
      $httpBackend.expect('POST', '/newPost');
      const closePost = document.getElementById('close-post');
      const stub = sinon.stub(closePost,'click').callsFake(() => 1)
      $scope.addPost();
      $httpBackend.flush();
      expect(document.getElementById('close-post').click()).toBe(1);
      stub.restore();
    });

    it('test post generatinon error', () => {
        const controller = $controller('postController', { $http, $scope });
        document.getElementById('set-private').setAttribute('innerHTML','Set As Private');
        document.getElementById('post-content').setAttribute('value','@yfmao');
        document.getElementById('preview-image').setAttribute('src','123');
        $httpBackend.when('POST', '/newPost' ).respond(500, {
          status: 'success',
          info: 'Database insert tag error'
        });
        $httpBackend.expect('POST', '/newPost');
        const closePost = document.getElementById('close-post');
        const stub = sinon.stub(closePost,'click').callsFake(() => 1)
        $scope.addPost();
        $httpBackend.flush();
        expect(document.getElementById('close-post').click()).toBe(1);
        stub.restore();
      });

    afterEach(function(){
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });
});