var app = angular.module('MyApp', ['file-model']);

// postController
app.controller('postController', function($scope, $http) { 
  $scope.addPost=function() {
    var href_list=window.location.href.split("/");
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
    daymap.set(7,"Sunday");
    let dt=year+"."+month+"."+ date + ", "+hour+":"+minute+", "+ daymap.get(day);
    $http({
      url: '/newPost',
      method: "POST",
      data: {
        'username': href_list[href_list.length-1],
        'picture': document.getElementById("preview-image").src,
        'text': $scope.outtxt,
        'time': dt,
        'post_id': dt + " by " + href_list[href_list.length-1],
        }
    }).then(res => {
      if (res.data.status=='success'){
        console.log("New post is recorded!");
        document.getElementById("close-post").click();
      }
    },
      err => {
        console.log("Add Post Error: ", err);
    }
  )};
});


