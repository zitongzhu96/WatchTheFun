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
  database: 'CIS557',
  charset:'utf8mb4'
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
  var re = /^[0-9a-zA-Z]*$/;
  console.log(pwd.length);
  if (pwd!=null){
    if (pwd.length>0){
      if ((re.test(username))&&username.length >= 4 && username.length <= 12) {
        var check = 'SELECT password FROM user_info WHERE username = ?';
        var register = "INSERT INTO user_info (username, password, icon) VALUES (?,?,?);";
        connection.query(check,[username], function(err, result) {
          var message = JSON.stringify(result);
          if (message.length==2){
            connection.query(register,[username,pwd,icon],function(err) {
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
      }else{
        res.json({
          status:'illegal'
        });
      }
    }else{
      res.json({
        status:'nullpwd'
      });
  }}else{
    res.json({
      status:'nullpwd'
    });
  }
});

router.post('/login', (req, res) => {
  var username=req.body.username;
  var pwd=req.body.password;
  var re =  /^[0-9a-zA-Z]*$/;
  console.log(re.test(username));
  var check = 'SELECT password FROM user_info WHERE username = ?';
  if (pwd!=null){
    if (pwd.length>0){
    if (re.test(username)&&username.length >= 4&&username.length <= 12) {
      connection.query(check,[username], function(err, result) {
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
    }else{
      res.json({
        status:'illegal'
      });
    }
  }else{
    res.json({
      status:'nullpwd'
    });
}}else{
  res.json({
    status:'nullpwd'
  });
}
});

router.post('/newPost', (req, res) => {
  var username=req.body.username;
  var time=req.body.time;
  var text=req.body.text;
  var picture=req.body.picture;
  var post_id=req.body.post_id;
  var add = "INSERT INTO post_content (username, time, text, picture, post_id) VALUES (?,?,?,?,?);";
  connection.query(add,[username,time,text,picture,post_id],function(err, result) {
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
  var add_icon = 'SELECT icon FROM user_info WHERE username = ?';
  connection.query(add_icon,[username], function(err, result) {
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
  var follow_host=req.body.username;
  var inject_main = 'SELECT * FROM post_content WHERE username = ?;';
  connection.query(inject_main,[follow_host], function(err, result) {
    if (err) {
      console.log('injection error: ', err);
    }else{
      let read_like = 'SELECT * FROM likes WHERE post_id IN (';
      let read_count = 'SELECT post_id, COUNT(*) AS num FROM likes WHERE post_id IN ('
      let read_comment=  'SELECT * FROM comment WHERE post_id IN (';
      // read likes from likes table, read comments from comment table
      for (index in result){
        curr_post=result[index].post_id;
        read_like+=('\"'+curr_post+'\",');
        read_count+=('\"'+curr_post+'\",');
        read_comment+=('\"'+curr_post+'\",');
      }
      read_like=read_like.substring(0,read_like.length-1);
      read_count=read_count.substring(0,read_count.length-1);
      read_comment=read_comment.substring(0,read_comment.length-1);
      read_like+=(') AND username=\"'+follow_host+'\";');
      read_count+=(') GROUP BY post_id;')
      read_comment+=')';
      connection.query(read_like,function(err,likes){
        if(err){
          console.log("likes not found: ",err);
        }else{
          connection.query(read_comment,function(err,comments){
            if(err){
              console.log("comments not found: ",err);
            }else{
              connection.query(read_count,function(err,counts){
                if(err){
                  console.log("like counting error: ",err);
                }else{
                  res.json({
                    status: 'success',
                    result: result,
                    like:likes,
                    count:counts,
                    comment:comments
                  })};
              })};
          })};
      })};       
  });
});

router.post('/injectAll', (req, res) => {
  var follow_host=req.body.username;
  var all_guests = 'SELECT follow_guest FROM follow WHERE follow_host = "' + follow_host + '";';
  // read followers from follow table
  connection.query(all_guests, function(err, guests) {
    if (err) {
      console.log('following guest error: ', err);
    }else{
      let inject_all = 'SELECT DISTINCT * FROM post_content WHERE username IN (';
      let post_icon = 'SELECT DISTINCT  * FROM user_info WHERE username IN (';
      for (curr_guest in guests){
        curr_username=guests[curr_guest].follow_guest;
        inject_all+=('\"'+curr_username+'\",');
        post_icon+=('\"'+curr_username+'\",');
      }
      inject_all=inject_all.substring(0,inject_all.length-1);
      inject_all+=');'
      post_icon=post_icon.substring(0,post_icon.length-1);
      post_icon+=');'
      
      // read posts from post_content table
      connection.query(inject_all,function(err,result){
        if(err){
          console.log('injection error: ',err);
        }else{
          //read icon from user_info table
          let read_like = 'SELECT * FROM likes WHERE post_id IN (';
          let read_count = 'SELECT post_id, COUNT(*) AS num FROM likes WHERE post_id IN ('
          let read_comment=  'SELECT * FROM comment WHERE post_id IN (';
          let read_tag= 'SELECT * FROM tag WHERE post_id IN (?) ;'
          connection.query(post_icon,function(err,icon){
          if (err){
            console.log("icons not found: ", err);
          }else{
            // read likes from likes table, read comments from comment table
            tags=[]
            for (index in result){
              curr_post=result[index].post_id;
              read_like+=('\"'+curr_post+'\",');
              read_count+=('\"'+curr_post+'\",');
              read_comment+=('\"'+curr_post+'\",');
              tags.push(curr_post);
            }
            read_like=read_like.substring(0,read_like.length-1);
            read_count=read_count.substring(0,read_count.length-1);
            read_comment=read_comment.substring(0,read_comment.length-1);
            read_like+=(') AND username=\"'+follow_host+'\";');
            read_count+=(') GROUP BY post_id;')
            read_comment+=')';
            connection.query(read_like,function(err,likes){
              if(err){
                console.log("likes not found: ",err);
              }else{
                connection.query(read_comment,function(err,comments){
                  if(err){
                    console.log("comments not found: ",err);
                  }else{
                    connection.query(read_count,function(err,counts){
                      if(err){
                        console.log("like counting error: ",err);
                      }else{
                        connection.query(read_tag,tags,function(err,tags){
                          if(err){
                            console.log("tagging")
                          }else{
                            res.json({
                              status: 'success',
                              result: result,
                              icon: icon,
                              like:likes,
                              count:counts,
                              comment:comments,
                              tags:tags
                            });
                          }
                        })
                      };
                    })};
                })};
            });
        }});
      }});
  }});
});

router.post('/following', function (req, res) {
  var username=req.body.username;
  console.log(username);
  var query = 'SELECT follow_guest FROM follow WHERE follow_host=?;';
  connection.query(query,[username], function(err, rows) {
  if (err) console.log(err);
  else {     
      console.log(rows);
      res.json(rows);      
    }
  });
  
});

router.post('/follower', function (req, res) {
  var username=req.body.username;
  var query = 'SELECT follow_host FROM follow WHERE follow_guest=? ;';
  connection.query(query,[username], function(err, rows) {
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
  var check = 'SELECT username FROM user_info WHERE username = ?;';
  connection.query(check, [searchname],function(err, result) {
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
  var checkFollow = 'SELECT * FROM follow WHERE follow_guest = ? AND follow_host = ?;';
  connection.query(checkFollow, [guest,host], function(err, result) {
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
  var follow = "INSERT INTO follow (follow_host, follow_guest) VALUES (?,?);";
  var unfollow = 'DELETE FROM follow WHERE follow_host=? AND follow_guest=?;';
  if (followstatus=="Follow"){
    connection.query(follow, [host,guest],function(err, result1) {
      if (err) {
        console.log('insert error: ', err);
      }else{
      res.json({
      status: 'followed'
        });
      }        
    });
  }else if(followstatus=="Unfollow"){
    connection.query(unfollow,[host,guest], function(err, result2) {
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

router.post('/addLike',(req, res) => {
  var post_id=req.body.post_id;
  var username=req.body.username;
  var add_like= "INSERT INTO likes (username, post_id) VALUES (?,?);";
  connection.query(add_like,[username, post_id],function(err,result){
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
  var cancel_like= 'DELETE FROM likes WHERE username= ? AND post_id = ?;';
  connection.query(cancel_like,[username,post_id],function(err,result){
    if(err){
      console.log('delete like error: ', err);
    }else{
      console.log('like deleted successfully!');
      res.json({
        status: 'success'
      });
    }
  });
});

router.post('/addComment',(req,res) => {
  var post_id=req.body.post_id;
  var username=req.body.username;
  var text=req.body.text;
  var cmt_id=req.body.cmt_id;
  var add_comment="INSERT INTO comment (post_id, cmt_content, username, cmt_id) VALUES (?,?,?,?);"
  connection.query(add_comment,[post_id,text,username,cmt_id],function(err,result){
    if(err){
      console.log('comment insertion error: ', err);
    }else{
      console.log('comment added!');
      res.json({
        status: 'success'
      });
    }
  });
});

router.post('/commentList',(req,res) =>{
  var post_id=req.body.post_id;
  
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
  var countPost = 'SELECT COUNT(*) AS countPost FROM post_content WHERE username= ? GROUP BY username;';
  connection.query(countPost,[username],function(err, count) {
    if (count>0){
      res.json(count);  
    }else{
      res.json([{
        countPost:0
      }]);
    }
    });
});

router.post('/countFollowing', (req, res) => {
  var username=req.body.username;
  var countfollowing = 'SELECT COUNT(*) AS countFollowing FROM follow WHERE follow_guest= ? GROUP BY follow_guest;';
  connection.query(countfollowing,[username], function(err, rows) {
    if (rows.length>0){
      res.json(rows);  
    }else{
      res.json([{
        countFollowing:0
      }]);
    }
    });
});
router.post('/countFollower', (req, res) => {
  var username=req.body.username;
  var countfollower = 'SELECT COUNT(*) AS countFollower FROM follow WHERE follow_host=? GROUP BY follow_host;';
  connection.query(countfollower,[username],function(err, rows) {
    if (rows.length>0){
      res.json(rows);  
    }else{
      res.json([{
        countFollower:0
      }]);
    } 
    });
});
router.post('/followSuggest', (req,res) => {
  var host=req.body.follow_host;
  var guest=req.body.follow_guest;
  var followstatus=req.body.status;
  var follow = "INSERT INTO follow (follow_host, follow_guest) VALUES (?,?);";
  var unfollow = 'DELETE FROM follow WHERE follow_host=? AND follow_guest=?;';
  if (followstatus=="Follow"){
    connection.query(follow, [host,guest],function(err, result3) {
      if (err) {
        console.log('insert error: ', err);
      }else{
      res.json({
      status: 'followed'
        });
      }        
    });
  }else if(followstatus=="Unfollow"){
    connection.query(unfollow,[host,guest],function(err, result4) {
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
  var suggest=`SELECT username, icon FROM user_info 
  WHERE (username, icon) not in
  (SELECT ui.username, ui.icon FROM user_info ui,follow f WHERE f.follow_host=? AND f.follow_guest=ui.username)
  AND username<>?
  ORDER BY RAND() LIMIT 5;`;
  connection.query(suggest, [username,username], function(err, rows) {
    console.log(rows);
    res.json(rows);
  });
});

router.put('/deletePost', (req,res) => {
  var post_id=req.body.post_id;
  var delete_query="DELETE FROM post_content WHERE post_id=? ;";
  connection.query(delete_query,[post_id],function(err,result){
    if (err){
      res.status(404);
      console.log("delete error: ", err);
    }else{
      console.log("delete successfully!");
      res.status(200).json({
        status: 'success'
      })
    }
  });
});
router.put('/deleteComment', (req,res) => {
  var cmt_id=req.body.comment_id;
  var delete_query="DELETE FROM `comment` WHERE `cmt_id`=? ;";
  connection.query(delete_query,[cmt_id],function(err,result){
    if (err){
      res.status(404);
      console.log("delete error: ", err);
    }else{
      console.log("delete successfully!");
      res.status(200).json({
        status: 'success'
      })
    }
  });
});

module.exports = router;
