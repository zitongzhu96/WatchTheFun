var app = angular.module('MyApp', ['file-model','ngSanitize']);

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
    daymap.set(0,"Sunday");
    let dt=year+"."+month+"."+ date + ", "+hour+":"+minute+", "+ daymap.get(day);

    let text=document.getElementById("post-content").value
    let temp_tags=text.split("@");
    let tags=[]
    if (temp_tags.length>0){
      for (index=1;index<temp_tags.length;index++){
        let temp_username=temp_tags[index].replace(/\W.*$/,"").replace(/ .*$/,"");
        if (tags.includes(temp_username)==false){
          tags.push([temp_username, dt + " by " + href_list[href_list.length-1]]);
        }
      }
    }
    $http({
      url: '/newPost',
      method: "POST",
      headers: {
        'token': sessionStorage.token
      },
      data: {
        'username': href_list[href_list.length-1],
        'picture': document.getElementById("preview-image").src,
        'text': text,
        'time': dt,
        'post_id': dt + " by " + href_list[href_list.length-1],
        'tags': tags
        }
    }).then(res => {
      if (res.data.status=='success'){
        console.log("New post is recorded!");
        document.getElementById("close-post").click();
      }
    },
      err => {
        console.log("Add Post Error: ", err.data.info);
        document.getElementById("close-post").click();
    }
  )};
});

app.filter('emoji', function($sce) {
  return function(val) {
      return $sce.trustAsHtml(val);
  };
});
