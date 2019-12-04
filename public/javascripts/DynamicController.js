// This file includes controller on likes, comments
var app = angular.module('MyApp');

app.controller('dynamicController',function($scope, $http) { 
    var href_list=window.location.href.split("/");

    $scope.addLike = function($event){
        var post_id=$event.event.path[4].firstElementChild.innerHTML;
        var like_status=$event.event.path[1].lastElementChild.innerHTML;
        if (like_status==" Like !"){
            // thenable functions, promises
            $http({
                url: '/addLike',
                method: "POST",
                headers: {
                    'token': sessionStorage.token
                },
                data: {
                    'username': href_list[href_list.length-1],
                    'post_id': post_id,
                    'status': like_status
                }
            }).then(
                res => {
                    if (res.data.status=="success"){
                        $event.event.path[1].firstElementChild.setAttribute("class", "fas fa-thumbs-up");
                        $event.event.path[1].lastElementChild.innerHTML=" Liked";
                        $event.event.path[2].firstElementChild.style.backgroundColor="gold";
                        $event.event.path[2].lastElementChild.firstElementChild.innerHTML=Number($event.event.path[2].lastElementChild.firstElementChild.innerHTML)+1;
                }},
                err => {
                    console.log("Add like error: ", err.data.info);
                })
        }else if (like_status==" Liked"){
            $http({
                url: '/cancelLike',
                method: "PUT",
                headers: {
                    'token': sessionStorage.token
                },
                data: {
                    'username': href_list[href_list.length-1],
                    'post_id': post_id,
                    'status': like_status
                }
            }).then(
                res => {
                    if (res.data.status=="success"){
                        $event.event.path[1].firstElementChild.setAttribute("class", "far fa-thumbs-up");
                        $event.event.path[1].lastElementChild.innerHTML=" Like !";
                        $event.event.path[2].firstElementChild.style.backgroundColor="";
                        $event.event.path[2].lastElementChild.firstElementChild.innerHTML=Number($event.event.path[2].lastElementChild.firstElementChild.innerHTML)-1;
                    }
                },
                err => {
                    console.log("cancel like error: ", err.data.info);
                });            
        };
    };

    $scope.sendPostID=function($event){
        var curr_target=$event.event.currentTarget;
        if (curr_target.getAttribute("data-target")=="#new-comment"){
            var post_id=$event.event.path[4].firstElementChild.innerHTML;
            document.getElementById("chat-post-id").innerHTML=post_id;
        }else if (curr_target.getAttribute("data-target")=="#delete-post"){
            var post_id=$event.event.path[2].firstElementChild.innerHTML;
            document.getElementById("delete-post-id").innerHTML=post_id;
        }else if (curr_target.getAttribute("data-target")=="#delete-comment"){
            var comment_id=$event.event.path[1].firstElementChild.innerHTML;
            document.getElementById("delete-comment-id").innerHTML=comment_id;
        }else{
            console.log("Send post ID error");
        }
    }

    $scope.addComment=function($event){
        var post_id=$event.event.path[2].firstElementChild.innerHTML;
        var text=$event.event.path[2].children[2].firstElementChild.value;
        var now=new Date();
        let year=now.getFullYear();
        let month=now.getMonth()+1;
        if (month<10){
        month="0"+String(month);
        }
        let date=now.getDate();
        if (date<10){
        date="0"+String(date);
        }
        let hour=now.getHours();
        if (hour<10){
        hour="0"+String(hour);
        }
        let minute=now.getMinutes();
        if (minute<10){
        minute="0"+String(minute);
        }
        let day=now.getDay();
        let daymap=new Map();
        daymap.set(1,"Monday");
        daymap.set(2,"Tuesday");
        daymap.set(3,"Wednesday");
        daymap.set(4,"Thursday");
        daymap.set(5,"Friday");
        daymap.set(6,"Saturday");
        daymap.set(0,"Sunday");
        let dt=year+"."+month+"."+ date + ", "+hour+":"+minute+", "+ daymap.get(day);
        var cmt_id='comment on ' + dt + ' by ' + href_list[href_list.length-1] + ' of ' + post_id;
        $http({
            url: '/addComment',
            method: "POST",
            headers: {
                'token': sessionStorage.token
            },
            data: {
                'post_id': post_id,
                'username': href_list[href_list.length-1],
                'text': text,
                'cmt_id':cmt_id
            }
        }).then(
            res => {
                if (res.data.status=="success"){
                    alert("Comment successfully added!");
                    document.getElementById("close-comment").click();
                }
            },
            err =>{
                console.log("comment insertion error :"+ err.data.info);
                document.getElementById("close-comment").click();
        });
    };

    // DELETE moethod completely ignores req.body, therefore we use PUT instead
    $scope.deletePost=function(){
        $http({
            url: '/deletePost',
            method: "PUT",
            headers: {
                'token': sessionStorage.token
            },
            data:{
                'post_id': document.getElementById("delete-post-id").innerHTML,
                'username': href_list[href_list.length-1]
            }
        }).then(
        res=>{
            if (res.data.status=='success'){
                alert("Post deleted!");
                document.getElementById("close-del-post").click();
            }
        },err=>{
            console.log("post deletion error :"+ err.data.info);
            document.getElementById("close-del-post").click();
        });
    };

    $scope.deleteComment=function(){
        $http({
            url: '/deleteComment',
            method: "PUT",
            headers: {
                'token': sessionStorage.token
            },
            data:{
                'comment_id': document.getElementById("delete-comment-id").innerHTML,
                'username': href_list[href_list.length-1]
            }
        }).then(
        res=>{
            if (res.data.status=='success'){
                alert("Comment deleted!");
                document.getElementById("close-del-comment").click();
            }
        },err=>{
            console.log("post deletion error :"+ err.data.info);
            document.getElementById("close-del-comment").click();
        });
    };

    $scope.logout=function(){
        $http({
            url: '/logout',
            method: "GET",
            headers: {
                'token': sessionStorage.token
            }
        }).then(
            res =>{
                if (res.data.status=="logout"){
                    sessionStorage.clear();
                    window.location.href="../";
                }
            },err=>{
                console.log("logout error");
        });
    }
});
