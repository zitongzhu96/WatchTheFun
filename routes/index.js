const express = require('express');
// Do not forget npm packages!
const session = require('express-session');
const jwt = require('jsonwebtoken');

var myViewSession={
  secret: "YfmaoZitongzh",
  cookie: {maxAge: 3600000},
  saveUninitialized: false,
  resave: false
};

var router = express.Router();
router.use(session(myViewSession));
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
  }
  console.log("Connection established...");
});

// middleware functions
// token verification
var verifyToken = function(req, res, next) {
  var token = req.headers.token;
  // decode token
  if (token) {
    // verifies secret and checks if the token is expired
    jwt.verify(token, 'watch_the_fun', (err, decoded) =>{      
      if (err) {
        res.status(400).json({ message: 'invalid token' });    
      } else {
        // if everything is good, save to request for use in other routes 
        if (decoded.name==req.session.host && decoded.pwd==req.session.pwd && decoded.sess_end==req.session.sess_end){
          console.log("Action authenticated in valid token")
          next();
        }
      }
    });
  } else {
    // if there is no token  
    res.status(400).json({ 
      message: 'No token provided.' 
    });
  }
};

// session verification
var verifySession = function(req, res, next) {
  let curr_time=new Date().getTime();
  if (req.session && req.session.host == req.body.username && req.session.sess_end-curr_time>0){
    console.log("Action authenticated in valid session.")
    return next();
  }
  else
    return res.status(401);
};

// no cache
function noCache(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.set('Expires', '-1');
  next();
}

// router functionality
// start counting login time of the session
router.get('/', noCache, function(req, res) {
  req.session.login_time=0;
  var now=new Date().getTime();
  req.session.sess_end= now+req.session.cookie.maxAge;
  res.sendFile(path.join(__dirname, '../', 'views', 'Login.html'));
  res.status(201);
});

router.get('/Login', noCache, function(req, res) {
  req.session.login_time=0;
  var now=new Date().getTime();
  req.session.sess_end= now+req.session.cookie.maxAge;
  res.sendFile(path.join(__dirname, '../', 'views', 'Login.html'));
  res.status(201);
});

router.get('/logout', [verifyToken, noCache], function(req, res){
  if (req.session) {
    req.session.host = "";
    req.session.pwd = "";
    req.session.destroy();
  }
  res.status(201).json({
    status:"logout"
  });
});

router.post('/register', (req, res) => {
  var username=req.body.username;
  var pwd=req.body.password;
  var icon=req.body.icon;
  var date=new Date().getTime();
  var re = /^[0-9a-zA-Z]*$/;
  var re2 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,14}/;
  if (re2.test(pwd)){
      if ((re.test(username))&&username.length >= 4 && username.length <= 12) {
        var check = 'SELECT password FROM user_info WHERE username = ?';
        var register = "INSERT INTO user_info (username, password, icon,status,tryDate) VALUES (?,?,?,'active',?);";
        connection.query(check,[username], function(err, result) {
          var message = JSON.stringify(result);
          if (message.length==2){
            connection.query(register,[username,pwd,icon,date],function(err) {
              if (err) {
                res.status(500).json({
                  status:"error",
                  info:err
                })
              }
              else {
                connection.query("INSERT INTO follow (follow_host,follow_guest) VALUES (?,?);",[username,username],function(err) {});
                res.status(200).json({
                  name: username,
                  status: 'success'
                });
              }        
          });
          }else{
            res.status(401).json({
              status: 'fail',
              info:"The user is already existed"
            });
          }
        });
      }else{
        res.status(401).json({
          status:'illegal',
          info:"Username is illegal"
        });
      }
    }else{
      res.status(400).json({
        status:'nullpwd',
        info:"Password empty"
      });
  }
});

router.post('/login', (req, res) => {
  var username=req.body.username;
  var pwd=req.body.password;
  var re = /^[0-9a-zA-Z]*$/;
  var date=req.body.date;
  var check = 'SELECT password FROM user_info WHERE username = ?';
  var getStatus = 'SELECT status,tryDate FROM user_info WHERE username = ?';
  connection.query(getStatus,[username], function(err, result) {
      var message1 = JSON.stringify(result);
      if (err) {
        res.status(500).json({
          status: 'unexist',
          info: err
        }); }
      else if (message1.length==2){
          res.status(401).json({
            status: 'unexist',
            info:"User not exist"
          });
      }else{
        let countStatus=result[0]['status'];
        let tryDate=result[0]['tryDate'];
        let diff=(date-tryDate)/(1000 * 3600 * 24);
        if (diff>1){
          connection.query(`UPDATE user_info SET tryDate=?,status='active' WHERE username=? ;`,[date,username], function(err, result) {
            if (err) {
              res.status(500).json({
                status: 'error',
                info: err
              });
            }else{
              res.status(200).json({
                info: "Unlocked"
              })
            }
          });
        }
        if (countStatus=="active"||diff>1){
         if (pwd.length>0){
            if (re.test(username)&&username.length >= 4&&username.length <= 12) {
              connection.query(`UPDATE user_info SET tryDate=? WHERE username=? ;`,[date,username], function(err, result) {
                if (err){
                  res.status(500).json({
                    status: 'error',
                    info: err
                  });
                }
              });
              connection.query(check,[username], function(err, result) {
                var message = JSON.stringify(result);
                if (message.length==2){
                  res.status(401).json({
                    status: 'unexist',
                    info:"User not exist"
                  });
                }else{
                  message = JSON.parse(message);
                  if (err) {
                    res.status(500).json({
                      status: 'error',
                      info: err
                    });
                  }
                  if (message[0].password == pwd) {
                    // assign new element to session
                    req.session.host=username;
                    req.session.pwd=pwd;
                    // create token for actions after login
                    var clientToken = jwt.sign({
                      name: username,
                      pwd: pwd,
                      sess_end: req.session.sess_end
                    }, 'watch_the_fun', { expiresIn: '1h' });
                    // appoint the token into res
                    req.verify_token=clientToken;
                    res.status(201).json({
                      status: 'success',
                      user: username,
                      token: clientToken
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
                    res.status(401).json({
                      status: 'fail',
                      info:"Password incorrect"
                    });
                  }
                }
              });
            }else{
              res.status(400).json({
                status:'illegal',
                info:"Illegal username"
              });
            }
          }else{
            res.status(400).json({
              status:'nullpwd',
              info: "Password Empty"
            });
          }
        }else{
          res.status(403).json({
            status:"locked",
            info:"Account has been locked"
          })
        }
      }
  });
});

router.post('/newPost', [verifySession, verifyToken, noCache], (req, res) => {
  var username=req.body.username;
  var time=req.body.time;
  var text=req.body.text;
  if (text==undefined){
    text="";
  }
  var picture=req.body.picture;
  var post_id=req.body.post_id;
  var tags=req.body.tags;
  var add = "INSERT INTO post_content (username, time, text, picture, post_id) VALUES (?,?,?,?,?);";
  var tagging = "INSERT INTO `tag` (tagged_user, post_id) VALUES (?) ;";
  connection.query(add,[username,time,text,picture,post_id],function(err, result) {
    if (err) {
      res.status(500).json({
        status:'error',
        info:'Database insert post errer'
      })
    }else{
      if (tags.length>0){
      connection.query(tag,tags,function(err,result){
        if(err){
          res.status(500).json({
            status:'error',
            info:'Database insert tag errer'
          })
        }else{
          console.log('tagging successfully!')
          res.status(201).json({
            status: 'success',
            info: 'Tag created'
          });
        }
      });
    }else{
      res.status(200).json({
        status: 'success'
      });
    }  
  }      
  });
});

router.post('/addIcon', [verifySession, verifyToken, noCache], (req, res) => {
  var username=req.body.username;
  var add_icon = 'SELECT icon FROM user_info WHERE username = ?';
  connection.query(add_icon,[username], function(err, result) {
    if (err) {
      res.status(500).json({
        status:'error',
        info:'Database get icon errer'
      })
    }else{
      res.status(200).json({
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
      let read_like = 'SELECT * FROM likes WHERE post_id IN (?) AND username=(?);';
      let read_count = 'SELECT post_id, COUNT(*) AS num FROM likes WHERE post_id IN (?) GROUP BY post_id;'
      let read_comment=  'SELECT * FROM comment WHERE post_id IN (?) ;';
      // read likes from likes table, read comments from comment table
      var posts=[];
      for (var index in result){
        var curr_post=result[index].post_id;
        posts.push(curr_post);
      }
      connection.query(read_like,[posts,follow_host],function(err,likes){
        if(err){
          res.status(404).json({
            info: "Likes not found: "+err
          })
        }else{
          connection.query(read_comment,[posts],function(err,comments){
            if(err){
              res.status(404).json({
                info: "Comment not found: "+err
              })
            }else{
              connection.query(read_count,[posts],function(err,counts){
                if(err){
                  res.status(404).json({
                    info: "like counting error: "+err
                  })
                }else{
                  res.status(200).json({
                    status: 'success',
                    result: result,
                    like:likes,
                    count:counts,
                    comment:comments
                  })}
              })
            }
          })}
      })}       
  });
});

router.post('/injectAll', [verifySession, verifyToken, noCache], (req, res) => {
  var follow_host=req.body.username;
  var all_guests = 'SELECT follow_guest FROM follow WHERE follow_host = ?;';
  // read followers from follow table
  connection.query(all_guests, [follow_host],function(err, guests) {
    if (err) {
      console.log('following guest error: ', err);
    }else{
      let inject_all = 'SELECT DISTINCT * FROM post_content WHERE username IN (?);';
      let post_icon = 'SELECT DISTINCT  * FROM user_info WHERE username IN (?);';
      let usernames=[];
      for (var curr_guest in guests){
        var curr_username=guests[curr_guest].follow_guest;
        usernames.push(curr_username);
      }
      inject_all=inject_all.substring(0,inject_all.length-1);
      post_icon=post_icon.substring(0,post_icon.length-1);
      
      // read posts from post_content table
      connection.query(inject_all, [usernames],function(err,result){
        if(err){
          console.log('injection error: ',err);
        }else{
          //read icon from user_info table
          let read_like = 'SELECT * FROM likes WHERE post_id IN (?) ;';
          let read_count = 'SELECT post_id, COUNT(*) AS num FROM likes WHERE post_id IN (?) GROUP BY post_id;'
          let read_comment=  'SELECT * FROM comment WHERE post_id IN (?);';
          let read_tag= 'SELECT * FROM tag WHERE post_id IN (?) ;'
          connection.query(post_icon,[usernames],function(err,icon){
          if (err){
            console.log("icons not found: ", err);
          }else{
            // read likes from likes table, read comments from comment table
            var tagged_ids=[]
            var curr_posts=[]
            for (var index in result){
              var curr_post=result[index].post_id;
              curr_posts.push(curr_post);
              tagged_ids.push(curr_post);
            }
            connection.query(read_like,[curr_posts],function(err,likes){
              if(err){
                res.status(404).json({
                  info:"likes not in Database: "+err
                })
              }else{
                connection.query(read_comment,[curr_posts],function(err,comments){
                  if(err){
                    res.status(500).json({
                      info:"comments not in Database: "+err
                    })
                    console.log("comments not found: ",err);
                  }else{
                    connection.query(read_count,[curr_posts],function(err,counts){
                      if(err){
                        res.status(500).json({
                          info:"like counting error: "+err
                        })
                      }else{
                        connection.query(read_tag,[tagged_ids],function(err,tags){
                          if(err){
                            res.status(500).json({
                              info:"tagging error: "+err
                            })
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

router.post('/following', noCache, function (req, res) {
  var username=req.body.username;
  var query = 'SELECT follow_guest FROM follow WHERE follow_host=?;';
  connection.query(query,[username], function(err, rows) {
    if (err) {
      res.status(500).json({
        info: "Database error: "+err
      })
    }
    else {     
      res.status(200).json(rows);      
    }
  });
  
});

router.post('/follower', noCache, function (req, res) {
  var username=req.body.username;
  var query = 'SELECT follow_host FROM follow WHERE follow_guest=? ;';
  connection.query(query,[username], function(err, rows) {
  if (err) {
    res.status(500).json({
      info: "Database error: "+err
    })
  }
  else {     
    res.status(200).json(rows);        
  }
  }); 
});

router.post('/searchUser', [verifySession, verifyToken, noCache], (req, res) => {
  var username=req.body.username;
  var searchname=req.body.searchname;
  var check = 'SELECT username FROM user_info WHERE username = ?;';
  connection.query(check, [searchname],function(err, result) {
    if (err) {
      res.status(500).json({
        info: "Database error: "+err
      })
    }else{
      var message = JSON.stringify(result);
      if (message.length==2){
        res.status(404).json({
          status: 'unexist'
        });
      }else{
        if (err) {
          res.status(500).json({
            status: 'error',
            info: "Database error: "+err          
          })
        }
        else{  
          if (username==searchname){
            res.status(200).json({status:"myself"});
          }else{
        router.get('/GuestProfile/'+searchname+'/'+username, function (req, res) {
            res.sendFile(path.join(__dirname, '../', 'views', 'GuestProfile.html'));
          });
          res.status(201).json({
            status: 'success',
            user: searchname
          });
          }
        }
      }
    }
  });
});
router.post('/followStatus', noCache, (req, res) => {
  var host=req.body.follow_host;
  var guest=req.body.follow_guest;
  var checkFollow = 'SELECT * FROM follow WHERE follow_guest = ? AND follow_host = ?;';
  connection.query(checkFollow, [guest,host], function(err, result) {
    if (err) {
      res.status(500).json({
        info: "Database error: "+err
      })
    }else{
    var message = JSON.stringify(result);
    if (message.length==2){
      res.status(200).json({
        status:'unfollow'
      });
    }else{
    res.status(200).json({
    status: 'followed'
      });
    }}        
  });
});

router.post('/follow', [verifySession, verifyToken, noCache], (req,res) => {
  var host=req.body.username;
  var guest=req.body.follow_guest;
  var followstatus=req.body.follow_status;
  var follow = "INSERT INTO follow (follow_host, follow_guest) VALUES (?,?);";
  var unfollow = 'DELETE FROM follow WHERE follow_host=? AND follow_guest=?;';
  if (followstatus=="Follow"){
    connection.query(follow, [host,guest],function(err, result1) {
      if (err) {
          res.status(500).json({
            info: "Database error: "+err
          })
      }else{
      res.status(200).json({
        status: 'followed'
        });
      }        
    });
  }else if(followstatus=="Unfollow"){
    connection.query(unfollow,[host,guest], function(err, result2) {
      if (err) {
        res.status(500).json({
          info: "Database delete error: "+err
        })
      }else{
      res.status(200).json({
      status: 'unfollowed'
        });
      }        
    });
    }else{
      res.status(400).json({
        info: "Unexpect error: "+err
      })
  }
});

router.post('/addLike', [verifySession, verifyToken, noCache], (req, res) => {
  var post_id=req.body.post_id;
  var username=req.body.username;
  var add_like= "INSERT INTO likes (username, post_id) VALUES (?,?);";
  connection.query(add_like,[username, post_id],function(err,result){
    if(err){
      res.status(500).json({
        info: "Database insert error: "+err
      })
    }else{
      res.status(200).json({
        status: 'success'
      });
    }
  });
});

router.post('/cancelLike',[verifySession, verifyToken, noCache],(req, res) => {
  var post_id=req.body.post_id;
  var username=req.body.username;
  var cancel_like= 'DELETE FROM likes WHERE username= ? AND post_id = ?;';
  connection.query(cancel_like,[username,post_id],function(err,result){
    if(err){
      res.status(500).json({
        info: "Database delete error: "+err
      })
    }else{
      res.status(200).json({
        status: 'success'
      });
    }
  });
});

router.post('/addComment',[verifySession, verifyToken, noCache],(req,res) => {
  var post_id=req.body.post_id;
  var username=req.body.username;
  var text=req.body.text;
  var cmt_id=req.body.cmt_id;
  var add_comment="INSERT INTO comment (post_id, cmt_content, username, cmt_id) VALUES (?,?,?,?);"
  connection.query(add_comment,[post_id,text,username,cmt_id],function(err,result){
    if(err){
      res.status(500).json({
        info: "Database insert error: "+err
      })
    }else{
      res.status(200).json({
        status: 'success'
      });
    }
  });
});

router.post('/goFollowing/:follow_guest',[verifySession, verifyToken, noCache],(req, res) => {
  var host=req.body.username;
  var guest=req.body.follow_guest;
  if (guest==host){
    res.status(200).json({status:"myself"});
  }else{
  router.get('/GuestProfile/'+guest+'/'+host, function (req, res) {
          res.sendFile(path.join(__dirname, '../', 'views', 'GuestProfile.html'));
        });
  res.status(201).json({status: "success"});
  }
});

router.post('/countPost', noCache,(req, res) => {
  var username=req.body.username;
  var countPost = 'SELECT COUNT(*) AS countPost FROM post_content WHERE username= ? GROUP BY username;';
  connection.query(countPost,[username],function(err, count) {
    if (err){
      res.status(500).json({
        info: "Database error: "+err
      })
    }else{
    if (count>0){
      res.status(200).json(count);  
    }else{
      res.status(200).json([{
        countPost:0
      }]);
    }}
    });
});

router.post('/countFollowing', noCache, (req, res) => {
  var username=req.body.username;
  var countfollowing = 'SELECT COUNT(*) AS countFollowing FROM follow WHERE follow_guest= ? GROUP BY follow_guest;';
  connection.query(countfollowing,[username], function(err, rows) {
    if (err){
      res.status(500).json({
        info: "Database error: "+err
      })
    }else{
    if (rows.length>0){
      res.status(200).json(rows);  
    }else{
      res.status(200).json([{
        countFollowing:0
      }]);
    }}
    });
});

router.post('/countFollower', noCache, (req, res) => {
  var username=req.body.username;
  var countfollower = 'SELECT COUNT(*) AS countFollower FROM follow WHERE follow_host=? GROUP BY follow_host;';
  connection.query(countfollower,[username],function(err, rows) {
    if (err){
      res.status(500).json({
        info: "Database error: "+err
      })
    }else{
    if (rows.length>0){
      res.status(200).json(rows);  
    }else{
      res.status(200).json([{
        countFollower:0
      }]);
    } }
    });
});

router.post('/followSuggest', noCache, (req,res) => {
  var host=req.body.follow_host;
  var guest=req.body.follow_guest;
  var followstatus=req.body.status;
  var follow = "INSERT INTO follow (follow_host, follow_guest) VALUES (?,?);";
  var unfollow = 'DELETE FROM follow WHERE follow_host=? AND follow_guest=?;';
  if (followstatus=="Follow"){
    connection.query(follow, [host,guest],function(err, result3) {
      if (err){
        res.status(500).json({
          info: "Database error: "+err
        })
      }else{
      res.status(200).json({
      status: 'followed'
        });
      }        
    });
  }else if(followstatus=="Unfollow"){
    connection.query(unfollow,[host,guest],function(err, result4) {
      if (err){
        res.status(500).json({
          info: "Database error: "+err
        })
      }else{
      res.status(200).json({
      status: 'unfollowed'
        });
      }        
    });
  }else{
      res.status(500).json({
        info: "Unexpect error: "+err
      })
  }
});

router.post('/suggestFriend', noCache, (req,res) => {
  var username=req.body.username;
  var suggest=`SELECT username, icon FROM user_info 
  WHERE (username, icon) not in
  (SELECT ui.username, ui.icon FROM user_info ui,follow f WHERE f.follow_host=? AND f.follow_guest=ui.username)
  AND username<>?
  ORDER BY RAND() LIMIT 5;`;
  connection.query(suggest, [username,username], function(err, rows) {
    if (err){
      res.status(500).json({
        info: "Database error: "+err
      })
    }else{
    res.status(200).json(rows);
    }
  });
});

router.put('/deletePost', [verifySession, verifyToken, noCache], (req,res) => {
  var post_id=req.body.post_id;
  var delete_query="DELETE FROM post_content WHERE post_id=? ;";
  connection.query(delete_query,[post_id],function(err,result){
    if (err){
      res.status(500).json({
        info: "Database error: "+err
      })
    }else{
      res.status(200).json({
        status: 'success'
      })
    }
  });
});

router.put('/deleteComment', [verifySession, verifyToken, noCache], (req,res) => {
  var cmt_id=req.body.comment_id;
  var delete_query="DELETE FROM `comment` WHERE `cmt_id`=? ;";
  connection.query(delete_query,[cmt_id],function(err,result){
    if (err){
      res.status(500).json({
        info: "Database error: "+err
      })
    }else{
      res.status(200).json({
        status: 'success'
      })
    }
  });
});

module.exports = router;
