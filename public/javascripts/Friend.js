var app = angular.module('MyApp');

app.controller('searchController', function($scope, $http) { 
    $scope.searchUser = function() {
        var href_list=window.location.href.split("/");
        var username=href_list[href_list.length-1];
        $http({
            url: '/searchUser',
            method: "POST",
            data: {
            'searchname': $scope.searchname,
            'username': href_list[href_list.length-1]
        }
      }).then(
      res => {      
          if (res.data.status=='success'){
        window.location.href = "http://localhost:8081/GuestProfile/"+res.data.user+"/"+username;
      }else if (res.data.status=="myself"){
        window.location.href = "http://localhost:8081/Profile/"+username;
      }
      else if (res.data.status=='unexist'){
        alert('User Not Exists!');
      }
      else {
        alert("Error, please try again later");
      } 
    });
}
});

app.controller('friendlistController', function($scope, $http) {
    var href_list=window.location.href.split("/");
    $http({
      url: '/following',
      method: 'POST',
      data: {
        'username': href_list[href_list.length-1],
      }
    }).then(
    res => {
      console.log(res.data);
      $scope.following=res.data;
    },err => {
      console.log("Find Following ERROR: ", err);
    });

    $http({
        url: '/follower',
        method: 'POST',
        data: {
          'username': href_list[href_list.length-1],
      }
    }).then(
        res => {
          console.log(res.data);
          $scope.follower=res.data;
        },err => {
          console.log("Find Follower ERROR: ", err);
    });
    
    $scope.goProfile1=function(follow_guest){
      var href_list=window.location.href.split("/");
      var username=href_list[href_list.length-1];
      $http({
        url: '/goFollowing/'+follow_guest,
        method: 'POST',
        data:{
          'follow_host': username,
          'follow_guest':follow_guest,
        }
      }).then(
    res => {
      if (res.data.status=='success'){
        window.location.href = "http://localhost:8081/GuestProfile/"+follow_guest+"/"+username;
      }else if (res.data.status=="myself"){
        window.location.href = "http://localhost:8081/Profile/"+username;
      }
      },err => {
        console.log("Find profile ERROR: ", err);
      });
    }

    $scope.goProfile2=function(follow_host){
      var href_list=window.location.href.split("/");
      var username=href_list[href_list.length-1];
      $http({
        url: '/goFollowing/'+follow_host,
        method: 'POST',
        data:{
          'follow_host': username,
          'follow_guest':follow_host,
        }
      }).then(
    res => {
      if (res.data.status=='success'){
        window.location.href = "http://localhost:8081/GuestProfile/"+follow_host+"/"+username;
      }else if (res.data.status=="myself"){
        window.location.href = "http://localhost:8081/Profile/"+username;
      }
      },err => {
        console.log("Find profile ERROR: ", err);
      });
    }
    
  });

  app.controller('suggestController', function($scope, $http) {
    var href_list=window.location.href.split("/");
    $http({
      url: '/suggestFriend',
      method: "POST",
      data: {
          'username': href_list[href_list.length-1],
      }
  }).then(
      res => {
        $scope.suggest=res.data;
      },err => {
          console.log("Mainpage content loading error: ", err);
  }); 
  $scope.followUser=function(follow_guest){
    var status=document.getElementById("followbtn").innerText;
    console.log(status);
    $http({
        url: '/followSuggest',
        method: "POST",
        data: {
          'follow_host': href_list[href_list.length-1],
          'follow_guest':follow_guest,
          'status':status
        }
    }).then(
    res => {
        if (res.data.status=="followed"){
            alert("Followed:)");
            document.getElementById("followbtn").innerText="Unfollow";
        }
        else if (res.data.status=="unfollowed"){
            alert("Unfollowed:(");
            document.getElementById("followbtn").innerText="Follow";
        }
    },err => {
        console.log("Follow error: ", err);
    }); 
};
  });