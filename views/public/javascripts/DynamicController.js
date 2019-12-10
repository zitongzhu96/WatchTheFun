/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
// This file includes controller on likes, comments
try {
  app = angular.module('MyApp');// eslint-disable-line
} catch (error) {
  app = angular.module('MyApp', []);// eslint-disable-line
}

app.controller('dynamicController', function($scope, $http){// eslint-disable-line
  const hrefList = window.location.href.split('/');

  $scope.addLike = (myEvent) => {
    const postId = myEvent.event.path[4].firstElementChild.innerHTML;
    const likeStatus = myEvent.event.path[1].lastElementChild.innerHTML;
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
            myEvent.event.path[1].firstElementChild.setAttribute('class', 'fas fa-thumbs-up');
            myEvent.event.path[1].lastElementChild.innerHTML = ' Liked';
            myEvent.event.path[2].firstElementChild.style.backgroundColor = 'gold';
            // eslint-disable-next-line max-len
            myEvent.event.path[2].lastElementChild.firstElementChild.innerHTML = Number(myEvent.event.path[2].lastElementChild.firstElementChild.innerHTML) + 1;
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
            myEvent.event.path[1].firstElementChild.setAttribute('class', 'far fa-thumbs-up');
            myEvent.event.path[1].lastElementChild.innerHTML = ' Like !';
            myEvent.event.path[2].firstElementChild.style.backgroundColor = '';
            myEvent.event.path[2].lastElementChild.firstElementChild.innerHTML = Number(myEvent.event.path[2].lastElementChild.firstElementChild.innerHTML) - 1;
          }
        },
        (err) => {
          console.log('cancel like error: ', err.data.info);
        },
      );
    }
  };

  $scope.sendPostID = (myEvent) => {
    const currTarget = myEvent.event.currentTarget;
    if (currTarget.getAttribute('data-target') === '#new-comment') {
      const postId = myEvent.event.path[4].firstElementChild.innerHTML;
      document.getElementById('chat-post-id').setAttribute('innerHTML', postId);
    } else if (currTarget.getAttribute('data-target') === '#delete-post') {
      const postId = myEvent.event.path[2].firstElementChild.innerHTML;
      document.getElementById('delete-post-id').setAttribute('innerHTML', postId);
    } else if (currTarget.getAttribute('data-target') === '#delete-comment') {
      const commentId = myEvent.event.path[1].firstElementChild.innerHTML;
      document.getElementById('delete-comment-id').setAttribute('innerHTML', commentId);
    } else {
      console.log('Send post ID error');
    }
  };

  $scope.addComment = (myEvent) => {
    const postId = myEvent.event.path[2].firstElementChild.innerHTML;
    const text = myEvent.event.path[2].children[2].firstElementChild.value;
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
    const cmtId = `comment on ${dt} by ${hrefList[hrefList.length - 1]} of ${postId}`;

    const tempTags = text.split('@');
    const tags = [];
    if (tempTags.length > 0) {
      for (let index = 1; index < tempTags.length; index += 1) {
        const tempUsername = tempTags[index].replace(/\W.*$/, '').replace(/ .*$/, '');
        if (tags.includes(tempUsername) === false) {
          tags.push([tempUsername, cmtId]);
        }
      }
    }
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
        tagged: tags,
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
        post_id: document.getElementById('delete-post-id').getAttribute('innerHTML'),
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
        comment_id: document.getElementById('delete-comment-id').getAttribute('innerHTML'),
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
          window.location.assign('../');
        }
      }, (err) => {
        console.log(`logout error: ${err.data.info}`);
      },
    );
  };
});
