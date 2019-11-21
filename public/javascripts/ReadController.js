// Continue using the previous dependencies
// [] after "Myapp" should be omitted
var app = angular.module('MyApp');

app.controller('readController',function($scope, $http) { 
    var href_list=window.location.href.split("/");
    $http({
        url: '/injectAll',
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
});