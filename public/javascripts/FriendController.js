var app = angular.module('MyApp',[]);

app.controller('searchController', function($scope, $http) { 
    $scope.searchUser = function() {
        var href_list=window.location.href.split("/");
        var username=href_list[href_list.length-1];
        $http({
            url: '/searchUser',
            method: "POST",
            headers: {
              'token': sessionStorage.token
            },
            data: {
            'searchname': $scope.searchname,
            'username': href_list[href_list.length-1]
        }
      }).then(
      res => {      
          if (res.data.status=='success'){
        window.location.href = "./GuestProfile/"+res.data.user+"/"+username;
      }else if (res.data.status=="myself"){
        window.location.href = "./Profile/"+username;
        }
      },err => {
        if (err.data.status=='unexist'){
          alert('User Not Exists!');
        }
        console.log("Error: "+err.data.info);
      });
    }
});

app.controller('friendlistController', function($scope, $http) {
    var href_list=window.location.href.split("/");
    $http({
      url: '/following',
      method: 'POST',
      headers: {
        'token': sessionStorage.token
      },
      data: {
        'username': href_list[href_list.length-1],
      }
    }).then(
    res => {
      $scope.following=res.data;
    },err => {
      console.log("Find Following ERROR: ", err.data.info);
    });

    $http({
        url: '/follower',
        method: 'POST',
        headers: {
          'token': sessionStorage.token
        },
        data: {
          'username': href_list[href_list.length-1],
      }
    }).then(
        res => {
          console.log(res.data);
          $scope.follower=res.data;
        },err => {
          console.log("Find Follower ERROR: ", err.data.info);
    });
    
    $scope.goProfile1=function(follow_guest){
      var href_list=window.location.href.split("/");
      var username=href_list[href_list.length-1];
      $http({
        url: '/goFollowing/'+follow_guest,
        method: 'POST',
        headers: {
          'token': sessionStorage.token
        },
        data:{
          'username': username,
          'follow_guest':follow_guest,
        }
      }).then(
    res => {
      if (res.data.status=='success'){
        window.location.href = "./GuestProfile/"+follow_guest+"/"+username;
      }else if (res.data.status=="myself"){
        window.location.href = "./Profile/"+username;
      }
      },err => {
        console.log("Find profile ERROR: ", err.data.info);
      });
    }

    $scope.goProfile2=function(follow_host){
      var href_list=window.location.href.split("/");
      var username=href_list[href_list.length-1];
      $http({
        url: '/goFollowing/'+follow_host,
        method: 'POST',
        headers: {
          'token': sessionStorage.token
        },
        data:{
          'username': username,
          'follow_guest':follow_host,
        }
      }).then(
    res => {
      if (res.data.status=='success'){
        window.location.href = "./GuestProfile/"+follow_host+"/"+username;
      }else if (res.data.status=="myself"){
        window.location.href = "./Profile/"+username;
      }
      },err => {
        console.log("Find profile ERROR: ", err.data.info);
      });
    }
    
  });

app.controller('suggestController', function($scope, $http) {
  var href_list=window.location.href.split("/");
  $http({
    url: '/suggestFriend',
    method: "POST",
    headers: {
      'token': sessionStorage.token
    },
    data: {
        'username': href_list[href_list.length-1],
    }
}).then(
    res => {
      $scope.suggest=res.data;
    },err => {
        console.log("Suggest loading error: ", err.data.info);
}); 
  $scope.followUser=function($event){
    var status=$event.event.currentTarget.innerHTML;
    var button=$event.event.currentTarget;
    console.log(status);
    $http({
        url: '/followSuggest',
        method: "POST",
        headers: {
          'token': sessionStorage.token
        },
        data: {
          'follow_host': href_list[href_list.length-1],
          'follow_guest':$event.event.path[1].children[1].innerHTML,
          'status':status
        }
    }).then(
    res => {
        if (res.data.status=="followed"){
            alert("Followed:)");
            button.innerHTML="Unfollow";
        }
        else if (res.data.status=="unfollowed"){
            alert("Unfollowed:(");
            button.innerHTML="Follow";
        }
    },err => {
        console.log("Follow error: ", err.data.info);
    }); 
    };
});