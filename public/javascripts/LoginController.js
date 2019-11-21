var app = angular.module('MyApp', []);

app.controller('loginController', function($scope, $http) { 
  $scope.verifyLogin = function() {
    // To check in the console if the variables are correctly storing the input:
    $http({
      url: '/login',
      method: "POST",
      data: {
        'username': $scope.username,
        'password': $scope.password
      }
    }).then(
    res => {
      if (res.data.status=='success'){
        window.location.href = "http://localhost:8081/MainPage/"+res.data.user;
      }
      else if (res.data.status=='unexist'){
        alert('User Not Exists!');
        document.getElementById("name").value="";
        document.getElementById("pwd").value="";
      }
      else if (res.data.status=='error'){
        alert("Error, please try again later");
        document.getElementById("name").value="";
        document.getElementById("pwd").value="";
      }
      else{
        alert("Password incorrect, please try again!");
        document.getElementById("pwd").value="";
      }
    },err => {
      console.log("Add Row ERROR: ", err);
    });

  };

  $scope.newUser = function() {  
    let canvas=document.getElementById("defaultIcon");
    let imgurl=canvas.toDataURL('image/jpeg', 1.0);
    $http({
        url: '/register',
        method: "POST",
        data: {
        'username': $scope.username,
        'password': $scope.password,
        'icon': imgurl
      }
    }).then(
    res => {
      if (res.data.status=='success'){
        alert('Sign up successfully! Please login');
      }
      else if (res.data.status=='fail'){
        alert('User already exist!');
        document.getElementById("name").value="";
      }
    },err => {
      console.log("Add Row ERROR: ", err);
    }); 
  };
});