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
        $scope.username=null;
        $scope.password=null;
      }
      else if (res.data.status=='error'){
        alert("Error, please try again later");
        document.getElementById("name").value="";
        document.getElementById("pwd").value="";
        $scope.username=null;
        $scope.password=null;
      }
      else if (res.data.status=='illegal'){
        alert("The username can only be 4-12 characters and numbers")
        document.getElementById("name").value="";
        document.getElementById("pwd").value="";
        $scope.username=null;
        $scope.password=null;
      }
      else if (res.data.status=='nullpwd'){
        alert("Password cannot be empty")
        document.getElementById("name").value="";
        document.getElementById("pwd").value="";
        $scope.username=null;
        $scope.password=null;
      }
      else{
        alert("Password incorrect, please try again!");
        document.getElementById("pwd").value="";
        $scope.password=null;
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
        $scope.username=null;
      }
      else if (res.data.status=='illegal'){
        alert("The username can only be 4-12 characters and numbers")
        document.getElementById("name").value="";
        document.getElementById("pwd").value="";
        $scope.username=null;
        $scope.password=null;
      }
      else if (res.data.status=='nullpwd'){
        alert("Password cannot be empty")
        document.getElementById("pwd").value="";
        $scope.password=null;
      }
    },err => {
      console.log("Add Row ERROR: ", err);
    }); 
  };
});