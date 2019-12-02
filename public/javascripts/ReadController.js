// Continue using the previous dependencies
// [] after "Myapp" should be omitted
var app = angular.module('MyApp');

app.controller('readController',function($scope, $http) { 
    var href_list=window.location.href.split("/");

    // inject likes, comments, post contents, icons
    $http({
        url: '/injectAll',
        method: "POST",
        data: {
            'username': href_list[href_list.length-1],
        }
    }).then(
        res => {
            if (res.data.status=='success'){
                let result=res.data.result;
                let icon=res.data.icon;
                let like=res.data.like;
                let count=res.data.count;
                let comment=res.data.comment;
                let tags=res.data.tags;
                like_ids=[];
                for (index=0;index<Object.keys(like).length;index++){
                    like_ids.push(like[index].post_id);
                }
                for (index1=0;index1<Object.keys(result).length;index1++){
                    // icon assignment
                    for (index2=0;index2<Object.keys(icon).length;index2++){
                        if (icon[index2].username==result[index1].username){
                            result[index1].icon=icon[index2].icon;
                            break;
                        }
                    }

                    // like_btn assignment
                    if (like_ids.includes(result[index1].post_id)){
                        result[index1].liked=" Liked";
                        result[index1].bkg_color="gold";
                        result[index1].thumb="fas fa-thumbs-up"
                    }else{
                        result[index1].liked=" Like !";
                        result[index1].bkg_color="";
                        result[index1].thumb="far fa-thumbs-up";
                    }

                    // count assignment
                    result[index1].like_count=0;
                    for (index3=0;index3<Object.keys(count).length;index3++){
                        if (count[index3].post_id==result[index1].post_id){
                            result[index1].like_count=count[index3].num;
                            break;
                        }
                    }

                    // comment assignment
                    result[index1].commentList=[];
                    for (index4=0;index4<Object.keys(comment).length;index4++){
                        if (comment[index4].post_id==result[index1].post_id){
                            let temp=comment[index4].cmt_id.split("by")[0];
                            comment[index4].time=temp.substring(10,temp.length);
                            result[index1].commentList.push(comment[index4]);
                        }
                    }

                    // tags assignment
                    let temp_tagged=false;
                    for (index5=0;index5<Object.keys(tags).length;index5++){
                        if ((result[index1].post_id==tags[index5].post_id) && (href_list[href_list.length-1]==tags[index5].post_id)){
                            temp_tagged=true;
                            break;
                        }
                    }
                    if (temp_tagged){
                        result[index1].tagged="You are tagged!";
                    }else{
                        result[index1].tagged="";
                    }
                }

                let sorted_content = result.sort(function(a, b){
                    var x = a.post_id.toLowerCase();
                    var y = b.post_id.toLowerCase();
                    if (x < y) {return 1;}
                    if (x > y) {return -1;}
                    return 0;
                });
                $scope.injectAll=sorted_content;
            }
        },err => {
            console.log("Mainpage content loading error: ", err);
    }); 
    
    $scope.addIcon = function(){
        var href_list=window.location.href.split("/");
        $http({
            url: '/addIcon',
            method: "POST",
            data: {
                'username': href_list[href_list.length-1],
            }
        }).then(
        res => {
            if (res.data.status=='success'){
                let user_column = document.getElementById("grid-username");
                user_column.innerHTML = username;
                let user_icon=document.getElementById("grid-user-photo");
                let icon_value=JSON.parse(res.data.result);
                user_icon.src=icon_value[0].icon;
                
            }
        },err => {
            console.log("Mainpage profile loading error: ", err);
        }); 
    };

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
    $scope.followUser=function($event){
        var status=$event.event.currentTarget.innerHTML;
        var button=$event.event.currentTarget;
        console.log(status);
        $http({
            url: '/followSuggest',
            method: "POST",
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
            console.log("Follow error: ", err);
        }); 
        };
});

    // $scope.goProfile2=function($event){
    //     var href_list=window.location.href.split("/");
    //     var username=href_list[href_list.length-1];
    //     var follow_host=$event.event.currentTarget.innerHTML;
    //     $http({
    //         url: '/goFollowing/'+follow_host,
    //         method: 'POST',
    //         data:{
    //         'follow_host': username,
    //         'follow_guest':follow_host,
    //         }
    //     }).then(
    //         res => {
    //         if (res.data.status=='success'){
    //             window.location.href = "http://localhost:8081/GuestProfile/"+follow_host+"/"+username;
    //         }else if (res.data.status=="myself"){
    //             window.location.href = "http://localhost:8081/Profile/"+username;
    //         }
    //         },err => {
    //             console.log("Find profile ERROR: ", err);
    //         });
    //     };