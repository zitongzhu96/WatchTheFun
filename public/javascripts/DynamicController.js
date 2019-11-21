// This file includes controller on likes, comments
var app = angular.module('MyApp');

app.controller('dynamicController',function($scope, $http) { 
    var href_list=window.location.href.split("/");
    $scope.readLike = function(){
        var post_list=document.getElementsByClassName("new_ids");
        var like_list=document.getElementsByClassName("like-div1");
        for (let temp_post=0; temp_post < post_list.length; temp_post++){
            $http({
                url: '/readLike',
                method: "POST",
                data: {
                    'post_id': post_list[curr_post].innerHTML,
                    'username': href_list[href_list.length-1]
                }
            }).then(
                res => {
                    if (res.data.status=="existed"){
                        var temp_like=like_list[curr_post];
                        temp_like.firstChild.firstChild
                }
            })
        }
    };

    $scope.addLike = function($event){
        var post_id=$event.event.path[4].firstElementChild.innerHTML;
        $http({
            url: '/addLike',
            method: "POST",
            data: {
                'username': href_list[href_list.length-1],
                'post_id': post_id
            }
        }).then(
            res => {
            if (res.data.status=="success"){
                $event.event.path[1].firstElementChild.setAttribute("class", "fas fa-thumbs-up");
                $event.event.path[1].lastElementChild.innerHTML="Liked";
                $event.event.path[1].setAttribute("ng-click","cancelLike()");
            }
        })
    };

    $scope.cancelLike = function(){
        var post_id=$event.event.path[4].firstElementChild.innerHTML;
        $http({
            url: '/cancelLike',
            method: "POST",
            data: {
                'username': href_list[href_list.length-1],
                'post_id': post_id
            }
        }).then(
            res => {
            if (res.data.status=="success"){
                $event.event.path[1].firstElementChild.setAttribute("class", "far fa-thumbs-up");
                $event.event.path[1].lastElementChild.innerHTML="Like !";
                $event.event.path[1].setAttribute("ng-click","addLike()");
            }
        })
    };

    $scope.addcomment = function(){};

    $scope.uncomment = function(){};
})
