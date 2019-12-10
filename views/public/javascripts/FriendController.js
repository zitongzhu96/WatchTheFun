/* eslint-disable max-len */
var app = angular.module('MyApp',[]);// eslint-disable-line

app.controller('searchController', function($scope, $http) {// eslint-disable-line
  $scope.searchUser = () => {
    const hrefList = window.location.href.split('/');
    const username = hrefList[hrefList.length - 1];
    $http({
      url: '/searchUser',
      method: 'GET',
      headers: {
        token: sessionStorage.token,
      },
      params: {
        searchname: $scope.searchname,
        username: hrefList[hrefList.length - 1],
      },
    }).then(
      (res) => {
        if (res.data.status === 'success') {
          window.location.assign(`../GuestProfile/${res.data.user}/${username}`);
        } else if (res.data.status === 'myself') {
          window.location.assign(`../Profile/${username}`);
        }
      }, (err) => {
        if (err.data.status === 'unexist') {
          alert('User Not Exists!');
        }
        console.log(`Error: ${err.data.info}`);
      },
    );
  };
});

app.controller('friendlistController', function($scope, $http) {// eslint-disable-line
  const hrefList = window.location.href.split('/');
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

  $scope.goProfile = (followGuest) => {
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
          window.location.assign(`../GuestProfile/${followGuest}/${username}`);
        } else if (res.data.status === 'myself') {
          window.location.assign(`../Profile/${username}`);
        }
      }, (err) => {
        console.log('Find profile ERROR: ', err.data.info);
      },
    );
  };
});

app.controller('suggestController', function($scope, $http) {// eslint-disable-line
  const hrefList = window.location.href.split('/');
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
      console.log('Suggested content loading error: ', err.data.info);
    },
  );

  $scope.followUser = function(myEvent) {// eslint-disable-line
    const status = myEvent.event.currentTarget.innerHTML;
    const button = myEvent.event.currentTarget;
    $http({
      url: '/followSuggest',
      method: 'POST',
      headers: {
        token: sessionStorage.token,
      },
      data: {
        followHost: hrefList[hrefList.length - 1],
        followGuest: myEvent.event.path[2].children[0].children[0].children[0].children[1].innerHTML,
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
