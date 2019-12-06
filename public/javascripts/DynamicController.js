/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
// This file includes controller on likes, comments
var app = angular.module('MyApp'); // eslint-disable-line

app.controller('dynamicController', ($scope, $http) => {
  const hrefList = window.location.href.split('/');

  $scope.addLike = ($event) => {
    const postId = $event.event.path[4].firstElementChild.innerHTML;
    const likeStatus = $event.event.path[1].lastElementChild.innerHTML;
    if (likeStatus === ' Like !') {
      // thenable functions, promises
      $http({
        url: '/addLike',
        method: 'POST',
        headers: {
          token: sessionStorage.token,
        },
        data: {
          username: hrefList[hrefList.length - 1],
          post_id: postId,
          status: likeStatus,
        },
      }).then(
        (res) => {
          if (res.data.status === 'success') {
            $event.event.path[1].firstElementChild.setAttribute('class', 'fas fa-thumbs-up');
            $event.event.path[1].lastElementChild.innerHTML = ' Liked';
            $event.event.path[2].firstElementChild.style.backgroundColor = 'gold';
            // eslint-disable-next-line max-len
            $event.event.path[2].lastElementChild.firstElementChild.innerHTML = Number($event.event.path[2].lastElementChild.firstElementChild.innerHTML) + 1;
          }
        },
        (err) => {
          console.log('Add like error: ', err.data.info);
        },
      );
    } else if (likeStatus === ' Liked') {
      $http({
        url: '/cancelLike',
        method: 'PUT',
        headers: {
          token: sessionStorage.token,
        },
        data: {
          username: hrefList[hrefList.length - 1],
          post_id: postId,
          status: likeStatus,
        },
      }).then(
        (res) => {
          if (res.data.status === 'success') {
            $event.event.path[1].firstElementChild.setAttribute('class', 'far fa-thumbs-up');
            $event.event.path[1].lastElementChild.innerHTML = ' Like !';
            $event.event.path[2].firstElementChild.style.backgroundColor = '';
            $event.event.path[2].lastElementChild.firstElementChild.innerHTML = Number($event.event.path[2].lastElementChild.firstElementChild.innerHTML) - 1;
          }
        },
        (err) => {
          console.log('cancel like error: ', err.data.info);
        },
      );
    }
  };

  $scope.sendPostID = ($event) => {
    const currTarget = $event.event.currentTarget;
    if (currTarget.getAttribute('data-target') === '#new-comment') {
      const postId = $event.event.path[4].firstElementChild.innerHTML;
      document.getElementById('chat-post-id').innerHTML = postId;
    } else if (currTarget.getAttribute('data-target') === '#delete-post') {
      const postId = $event.event.path[2].firstElementChild.innerHTML;
      document.getElementById('delete-post-id').innerHTML = postId;
    } else if (currTarget.getAttribute('data-target') === '#delete-comment') {
      const commentId = $event.event.path[1].firstElementChild.innerHTML;
      document.getElementById('delete-comment-id').innerHTML = commentId;
    } else {
      console.log('Send post ID error');
    }
  };

  $scope.addComment = ($event) => {
    const postId = $event.event.path[2].firstElementChild.innerHTML;
    const text = $event.event.path[2].children[2].firstElementChild.value;
    const now = new Date();
    const year = now.getFullYear();
    let month = now.getMonth() + 1;
    if (month < 10) {
      month = `0${String(month)}`;
    }
    let date = now.getDate();
    if (date < 10) {
      date = `0${String(date)}`;
    }
    let hour = now.getHours();
    if (hour < 10) {
      hour = `0${String(hour)}`;
    }
    let minute = now.getMinutes();
    if (minute < 10) {
      minute = `0${String(minute)}`;
    }
    const day = now.getDay();
    const daymap = new Map();
    daymap.set(1, 'Monday');
    daymap.set(2, 'Tuesday');
    daymap.set(3, 'Wednesday');
    daymap.set(4, 'Thursday');
    daymap.set(5, 'Friday');
    daymap.set(6, 'Saturday');
    daymap.set(0, 'Sunday');
    const dt = `${year}.${month}.${date}, ${hour}:${minute}, ${daymap.get(day)}`;
    const cmtId = `comment on ${dt} by hrefList[hrefList.length-1] of ${postId}`;
    $http({
      url: '/addComment',
      method: 'POST',
      headers: {
        token: sessionStorage.token,
      },
      data: {
        post_id: postId,
        username: hrefList[hrefList.length - 1],
        text,
        cmt_id: cmtId,
      },
    }).then(
      (res) => {
        if (res.data.status === 'success') {
          alert('Comment successfully added!');
          document.getElementById('close-comment').click();
        }
      },
      (err) => {
        console.log(`comment insertion error :${err.data.info}`);
        document.getElementById('close-comment').click();
      },
    );
  };

  // DELETE moethod completely ignores req.body, therefore we use PUT instead
  $scope.deletePost = () => {
    $http({
      url: '/deletePost',
      method: 'PUT',
      headers: {
        token: sessionStorage.token,
      },
      data: {
        post_id: document.getElementById('delete-post-id').innerHTML,
        username: hrefList[hrefList.length - 1],
      },
    }).then(
      (res) => {
        if (res.data.status === 'success') {
          alert('Post deleted!');
          document.getElementById('close-del-post').click();
        }
      }, (err) => {
        console.log(`post deletion error :${err.data.info}`);
        document.getElementById('close-del-post').click();
      },
    );
  };

  $scope.deleteComment = () => {
    $http({
      url: '/deleteComment',
      method: 'PUT',
      headers: {
        token: sessionStorage.token,
      },
      data: {
        comment_id: document.getElementById('delete-comment-id').innerHTML,
        username: hrefList[hrefList.length - 1],
      },
    }).then(
      (res) => {
        if (res.data.status === 'success') {
          alert('Comment deleted!');
          document.getElementById('close-del-comment').click();
        }
      }, (err) => {
        console.log(`post deletion error :${err.data.info}`);
        document.getElementById('close-del-comment').click();
      },
    );
  };

  $scope.logout = () => {
    $http({
      url: '/logout',
      method: 'GET',
      headers: {
        token: sessionStorage.token,
      },
    }).then(
      (res) => {
        if (res.data.status === 'logout') {
          sessionStorage.clear();
          window.location.href = '../';
        }
      }, (err) => {
        console.log(`logout error: ${err.data.info}`);
      },
    );
  };
});
