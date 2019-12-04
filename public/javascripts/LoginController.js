var app = angular.module('MyApp', []);

app.controller('loginController', function($scope, $http) { 
  $scope.verifyLogin = function() {
    // To check in the console if the variables are correctly storing the input:
    $http({
      url: '/login',
      method: "POST",
      data: {
        'username': $scope.username,
        'password': $scope.password,
        'date' : new Date().getTime()
      }
    }).then(
    res => {
      if (res.data.status=='success'){
        if (sessionStorage.getItem("token")!=null){
          sessionStorage.removeItem("token");
        }
        sessionStorage.token=res.data.token;
        window.location.href = "./MainPage/"+res.data.user;
      }
    },err => {
      if (err.data.status=='unexist'){
        alert('User Not Exists!');
        document.getElementById("name").value="";
        document.getElementById("pwd").value="";
        $scope.username="";
        $scope.password="";
      }
      else if (err.data.status=='error'){
        alert("Error, please try again later");
        document.getElementById("name").value="";
        document.getElementById("pwd").value="";
        $scope.username="";
        $scope.password="";
      }
      else if (err.data.status=='illegal'){
        alert("The username can only be 4-12 characters and numbers")
        document.getElementById("name").value="";
        document.getElementById("pwd").value="";
        $scope.username="";
        $scope.password="";
      }
      else if (err.data.status=='nullpwd'){
        alert("Password cannot be empty")
        document.getElementById("name").value="";
        document.getElementById("pwd").value="";
        $scope.username="";
        $scope.password="";
      }
      else if (err.data.status=='fail'){
        alert("Password incorrect, please try again!");
        document.getElementById("pwd").value="";
        $scope.password="";
      }
      else if (err.data.status=='locked'){
        alert("Your account has been lock, please wait!");
        document.getElementById("name").value="";
        document.getElementById("pwd").value="";
        $scope.username="";
        $scope.password="";
      }
      console.log("Add Row ERROR: ", err.data.info);
    
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
    },err => {
      if (err.data.status=='fail'){
        alert('User already exist!');
        document.getElementById("name").value="";
        document.getElementById("pwd").value="";
        $scope.username="";
        $scope.password="";
      }
      else if (err.data.status=='illegal'){
        alert("The username can only be 4-12 characters and numbers");
        document.getElementById("name").value="";
        document.getElementById("pwd").value="";
        $scope.username="";
        $scope.password="";
      }
      else if (err.data.status=='nullpwd'){
        alert("Password should be longer than 8 characters and include Capital letter, numbers, letters, and symbol");
        document.getElementById("pwd").value="";
        $scope.password="";
      }
      console.log("Add Row ERROR: ", err.data.info);
    }); 
  };
});