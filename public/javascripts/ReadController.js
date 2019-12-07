// Continue using the previous dependencies
// [] after 'Myapp' should be omitted
var app = angular.module('MyApp');// eslint-disable-line

app.controller('readController', function($scope, $http){// eslint-disable-line
  const hrefList = window.location.href.split('/');
  // inject likes, comments, post contents, icons
  $http({
    url: '/injectAll',
    method: 'GET',
    headers: {
      token: sessionStorage.token,
    },
    params: {
      username: hrefList[hrefList.length - 1],
    },
  }).then(
    (res) => {
      if (res.data.status === 'success') {
        const result1 = res.data.result;
        const icon1 = res.data.icon;
        const like1 = res.data.like;
        const count1 = res.data.count;
        const comment1 = res.data.comment;
        const tags1 = res.data.tags;
        const likeIds = [];
        for (let index = 0; index < Object.keys(like1).length; index += 1) {
          likeIds.push(like1[index].post_id);
        }
        for (let index1 = 0; index1 < Object.keys(result1).length; index1 += 1) {
          for (let index2 = 0; index2 < Object.keys(icon1).length; index2 += 1) {
            if (icon1[index2].username === result1[index1].username) {
              result1[index1].icon1 = icon1[index2].icon;
              break;
            }
          }

          // like_btn assignment
          if (likeIds.includes(result1[index1].post_id)) {
            result1[index1].liked = ' Liked';
            result1[index1].bkg_color = 'gold';
            result1[index1].thumb = 'fas fa-thumbs-up';
          } else {
            result1[index1].liked = ' Like !';
            result1[index1].bkg_color = '';
            result1[index1].thumb = 'far fa-thumbs-up';
          }

          // count assignment
          result1[index1].likeCount = 0;
          for (let index3 = 0; index3 < Object.keys(count1).length; index3 += 1) {
            if (count1[index3].post_id === result1[index1].post_id) {
              result1[index1].like_count = count1[index3].num;
              break;
            }
          }

          // comment assignment
          result1[index1].commentList = [];
          for (let index4 = 0; index4 < Object.keys(comment1).length; index4 += 1) {
            if (comment1[index4].post_id === result1[index1].post_id) {
              const temp = comment1[index4].cmt_id.split('by')[0];
              comment1[index4].time = temp.substring(10, temp.length);
              result1[index1].commentList.push(comment1[index4]);
            }
          }

          // tags assignment
          let tempTagged = false;
          for (let index5 = 0; index5 < Object.keys(tags1).length; index5 += 1) {
            if ((result1[index1].post_id === tags1[index5].post_id)
            && (hrefList[hrefList.length - 1] === tags1[index5].tagged_user)) {
              tempTagged = true;
              break;
            }
          }
          if (tempTagged) {
            result1[index1].tagged = 'You are tagged!';
          } else {
            result1[index1].tagged = '';
          }
        }

        const sortedContent = result1.sort((a, b) => {
          const x = a.post_id.toLowerCase();
          const y = b.post_id.toLowerCase();
          if (x < y) { return 1; }
          if (x > y) { return -1; }
          return 0;
        });
        $scope.injectAll = sortedContent;
      }
    }, (err) => {
      console.log('Mainpage content loading error: ', err);
    },
  );
  $scope.addIcon = () => {
    $http({
      url: '/addIcon',
      method: 'GET',
      headers: {
        token: sessionStorage.token,
      },
      params: {
        user: hrefList[hrefList.length - 1],
      },
    }).then(
      (res) => {
        if (res.data.status === 'success') {
          const userColumn = document.getElementById('grid-username');
          userColumn.innerHTML = hrefList[hrefList.length - 1];
          const userIcon = document.getElementById('grid-user-photo');
          const iconValue = JSON.parse(res.data.result);
          userIcon.src = iconValue[0].icon;
        }
      }, (err) => {
        console.log('Icon loading error: ', err.data.info);
      },
    );
  };

  $http({
    url: '/following',
    method: 'GET',
    headers: {
      token: sessionStorage.token,
    },
    params: {
      username: hrefList[hrefList.length - 1],
    },
  }).then(
    (res) => {
      console.log(res.data);
      $scope.following = res.data;
    }, (err) => {
      console.log('Find Following ERROR: ', err.data.info);
    },
  );

  $http({
    url: '/follower',
    method: 'GET',
    headers: {
      token: sessionStorage.token,
    },
    params: {
      username: hrefList[hrefList.length - 1],
    },
  }).then(
    (res) => {
      console.log(res.data);
      $scope.follower = res.data;
    }, (err) => {
      console.log('Find Follower ERROR: ', err.data.info);
    },
  );

  $scope.goProfile1 = (followGuest) => {
    const username = hrefList[hrefList.length - 1];
    $http({
      url: `/goFollowing/${followGuest}`,
      method: 'GET',
      params: {
        username,
        followGuest,
      },
    }).then(
      (res) => {
        if (res.data.status === 'success') {
          window.location.href.assign(`../GuestProfile/${followGuest}/${username}`);
        } else if (res.data.status === 'myself') {
          window.location.href.assign(`../Profile/${username}`);
        }
      }, (err) => {
        console.log('Find profile ERROR: ', err.data.info);
      },
    );
  };

  $scope.goProfile2 = (followHost) => {
    const username = hrefList[hrefList.length - 1];
    $http({
      url: `/goFollowing/${followHost}`,
      method: 'GET',
      headers: {
        token: sessionStorage.token,
      },
      params: {
        username,
        followHost,
      },
    }).then(
      (res) => {
        if (res.data.status === 'success') {
          window.location.href.assign(`../GuestProfile/${followHost}/${username}`);
        } else if (res.data.status === 'myself') {
          window.location.href.assign(`../Profile/${username}`);
        }
      }, (err) => {
        console.log('Find profile ERROR: ', err.data.info);
      },
    );
  };

  $http({
    url: '/suggestFriend',
    method: 'GET',
    headers: {
      token: sessionStorage.token,
    },
    params: {
      username: hrefList[hrefList.length - 1],
    },
  }).then(
    (res) => {
      $scope.suggest = res.data;
    }, (err) => {
      console.log('Mainpage content loading error: ', err.data.info);
    },
  );

  $scope.followUser = ($event) => {
    const status = $event.event.currentTarget.innerHTML;
    const button = $event.event.currentTarget;
    console.log(status);
    $http({
      url: '/followSuggest',
      method: 'POST',
      headers: {
        token: sessionStorage.token,
      },
      data: {
        followHost: hrefList[hrefList.length - 1],
        followGuest: $event.event.path[1].children[1].innerHTML,
        status,
      },
    }).then(
      (res) => {
        if (res.data.status === 'followed') {
          alert('Followed:)');
          button.innerHTML = 'Unfollow';
        } else if (res.data.status === 'unfollowed') {
          alert('Unfollowed:(');
          button.innerHTML = 'Follow';
        }
      }, (err) => {
        console.log('Follow error: ', err.data.info);
      },
    );
  };
});
