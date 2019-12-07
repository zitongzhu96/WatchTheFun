var app = angular.module('MyApp',[]); // eslint-disable-line

app.controller('profileController', function($scope, $http){// eslint-disable-line
  const hrefList = window.location.href.split('/');
  $http({
    url: '/injectMain',
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
        const like1 = res.data.like;
        const count1 = res.data.count;
        const comment1 = res.data.comment;
        const likeIds = [];
        for (let index = 0; index < Object.keys(like1).length; index += 1) {
          likeIds.push(like1[index].post_id);
        }
        for (let index1 = 0; index1 < Object.keys(result1).length; index1 += 1) {
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

          result1[index1].like_count = 0;
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
              break;
            }
          }
        }

        const sortedContent = result1.sort((a, b) => {
          const x = a.post_id.toLowerCase();
          const y = b.post_id.toLowerCase();
          if (x < y) { return 1; }
          if (x > y) { return -1; }
          return 0;
        });
        $scope.injectMain = sortedContent;
      }
    }, (err) => {
      console.log('Mainpage content loading error: ', err.data.info);
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
    url: '/countPost',
    method: 'GET',
    headers: {
      token: sessionStorage.token,
    },
    params: {
      username: hrefList[hrefList.length - 1],
    },
  }).then(
    (res) => {
    // console.log(res.data);
      document.getElementById('numPosts').innerHTML = res.data[0].countPost;
    }, (err) => {
      console.log('Follow error: ', err.data.info);
    },
  );

  $http({
    url: '/countFollower',
    method: 'GET',
    headers: {
      token: sessionStorage.token,
    },
    params: {
      username: hrefList[hrefList.length - 1],
    },
  }).then(
    (res) => {
    // console.log(res.data);
      document.getElementById('numFollowers').innerHTML = res.data[0].countFollower;
    }, (err) => {
      console.log('Follow error: ', err.data.info);
    },
  );

  $http({
    url: '/countFollowing',
    method: 'GET',
    headers: {
      token: sessionStorage.token,
    },
    params: {
      username: hrefList[hrefList.length - 1],
    },
  }).then(
    (res) => {
    // console.log(res.data);
      document.getElementById('numFollowings').innerHTML = res.data[0].countFollowing;
    }, (err) => {
      console.log('Follow error: ', err.data.info);
    },
  );
});
