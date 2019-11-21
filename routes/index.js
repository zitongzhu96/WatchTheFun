var express = require('express');
var router = express.Router();
var path = require('path');

// Connect string to MySQL
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port:'3306',
  password: 'longpassword',
  database: 'CIS557'
});

connection.connect(function(err) {
  if (err) {
    console.log("Error Connection to DB" + err);
    return;
  }
  console.log("Connection established...");
});

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'Login.html'));
});
router.get('/Login', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'Login.html'));
});

router.post('/register', (req, res) => {
  var username=req.body.username;
  var pwd=req.body.password;
  var icon=req.body.icon;
  var check = 'SELECT password FROM user_info WHERE username = "' + username + '"';
  var register = "INSERT INTO user_info (username, password, icon) VALUES (\""+username+"\",\""+pwd+"\",\""+icon+"\");";
  connection.query(check, function(err, result) {
    var message = JSON.stringify(result);
    if (message.length==2){
      connection.query(register,function(err) {
        if (err) console.log('insert error: ', err);
        else {
          res.json({
            name: username,
            status: 'success'
          });
        }        
    });
    }else{
      res.json({
        status: 'fail'
      });
      console.log("The user is already existed");
    }
  });
});

router.post('/login', (req, res) => {
  var username=req.body.username;
  var pwd=req.body.password;
  var check = 'SELECT password FROM user_info WHERE username = "' + username + '"';
  connection.query(check, function(err, result) {
    var message = JSON.stringify(result);
    if (message.length==2){
      res.json({
        status: 'unexist'
      });
    }else{
      message = JSON.parse(message);
      if (err) {
        res.json({
          status: 'error'
        });
      }
      if (message[0].password == pwd) {
        res.json({
          status: 'success',
          user: username,
        });
        router.get('/MainPage/'+username, function (req, res) {
          res.sendFile(path.join(__dirname, '../', 'views', 'MainPage.html'));
        });
        router.get('/FriendList/'+username, function (req, res) {
          res.sendFile(path.join(__dirname, '../', 'views', 'FriendList.html'));
        });
        router.get('/Profile/'+username, function (req, res) {
          res.sendFile(path.join(__dirname, '../', 'views', 'Profile.html'));
        });
        router.get('/Login', function (req, res) {
          res.sendFile(path.join(__dirname, '../', 'views', 'Login.html'));
        });
      } else {
        res.json({
          status: 'fail'
        });
      }
    }
  });
});

router.post('/newPost', (req, res) => {
  var username=req.body.username;
  var time=req.body.time;
  var text=req.body.text;
  var picture=req.body.picture;
  var post_id=req.body.post_id;
  var add = "INSERT INTO post_content (username, time, text, picture, post_id) VALUES (\""+username+"\",\""+time+"\",\""+text+"\",\""+picture+"\",\""+post_id+"\");";
  connection.query(add, function(err, result) {
    if (err) {
      console.log('insert error: ', err);
    }else{
    res.json({
      status: 'success'
      });
    }        
  });
});

router.post('/addIcon', (req, res) => {
  var username=req.body.username;
  var add_icon = 'SELECT icon FROM user_info WHERE username = "' + username + '"';
  connection.query(add_icon, function(err, result) {
    if (err) {
      console.log('icon error: ', err);
    }else{
      res.json({
      status: 'success',
      result: JSON.stringify(result)
      });
    }        
  });
});

router.post('/injectMain', (req, res) => {
  var username=req.body.username;
  var inject_main = 'SELECT * FROM post_content WHERE username = "' + username + '";';
  connection.query(inject_main, function(err, result) {
    if (err) {
      console.log('injection error: ', err);
    }else{
      res.json({
      status: 'success',
      result: JSON.stringify(result)
      });
    }        
  });
});

router.post('/injectAll', (req, res) => {
  var username=req.body.username;
  var inject_main = 'SELECT * FROM post_content WHERE username = "' + username + '";';
  connection.query(inject_main, function(err, result) {
    if (err) {
      console.log('injection error: ', err);
    }else{
      res.json({
      status: 'success',
      result: JSON.stringify(result)
      });
    }        
  });
});

// router.post('/injectAll', (req, res) => {
//   var follow_host=req.body.username;
//   var all_guests = 'SELECT follow_guest FROM follow WHERE follow_host = "' + follow_host + '";';
//   var post_icon = 'SELECT icon FROM user_info WHERE username = "' + follow_host + '";';
//   connection.query(all_guests, function(err, result) {
//     if (err) {
//       console.log('following guest error: ', err);
//     }else{
//       var all_result=[];
//       console.log(result);
//       for (curr_guest in result){
//         let inject_all = 'SELECT * FROM post_content WHERE username = "' + curr_guest + '";'
//         connection.query(inject_all,function(err,curr_result){
//           if(err){
//             console.log('injection error',err);
//           }else{
//             console.log("inject succeeded");
//             // TODO: debug adding icon function
//             connection.query(post_icon,function(err,icon){
//               curr_result.append(icon);
//             })
//             all_result+=curr_result;
//           }
//         })
//       }
//       res.json({
//         status: 'success',
//         result: JSON.stringify(all_result)
//       });
//     }        
//   });
// });

router.post('/following', function (req, res) {
  var username=req.body.username;
  console.log(username);
  var query = 'SELECT follow_guest FROM follow WHERE follow_host="' + username + '";';
  connection.query(query, function(err, rows) {
  if (err) console.log(err);
  else {     
      console.log(rows);
      res.json(rows);      
    }
  });
  
});

router.post('/follower', function (req, res) {
  var username=req.body.username;
  var query = 'SELECT follow_host FROM follow WHERE follow_guest="' + username + '";';
  connection.query(query, function(err, rows) {
  if (err) console.log(err);
  else {     
      console.log(rows);
      res.json(rows);      
    }
  }); 
});

router.post('/searchUser', (req, res) => {
  var username=req.body.username;
  var searchname=req.body.searchname;
  var check = 'SELECT username FROM user_info WHERE username = "' + searchname + '";';
  connection.query(check, function(err, result) {
    var message = JSON.stringify(result);
    if (message.length==2){
      res.json({
        status: 'unexist'
      });
    }else{
      if (err) {
        res.json({
          status: 'error',
          
        });
      }
      else{  
        if (username==searchname){
          res.json({status:"myself"});
        }else{
      router.get('/GuestProfile/'+searchname+'/'+username, function (req, res) {
          res.sendFile(path.join(__dirname, '../', 'views', 'GuestProfile.html'));
        });
        res.json({
          status: 'success',
          user: searchname
        });
      }
    }
    }
  });
});
router.post('/followStatus', (req, res) => {
  var host=req.body.follow_host;
  var guest=req.body.follow_guest;
  var checkFollow = 'SELECT * FROM follow WHERE follow_guest = "'+guest+'" AND follow_host = "'+host+'";';
  connection.query(checkFollow, function(err, result) {
    var message = JSON.stringify(result);
    if (message.length==2){
      res.json({
        status:'unfollow'
      });
    }else{
    res.json({
    status: 'followed'
      });
    }        
  });
});
router.post('/follow', (req,res) => {
  var host=req.body.follow_host;
  var guest=req.body.follow_guest;
  var followstatus=req.body.follow_status;
  var follow = "INSERT INTO follow (follow_host, follow_guest) VALUES (\""+host+"\",\""+guest+"\");";
  var unfollow = 'DELETE FROM follow WHERE follow_host="'+host+'" AND follow_guest="'+guest+'";';
  if (followstatus=="Follow"){
    connection.query(follow, function(err, result1) {
      if (err) {
        console.log('insert error: ', err);
      }else{
      res.json({
      status: 'followed'
        });
      }        
    });
  }else if(followstatus=="Unfollow"){
    connection.query(unfollow, function(err, result2) {
      if (err) {
        console.log('delete error: ', err);
      }else{
      res.json({
      status: 'unfollowed'
        });
      }        
    });
  }else{
    console.log('delete error:');
  }

});

router.post('/readLike',(req, res) => {
  var post_id=req.body.post_id;
  var username=req.body.username;
  var read_like= 'SELECT * FROM like WHERE post_id= "' + post_id + '" AND username= "' + username + '";';
  connection.query(read_like,function(err,result){
    if (err) {
      console.log('read like error: ', err);
    }else{
      if (JSON.stringify(result).length==2)
      {
        res.json({
          status: 'unexisted'
        });
      }
      else
      {
        res.json({
          status: 'existed'
        });
      }
    }
  });
});

router.post('/addLike',(req, res) => {
  var post_id=req.body.post_id;
  var username=req.body.username;
  var add_like= 'INSERT INTO likes (username, post_id) VALUES ("'+username+'","'+post_id+'");';
  connection.query(add_like,function(err,result){
    if(err){
      console.log('add like error: ', err);
    }else{
      console.log('like added successfully!')
      res.json({
        status: 'success'
      });
    }
  });
});

router.post('/cancelLike',(req, res) => {
  var post_id=req.body.post_id;
  var username=req.body.username;
  var delete_like= 'DELETE INTO likes (username, post_id) VALUES ("'+username+'","'+post_id+'");';
  connection.query(cancel_like,function(err,result){
    if(err){
      console.log('add like error: ', err);
    }else{
      console.log('like added successfully!')
      res.json({
        status: 'success'
      });
    }
  });
});

router.post('/goFollowing/:follow_guest',(req, res) => {
  var host=req.body.follow_host;
  var guest=req.body.follow_guest;
  if (guest==host){
    res.json({status:"myself"});
  }else{
  router.get('/GuestProfile/'+guest+'/'+host, function (req, res) {
          res.sendFile(path.join(__dirname, '../', 'views', 'GuestProfile.html'));
        });
  res.json({status: "success"});
      }
});

router.post('/goFollower/:follow_host',(req, res) => {
  var host=req.body.follow_host;
  var guest=req.body.follow_guest;
  if (guest==host){
    res.json({status:"myself"});
  }else{
  router.get('/GuestProfile/'+guest+'/'+host, function (req, res) {
          res.sendFile(path.join(__dirname, '../', 'views', 'GuestProfile.html'));
        });
  res.json({status: "success"});
      }
});



router.post('/countPost', (req, res) => {
  var username=req.body.username;
  var countPost = 'SELECT COUNT(*) AS countPost FROM post_content WHERE username="'+username+'" GROUP BY username;';
  connection.query(countPost, function(err, count) {
    console.log(count);
    res.json(count);  
    });
});

router.post('/countFollowing', (req, res) => {
  var username=req.body.username;
  var countfollowing = 'SELECT COUNT(*) AS countFollowing FROM follow WHERE follow_host="'+username+'" GROUP BY follow_host;';
  connection.query(countfollowing, function(err, rows) {
    console.log(rows);
    res.json(rows);  
    });
});
router.post('/countFollower', (req, res) => {
  var username=req.body.username;
  var countfollower = 'SELECT COUNT(*) AS countFollower FROM follow WHERE follow_guest="'+username+'" GROUP BY follow_guest;';
  connection.query(countfollower, function(err, rows) {
    console.log(rows);
    res.json(rows);  
    });
});

router.post('/followSuggest', (req,res) => {
  var host=req.body.follow_host;
  var guest=req.body.follow_guest;
  var followstatus=req.body.status;
  var follow = "INSERT INTO follow (follow_host, follow_guest) VALUES (\""+host+"\",\""+guest+"\");";
  var unfollow = 'DELETE FROM follow WHERE follow_host="'+host+'" AND follow_guest="'+guest+'";';
  if (followstatus=="Follow"){
    connection.query(follow, function(err, result3) {
      if (err) {
        console.log('insert error: ', err);
      }else{
      res.json({
      status: 'followed'
        });
      }        
    });
  }else if(followstatus=="Unfollow"){
    connection.query(unfollow, function(err, result4) {
      if (err) {
        console.log('delete error: ', err);
      }else{
      res.json({
      status: 'unfollowed'
        });
      }        
    });
  }else{
    console.log('delete error:');
  }
});
router.post('/suggestFriend', (req,res) => {
  var username=req.body.username;
  var suggest='SELECT username, icon FROM user_info ORDER BY RAND() LIMIT 5;';
  connection.query(suggest, function(err, rows) {
    console.log(rows);
    res.json(rows);
  });
});


module.exports = router;
