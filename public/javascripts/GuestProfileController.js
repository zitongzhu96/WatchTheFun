var app = angular.module('MyApp',[]);

app.controller('profileController',function($scope, $http) { 
    var href_list=window.location.href.split("/");
    $http({
        url: '/injectMain',
        method: "POST",
        data: {
            'username': href_list[href_list.length-1],
        }
    }).then(
        res => {
            if (res.data.status=='success'){
                let main_content=JSON.parse(res.data.result);
                let sorted_content = main_content.sort(function(a, b){
                    var x = a.post_id.toLowerCase();
                    var y = b.post_id.toLowerCase();
                    if (x < y) {return 1;}
                    if (x > y) {return -1;}
                    return 0;
                });
                $scope.injectMain=sorted_content;
            }
        },err => {
            console.log("Mainpage content loading error: ", err);
    }); 
    
    $scope.addIcon = function(){
        $http({
            url: '/addIcon',
            method: "POST",
            data: {
                'username': href_list[href_list.length-1],
            }
        }).then(
        res => {
            if (res.data.status=='success'){
                // Change the user name column
                let user_column = document.getElementById("grid-username");
                user_column.innerHTML = href_list[4];
                let user_icon=document.getElementById("grid-user-photo");
                let icon_value=JSON.parse(res.data.result);
                user_icon.src=icon_value[0].icon;
            }
        },err => {
            console.log("Mainpage profile loading error: ", err);
        }); 
    };

    $http({
        url: '/followStatus',
        method: "POST",
        data: {
            'follow_host': href_list[href_list.length-1],
            'follow_guest': href_list[href_list.length-2]
        }
    }).then(
    res => {
        console.log(res.data);
        if (res.data.status=="followed"){
            document.getElementById("followbtn").innerText="Unfollow";
        }else if (res.data.status=="unfollow"){
            document.getElementById("followbtn").innerText="Follow";
        }
    },err => {
        console.log("Follow error: ", err);
    }); 

    $scope.followUser=function(){
        var status=document.getElementById("followbtn").innerText;
        $http({
            url: '/follow',
            method: "POST",
            data: {
                'follow_host': href_list[href_list.length-1],
                'follow_guest': href_list[href_list.length-2],
                'follow_status':status
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

    // $scope.deletePost=function(){

    // };

    $http({
        url: '/countPost',
        method: "POST",
        data: {
            'username': href_list[href_list.length-1]
        }
    }).then(
    res => {
        console.log(res.data);
        document.getElementById("numPosts").innerHTML=res.data[0].countPost;
    },err => {
        console.log("Follow error: ", err);
    }); 

    $http({
        url: '/countFollower',
        method: "POST",
        data: {
            'username': href_list[href_list.length-1]
        }
    }).then(
    res => {
        console.log(res.data);
        document.getElementById("numFollowers").innerHTML=res.data[0].countFollower;
    },err => {
        console.log("Follow error: ", err);
    }); 

    $http({
        url: '/countFollowing',
        method: "POST",
        data: {
            'username': href_list[href_list.length-1]
        }
    }).then(
    res => {
        console.log(res.data);
        document.getElementById("numFollowings").innerHTML=res.data[0].countFollowing;
    },err => {
        console.log("Follow error: ", err);
    }); 
});