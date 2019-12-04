var app = angular.module('MyApp',[]);

app.controller('profileController',function($scope, $http) { 
    var href_list=window.location.href.split("/");
    $http({
        url: '/injectMain',
        method: "POST",
        headers: {
            'token': sessionStorage.token
        },
        data: {
            'username': href_list[href_list.length-1],
        }
    }).then(
        res => {
            if (res.data.status=='success'){
                let result=res.data.result;
                let like=res.data.like;
                let count=res.data.count;
                let comment=res.data.comment;
                like_ids=[];
                for (index=0;index<Object.keys(like).length;index++){
                    like_ids.push(like[index].post_id);
                }
                for (index1=0;index1<Object.keys(result).length;index1++){
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
                    result[index1].commentList=[]
                    for (index4=0;index4<Object.keys(comment).length;index4++){
                        if (comment[index4].post_id==result[index1].post_id){
                            let temp=comment[index4].cmt_id.split("by")[0];
                            comment[index4].time=temp.substring(10,temp.length);
                            result[index1].commentList.push(comment[index4]);
                            break;
                        }
                    }
                }

                let sorted_content = result.sort(function(a, b){
                    var x = a.post_id.toLowerCase();
                    var y = b.post_id.toLowerCase();
                    if (x < y) {return 1;}
                    if (x > y) {return -1;}
                    return 0;
                });
                $scope.injectMain=sorted_content;
            }
        },err => {
            console.log("Mainpage content loading error: ", err.data.info);
    }); 
    
    $scope.addIcon = function(){
        $http({
            url: '/addIcon',
            method: "POST",
            headers: {
                'token': sessionStorage.token
            },
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
            console.log("Mainpage profile loading error: ", err.data.info);
        }); 
    }; 

    $http({
        url: '/countPost',
        method: "POST",
        headers: {
            'token': sessionStorage.token
        },
        data: {
            'username': href_list[href_list.length-1]
        }
    }).then(
    res => {
        // console.log(res.data);
        document.getElementById("numPosts").innerHTML=res.data[0].countPost;
    },err => {
        console.log("Follow error: ", err.data.info);
    }); 

    $http({
        url: '/countFollower',
        method: "POST",
        headers: {
            'token': sessionStorage.token
        },
        data: {
            'username': href_list[href_list.length-1]
        }
    }).then(
    res => {
        // console.log(res.data);
        document.getElementById("numFollowers").innerHTML=res.data[0].countFollower;
    },err => {
        console.log("Follow error: ", err.data.info);
    }); 

    $http({
        url: '/countFollowing',
        method: "POST",
        headers: {
            'token': sessionStorage.token
        },
        data: {
            'username': href_list[href_list.length-1]
        }
    }).then(
    res => {
        // console.log(res.data);
        document.getElementById("numFollowings").innerHTML=res.data[0].countFollowing;
    },err => {
        console.log("Follow error: ", err.data.info);
    }); 
});
