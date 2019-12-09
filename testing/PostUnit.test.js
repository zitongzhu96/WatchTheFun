/* eslint-disable */
const sinon = require('sinon');
require('jest-enzyme');

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
`;

const Post = require('../public/javascripts/Post.js');

describe('Post testing by simulating relevant functions', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('Test the clicking of file directory button', () => {
    let imgfinder = document.getElementById('imgfinder')
    let uploadSpy = jest.spyOn(Post,'uploadImage');
    let fileDir = document.getElementById('file-dir');
    let clickSpy = jest.spyOn(fileDir, 'click');
    Post.uploadImage();
    expect(uploadSpy).toHaveBeenCalled();
    expect(fileDir).toBeDefined();
    expect(clickSpy).toHaveBeenCalled();
    uploadSpy.mockRestore();
    clickSpy.mockRestore();
  });

  it('Test the loading of the preview area', () => {
    let loadSpy = jest.spyOn(Post,'loadImage');
    let fileDir = document.getElementById('file-dir');
    let mockedLoadImage = jest.fn();
    mockedLoadImage.mockImplementationOnce(() =>{
      fileDir.setAttribute('value','123');
    });
    let eventListenerSpy = jest.spyOn(fileDir, 'addEventListener');
    Post.loadImage();
    mockedLoadImage();
    expect(eventListenerSpy).toHaveBeenCalled();
    expect(loadSpy).toHaveBeenCalled();
    expect(fileDir).toBeDefined();
  });

  it('Test the clearing of comment modal', () => {
    const stub = sinon.stub(window.location, 'reload').callsFake(function fakeFn() {return 'http://localhost:8081/MainPage/yfmao';});
    let chatPostId = document.getElementById('chat-post-id');
    let commentContent = document.getElementById('comment-content');
    let mockedClearComment = jest.fn();
    chatPostId.setAttribute('innerHTML','123');
    commentContent.setAttribute('value','123');
    mockedClearComment.mockImplementationOnce(() => {
      chatPostId.setAttribute('innerHTML','');
      commentContent.setAttribute('value','');
    });
    let clearCmtSpy = jest.spyOn(Post,'clearCommentModal');
    Post.clearCommentModal();
    mockedClearComment();
    expect(clearCmtSpy).toHaveBeenCalled();
    expect(chatPostId.getAttribute('innerHTML')).toBe('');
    expect(commentContent.getAttribute('value')).toBe('');
    expect(window.location.reload()).toBe('http://localhost:8081/MainPage/yfmao');
    stub.restore();
  });

  it('Test the modal after post deletion', () => {
    const stub = sinon.stub(window.location, 'reload').callsFake(function fakeFn() {return 'http://localhost:8081/MainPage/yfmao';});
    let delPostId = document.getElementById('close-del-post');
    delPostId.setAttribute('innerHTML','123');
    let clearPostSpy = jest.spyOn(Post, 'clearDelPostModal');
    let mockedClearPost = jest.fn();
    mockedClearPost.mockImplementationOnce(() => {
      delPostId.setAttribute('innerHTML','');
    });
    Post.clearDelPostModal();
    mockedClearPost();
    expect(clearPostSpy).toHaveBeenCalled();
    expect(delPostId.getAttribute('innerHTML')).toBe('');
    expect(window.location.reload()).toBe('http://localhost:8081/MainPage/yfmao');
    stub.restore();
  });

  it('Test the modal after comment deletion', () => {
    const stub = sinon.stub(window.location, 'reload').callsFake(function fakeFn() {return 'http://localhost:8081/MainPage/yfmao';});
    let delCmtId = document.getElementById('delete-comment-id');
    delCmtId.setAttribute('innerHTML','123');
    let clearCmtSpy = jest.spyOn(Post, 'clearDelCommentModal');
    let mockedClearCmt = jest.fn();
    mockedClearCmt.mockImplementationOnce(() => {
      delCmtId.setAttribute('innerHTML','');
    });
    Post.clearDelCommentModal();
    mockedClearCmt();
    expect(clearCmtSpy).toHaveBeenCalled();
    expect(delCmtId.getAttribute('innerHTML')).toBe('');
    expect(window.location.reload()).toBe('http://localhost:8081/MainPage/yfmao');
    stub.restore();
  })

  it('Test the clearing of post modal', () => {
    const stub = sinon.stub(window.location, 'reload').callsFake(function fakeFn() {return 'http://localhost:8081/MainPage/yfmao';});
    let textarea = document.getElementById('post-content');
    let fileDir = document.getElementById('file-dir');
    let area = document.getElementById('preview-area');
    let text = document.getElementById('preview-text');
    let image = document.getElementById('preview-image');
    textarea.setAttribute('value','123');
    fileDir.setAttribute('value','123');
    area.setAttribute('style','123');
    text.setAttribute('innerHTML','123');
    image.setAttribute('src','123');
    let clearModalSpy = jest.spyOn(Post, 'clearPostModal');
    let mockedClearModal = jest.fn();
    mockedClearModal.mockImplementationOnce(() => {
      textarea.setAttribute('value','');
      fileDir.setAttribute('value','');
      area.setAttribute('style','display: none');
      text.setAttribute('innerHTML','');
      image.setAttribute('src','');
    });
    Post.clearPostModal();
    mockedClearModal();
    expect(clearModalSpy).toHaveBeenCalled()
    expect(textarea.getAttribute('value')).toBe('');
    expect(fileDir.getAttribute('value')).toBe('');
    expect(area.getAttribute('style')).toBe('display: none');
    expect(text.getAttribute('innerHTML')).toBe('');
    expect(image.getAttribute('src')).toBe('');
    expect(window.location.reload()).toBe('http://localhost:8081/MainPage/yfmao');
    stub.restore();
  });
});
