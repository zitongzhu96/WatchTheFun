const express = require('express');
// Do not forget npm packages!
const session = require('express-session');
const jwt = require('jsonwebtoken');

const myViewSession = {
  secret: 'YfmaoZitongzh',
  cookie: { maxAge: 3600000 },
  saveUninitialized: false,
  resave: false,
};

const router = express.Router();
router.use(session(myViewSession));
const path = require('path');

// Connect string to MySQL
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'cis557.cbiaonyekd5a.us-east-1.rds.amazonaws.com',
  user: 'admin',
  port: '3306',
//   host: 'localhost',
//   user: 'root',
//   port: '3306',
  password: 'longpassword',
  database: 'cis557',
  charset: 'utf8mb4',
});

connection.connect((err) => {
  if (err) {
    console.log(`Error Connection to DB ${err}`);
  }
  console.log('Connection established...');
});

// middleware functions
// token verification
const verifyToken = (req, res, next) => {
  const currToken = req.headers.token;
  // decode token
  if (currToken) {
    // verifies secret and checks if the token is expired
    jwt.verify(currToken, 'watch_the_fun', (err, decoded) => {
      if (err) {
        res.status(400).json({ message: 'invalid token' });
        // if everything is good, save to request for use in other routers
      } else if (decoded.name === req.session.host && decoded.pwd === req.session.pwd
        && decoded.sess_end === req.session.sess_end) {
        console.log('Action authenticated in valid token');
        next();
      }
    });
  } else {
    // if there is no token
    res.status(400).json({
      message: 'No token provided.',
    });
  }
};

// session verification
const verifySession = (req, res, next) => {
  const currTime = new Date().getTime();
  if (req.session) {
    if (req.body.username) {
      if (req.session.host === req.body.username && req.session.sess_end - currTime > 0) {
        console.log('Action authenticated in valid session.');
        return next();
      }
    } else if (req.query.username) {
      if (req.session.host === req.query.username && req.session.sess_end - currTime > 0) {
        console.log('Action authenticated in valid session.');
        return next();
      }
    }
  }
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
router.get('/', noCache, (req, res) => {
  req.session.loginTime = {};
  const now = new Date().getTime();
  req.session.sess_end = now + req.session.cookie.maxAge;
  res.sendFile(path.join(__dirname, '../', 'views', 'Login.html'));
  res.status(201);
});

router.get('/Login', noCache, (req, res) => {
  req.session.loginTime = {};
  const now = new Date().getTime();
  req.session.sess_end = now + req.session.cookie.maxAge;
  res.sendFile(path.join(__dirname, '../', 'views', 'Login.html'));
  res.status(201);
});

router.get('/logout', [verifyToken, noCache], (req, res) => {
  if (req.session) {
    req.session.host = '';
    req.session.pwd = '';
    req.session.destroy();
  }
  res.status(201).json({
    status: 'logout',
  });
});

router.post('/register', (req, res) => {
  const username = req.body.user;
  const pwd = req.body.password;
  const icon = req.body.usericon;
  const date = new Date().getTime();
  const re = /^[0-9a-zA-Z]*$/;
  const re2 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,14}/;
  if (re2.test(pwd)) {
    if ((re.test(username)) && username.length >= 4 && username.length <= 12) {
      const check = 'SELECT password FROM user_info WHERE username = ?';
      const register = "INSERT INTO user_info (username, password, icon, status, tryDate) VALUES (?,?,?,'active',?);";
      connection.query(check, [username], (err, result) => {
        const message = JSON.stringify(result);
        if (message.length === 2) {
          connection.query(register, [username, pwd, icon, date], (errRegister) => {
            if (errRegister) {
              res.status(500).json({
                status: 'error',
                info: errRegister,
              });
            } else {
              connection.query('INSERT INTO follow (follow_host,follow_guest) VALUES (?,?);', [username, username], (errInsert) => {
                if (errInsert) {
                  res.status(500).json({
                    status: 'error',
                    info: errInsert,
                  });
                }
                res.status(200).json({
                  name: username,
                  status: 'success',
                });
              });
            }
          });
        } else {
          res.status(401).json({
            status: 'fail',
            info: 'The user is already existed',
          });
        }
      });
    } else {
      res.status(401).json({
        status: 'illegal',
        info: 'Username is illegal',
      });
    }
  } else {
    res.status(400).json({
      status: 'nullpwd',
      info: 'Password illegal',
    });
  }
});

router.post('/login', (req, res) => {
  const username = req.body.user;
  const pwd = req.body.password;
  const re = /^[0-9a-zA-Z]*$/;
  const date = new Date().getTime();
  const check = 'SELECT password FROM user_info WHERE username = ?';
  const getStatus = 'SELECT status,tryDate FROM user_info WHERE username = ?';
  if (req.session.loginTime[username] === undefined) {
    req.session.loginTime[username] = 0;
  }
  connection.query(getStatus, [username], (errGetStatus, statusResult) => {
    const message1 = JSON.stringify(statusResult);
    if (errGetStatus) {
      res.status(500).json({
        status: 'unexist',
        info: errGetStatus,
      });
    } else if (message1.length === 2) {
      res.status(401).json({
        status: 'unexist',
        info: 'User not exist',
      });
    } else {
      const countStatus = statusResult[0].status;
      const tryTime = statusResult[0].tryDate;
      const diff = (date - tryTime) / (1000 * 3600 * 24);
      if (diff > 1) {
        connection.query('UPDATE user_info SET tryDate=?,status="active" WHERE username=? ;', [date, username], (errUnlockUpdateStatus) => {
          if (errUnlockUpdateStatus) {
            res.status(500).json({
              status: 'error',
              info: errUnlockUpdateStatus,
            });
          } else {
            res.status(200).json({
              status: 'success',
              info: 'Unlocked',
            });
          }
        });
      }
      if ((req.session.loginTime[username] < 3) && (countStatus === 'active' || diff > 1)) {
        if (pwd.length > 0) {
          if (re.test(username) && username.length >= 4 && username.length <= 12) {
            connection.query('UPDATE user_info SET tryDate=? WHERE username=? ;', [date, username], (errLoginUpdate) => {
              if (errLoginUpdate) {
                res.status(500).json({
                  status: 'error',
                  info: errLoginUpdate,
                });
              }
            });
            connection.query(check, [username], (errCheckUserExist, checkResult) => {
              let message = JSON.stringify(checkResult);
              if (message.length === 2) {
                res.status(401).json({
                  status: 'unexist',
                  info: 'User not exist',
                });
              } else {
                message = JSON.parse(message);
                if (errCheckUserExist) {
                  res.status(500).json({
                    status: 'error',
                    info: errCheckUserExist,
                  });
                }
                if (message[0].password === pwd) {
                  req.session.host = username;
                  req.session.pwd = pwd;
                  // create token for actions after login
                  const clientToken = jwt.sign({
                    name: username,
                    pwd,
                    sess_end: req.session.sess_end,
                  }, 'watch_the_fun', { expiresIn: '1h' });
                    // appoint the token into res
                  res.status(201).json({
                    status: 'success',
                    user: req.session.host,
                    token: clientToken,
                  });
                  router.get(`/MainPage/${username}`, (req1, res1) => {
                    res1.sendFile(path.join(__dirname, '../', 'views', 'MainPage.html'));
                  });
                  router.get(`/FriendList/${username}`, (req2, res2) => {
                    res2.sendFile(path.join(__dirname, '../', 'views', 'FriendList.html'));
                  });
                  router.get(`/Profile/${username}`, (req3, res3) => {
                    res3.sendFile(path.join(__dirname, '../', 'views', 'Profile.html'));
                  });
                  router.get('/Login', (req4, res4) => {
                    res4.sendFile(path.join(__dirname, '../', 'views', 'Login.html'));
                  });
                } else {
                  req.session.loginTime[username] += 1;
                  res.status(401).json({
                    status: 'fail',
                    info: 'Password incorrect',
                  });
                }
              }
            });
          } else {
            req.session.loginTime[username] += 1;
            res.status(400).json({
              status: 'illegal',
              info: 'Illegal username',
            });
          }
        } else {
          req.session.loginTime[username] += 1;
          res.status(400).json({
            status: 'nullpwd',
            info: 'Password Empty',
          });
        }
      } else {
        connection.query('UPDATE user_info SET tryDate=?,status="inactive" WHERE username=? ;', [date, username], (errUnlockUpdateStatus) => {
          if (errUnlockUpdateStatus) {
            res.status(500).json({
              status: 'error',
              info: errUnlockUpdateStatus,
            });
          } else {
            res.status(403).json({
              status: 'locked',
              info: 'Account has been locked',
            });
          }
        });
      }
    }
  });
});

router.post('/newPost', [verifySession, verifyToken, noCache], (req, res) => {
  const user = req.body.username;
  const time = req.body.date;
  let text = req.body.txt;
  if (text === undefined) {
    text = '';
  }
  const picture = req.body.pic;
  const postId = req.body.postid;
  const tags = req.body.tag;
  const limits = req.body.privacy;
  const add = 'INSERT INTO post_content (username, time, text, picture, post_id, privacy) VALUES (?,?,?,?,?,?);';
  const tagging = 'INSERT INTO `post_tag` (tagged_user, post_id) VALUES (?) ;';
  connection.query(add, [user, time, text, picture, postId, limits], (errAdd) => {
    if (errAdd) {
      res.status(500).json({
        status: 'error',
        info: 'Database insert post errer',
      });
    } else if (tags.length > 0) {
      connection.query(tagging, tags, (errTag) => {
        if (errTag) {
          res.status(500).json({
            status: 'error',
            info: 'Database insert tag errer',
          });
        } else {
          res.status(201).json({
            status: 'success',
            info: 'Tag created',
          });
        }
      });
    } else {
      res.status(200).json({
        status: 'success',
      });
    }
  });
});

router.get('/addIcon', (req, res) => {
  const username = req.query.user;
  const addIcon = 'SELECT icon FROM user_info WHERE username = ?;';
  connection.query(addIcon, [username], (errAddIcon, result) => {
    if (errAddIcon) {
      res.status(500).json({
        status: 'error',
        info: 'Database get icon errer',
      });
    } else {
      res.status(200).json({
        status: 'success',
        result: JSON.stringify(result),
      });
    }
  });
});

router.put('/changeIcon', (req, res) => {
  const username = req.body.user;
  const image = req.body.img;
  const changeIcon = 'UPDATE user_info SET icon = ? WHERE username = ?;';
  connection.query(changeIcon, [image, username], (errChangeIcon, stats) => {
    if (errChangeIcon) {
      res.status(500).json({
        status: 'error',
        info: 'Database update icon errer',
      });
    } else {
      res.status(200).json({
        status: 'success',
        info: stats,
      });
    }
  });
});

router.get('/injectMain', (req, res) => {
  // people being watched
  const followHost = req.query.username;

  // people watching
  const followGuest = req.query.guest;
  const allFriends = 'SELECT follow_guest FROM follow WHERE follow_host = ?;';
  const injectMain = 'SELECT * FROM post_content WHERE username = ?;';
  const injectLimited = 'SELECT * FROM post_content WHERE username = ? AND privacy = "All";';
  connection.query(allFriends, [followHost], (errFriends, result) => {
    const friends = [];
    for (let index0 = 0; index0 < result.length; index0 += 1) {
      friends.push(result[index0].follow_guest);
    }
    if (errFriends) {
      console.log('Database error:', errFriends);
    } else if (friends.indexOf(followGuest) !== -1) {
      // friends
      connection.query(injectMain, [followHost], (err, result1) => {
        if (err) {
          console.log('injection error: ', err);
        } else {
          const readLike = 'SELECT * FROM likes WHERE post_id IN (?) AND username=(?);';
          const readCount = 'SELECT post_id, COUNT(*) AS num FROM likes WHERE post_id IN (?) GROUP BY post_id;';
          const readComment = 'SELECT * FROM comment WHERE post_id IN (?) ;';
          // read likes from likes table, read comments from comment table
          const posts = [];
          for (let index = 0; index < result1.length; index += 1) {
            const currPost = result1[index].post_id;
            posts.push(currPost);
          }
          if (posts.length > 0) {
            connection.query(readLike, [posts, followHost], (errLike, likes) => {
              if (errLike) {
                res.status(404).json({
                  info: `Likes not found: ${errLike}`,
                });
              } else {
                connection.query(readComment, [posts], (errCom, comments) => {
                  if (errCom) {
                    res.status(404).json({
                      info: `Comment not found: ${errCom}`,
                    });
                  } else {
                    connection.query(readCount, [posts], (errCount, counts) => {
                      if (errCount) {
                        res.status(404).json({
                          info: `like counting error: ${errCount}`,
                        });
                      } else {
                        res.status(200).json({
                          status: 'success',
                          result: result1,
                          like: likes,
                          count: counts,
                          comment: comments,
                        });
                      }
                    });
                  }
                });
              }
            });
          } else {
            res.status(500).json({
              status: 'no post',
              info: 'No post founded for this user',
            });
          }
        }
      });
    } else {
      // not friends, but single following
      connection.query(injectLimited, [followHost], (err, result2) => {
        if (err) {
          console.log('injection error: ', err);
        } else {
          const readLike = 'SELECT * FROM likes WHERE post_id IN (?) AND username=(?);';
          const readCount = 'SELECT post_id, COUNT(*) AS num FROM likes WHERE post_id IN (?) GROUP BY post_id;';
          const readComment = 'SELECT * FROM comment WHERE post_id IN (?) ;';
          // read likes from likes table, read comments from comment table
          const posts = [];
          for (let index = 0; index < result2.length; index += 1) {
            const currPost = result2[index].post_id;
            posts.push(currPost);
          }
          if (posts.length > 0) {
            connection.query(readLike, [posts, followHost], (errLike, likes) => {
              if (errLike) {
                res.status(404).json({
                  info: `Likes not found: ${errLike}`,
                });
              } else {
                connection.query(readComment, [posts], (errCom, comments) => {
                  if (errCom) {
                    res.status(404).json({
                      info: `Comment not found: ${errCom}`,
                    });
                  } else {
                    connection.query(readCount, [posts], (errCount, counts) => {
                      if (errCount) {
                        res.status(404).json({
                          info: `like counting error: ${errCount}`,
                        });
                      } else {
                        res.status(200).json({
                          status: 'success',
                          result: result2,
                          like: likes,
                          count: counts,
                          comment: comments,
                        });
                      }
                    });
                  }
                });
              }
            });
          } else {
            res.status(500).json({
              status: 'no post',
              info: 'No post founded for this user',
            });
          }
        }
      });
    }
  });
});

router.get('/injectAll', (req, res) => {
  const followHost = req.query.username;
  const allGuests = 'SELECT follow_guest FROM follow WHERE follow_host = ?;';
  // bi-directional following <==> friends <==> private post readable
  const allFriends = 'SELECT follow_host FROM follow WHERE follow_guest = ?;';
  // read followers from follow table
  connection.query(allGuests, [followHost], (errGuests, guests) => {
    if (errGuests) {
      console.log('following guest error: ', errGuests);
    } else {
      connection.query(allFriends, [followHost], (errFriends, friends) => {
        if (errFriends) {
          console.log('friend members error: ', errFriends);
        } else {
          const postIcon = `SELECT username, icon FROM user_info WHERE username IN (?) 
            UNION 
            SELECT username, icon FROM user_info WHERE username IN (?);`;
          const injectAll = `SELECT post_id, username, picture, text, time FROM post_content WHERE username IN (?) 
            UNION 
            SELECT post_id, username, picture, text, time FROM post_content WHERE privacy = "all" AND username IN (?);`;
          // Initialize two null string for prevent non-existence of followings
          const followings = [''];
          const privateFollowings = [''];
          for (let index = 0; index < guests.length; index += 1) {
            const currUsername = guests[index].follow_guest;
            let isFriend = false;
            for (let index0 = 0; index0 < friends.length; index0 += 1) {
              if (friends[index0].follow_host === currUsername) {
                privateFollowings.push(currUsername);
                isFriend = true;
                break;
              }
            }
            if (isFriend === false) {
              followings.push(currUsername);
            }
          }
          // read posts from post_content table
          connection.query(injectAll, [privateFollowings, followings], (errRes, result) => {
            if (errRes) {
              console.log('injection error: ', errRes);
            } else {
              const readLike = 'SELECT DISTINCT * FROM likes WHERE post_id IN (?) ;';
              const readCount = 'SELECT post_id, COUNT(*) AS num FROM likes WHERE post_id IN (?) GROUP BY post_id;';
              const readComment = 'SELECT DISTINCT * FROM comment WHERE post_id IN (?);';
              const readPostTag = 'SELECT DISTINCT * FROM post_tag WHERE post_id IN (?) ;';
              const readCmtTag = 'SELECT DISTINCT * FROM comment_tag WHERE cmt_id IN (?) ;';
              connection.query(postIcon, [privateFollowings, followings], (errIcon, icon) => {
                if (errIcon) {
                  console.log('icons not found: ', errIcon);
                } else {
                  // read likes from likes table, read comments from comment table
                  const taggedIds1 = [];
                  for (let index = 0; index < result.length; index += 1) {
                    const currPost = result[index].post_id;
                    taggedIds1.push(currPost);
                  }
                  connection.query(readLike, [taggedIds1], (errLikes, likes) => {
                    if (errLikes) {
                      res.status(500).json({
                        info: 'likes not in Database.',
                      });
                    } else {
                      connection.query(readComment, [taggedIds1], (errComments, comments) => {
                        if (errComments) {
                          res.status(500).json({
                            info: 'comments not in Database ',
                          });
                        } else {
                          connection.query(readCount, [taggedIds1], (errPost, counts) => {
                            if (errPost) {
                              res.status(500).json({
                                info: 'like counting error: ',
                              });
                            } else {
                              connection.query(readPostTag, [taggedIds1], (errPostTag, postTags) => {// eslint-disable-line
                                if (errPostTag) {
                                  res.status(500).json({
                                    info: 'post tagging error',
                                  });
                                } else {
                                  const taggedIds2 = [];
                                  for (let index = 0; index < comments.length; index += 1) {
                                    const currComment = comments[index].cmt_id;
                                    taggedIds2.push(currComment);
                                  }
                                  connection.query(readCmtTag, [taggedIds2], (errCmtTag, commentTags) => {// eslint-disable-line
                                    if (errCmtTag) {
                                      res.status(500).json({
                                        info: 'comment tagging error',
                                      });
                                    } else {
                                      res.status(200).json({
                                        status: 'success',
                                        result,
                                        icon,
                                        like: likes,
                                        count: counts,
                                        comment: comments,
                                        postTag: postTags,
                                        commentTag: commentTags,
                                      });
                                    }
                                  });
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

router.get('/following', noCache, (req, res) => {
  const username1 = req.query.username;
  const query = 'SELECT ui.username AS follow_guest, ui.icon AS icon FROM follow f, user_info ui WHERE follow_host=? AND ui.username=f.follow_guest;';
  connection.query(query, [username1], (err, rows) => {
    if (err) {
      res.status(500).json({
        info: 'Database error ',
      });
    } else {
      res.status(200).json(rows);
    }
  });
});

router.get('/follower', noCache, (req, res) => {
  const username1 = req.query.username;
  const query = 'SELECT ui.username AS follow_host, ui.icon AS icon FROM follow f, user_info ui WHERE follow_guest=? AND ui.username=f.follow_host;';
  connection.query(query, [username1], (err, rows) => {
    if (err) {
      res.status(500).json({
        info: 'Database error',
      });
    } else {
      res.status(200).json(rows);
    }
  });
});

router.get('/searchUser', [verifySession, verifyToken, noCache], (req, res) => {
  const username1 = req.query.username;
  const searchname1 = req.query.searchname;
  const check = 'SELECT username FROM user_info WHERE username = ?;';
  connection.query(check, [searchname1], (err, result) => {
    if (err) {
      res.status(500).json({
        info: 'Database error',
      });
    } else {
      const message = JSON.stringify(result);
      if (message.length === 2) {
        res.status(404).json({
          status: 'unexist',
        });
      } else if (username1 === searchname1) {
        res.status(200).json({ status: 'myself' });
      } else {
        router.get(`/GuestProfile/${searchname1}/${username1}`, (req1, res1) => {
          res1.sendFile(path.join(__dirname, '../', 'views', 'GuestProfile.html'));
        });
        res.status(201).json({
          status: 'success',
          user: searchname1,
        });
      }
    }
  });
});

router.post('/follow', [verifySession, verifyToken, noCache], (req, res) => {
  const host = req.body.username;
  const guest = req.body.followGuest;
  const followstatus = req.body.followStatus;
  const follow = 'INSERT INTO follow (follow_host, follow_guest) VALUES (?,?);';
  const unfollow = 'DELETE FROM follow WHERE follow_host=? AND follow_guest=?;';
  if (followstatus === 'Follow') {
    connection.query(follow, [host, guest], (err) => {
      if (err) {
        res.status(500).json({
          info: 'Database error ',
        });
      } else {
        res.status(200).json({
          status: 'followed',
        });
      }
    });
  } else if (followstatus === 'Unfollow') {
    connection.query(unfollow, [host, guest], (err) => {
      if (err) {
        res.status(500).json({
          info: 'Database delete error',
        });
      } else {
        res.status(200).json({
          status: 'unfollowed',
        });
      }
    });
  } else {
    res.status(400).json({
      info: 'Unexpect error',
    });
  }
});

router.post('/addLike', [verifySession, verifyToken, noCache], (req, res) => {
  const postId = req.body.post_id;
  const username1 = req.body.username;
  const addLike = 'INSERT INTO likes (username, post_id) VALUES (?,?);';
  connection.query(addLike, [username1, postId], (err) => {
    if (err) {
      res.status(500).json({
        info: 'Database insert error: ',
      });
    } else {
      res.status(200).json({
        status: 'success',
      });
    }
  });
});

router.put('/cancelLike', [verifySession, verifyToken, noCache], (req, res) => {
  const postId = req.body.post_id;
  const username1 = req.body.username;
  const cancelLike = 'DELETE FROM likes WHERE username= ? AND post_id = ?;';
  connection.query(cancelLike, [username1, postId], (err) => {
    if (err) {
      res.status(500).json({
        info: 'Database delete error',
      });
    } else {
      res.status(200).json({
        status: 'success',
      });
    }
  });
});

router.post('/addComment', [verifySession, verifyToken, noCache], (req, res) => {
  const postId = req.body.post_id;
  const username1 = req.body.username;
  const text1 = req.body.text;
  const cmtId = req.body.cmt_id;
  const tag = req.body.tagged;
  const addComment = 'INSERT INTO comment (post_id, cmt_content, username, cmt_id) VALUES (?,?,?,?);';
  const addCmtTag = 'INSERT INTO comment_tag (tagged_user, cmt_id) VALUES (?);';
  connection.query(addComment, [postId, text1, username1, cmtId], (errCmt) => {
    if (errCmt) {
      res.status(500).json({
        info: 'Comment insert error',
      });
    } else {
      const tagLen = tag.length;
      if (tagLen > 0) {
        connection.query(addCmtTag, tag, (errCmtTag) => {
          if (errCmtTag) {
            res.status(500).json({
              info: 'Commment tagging insert error',
            });
          } else {
            res.status(200).json({
              status: 'success',
            });
          }
        });
      } else {
        res.status(200).json({
          status: 'success',
        });
      }
    }
  });
});

router.get('/goFollowing/:followGuest', (req, res) => {
  const host = req.query.username;
  const guest = req.query.followGuest;
  if (guest === host) {
    res.status(200).json({ status: 'myself' });
  } else {
    router.get(`/GuestProfile/${guest}/${host}`, (req1, res1) => {
      res1.sendFile(path.join(__dirname, '../', 'views', 'GuestProfile.html'));
    });
    res.status(201).json({ status: 'success' });
  }
});

router.get('/countPost', noCache, (req, res) => {
  const username1 = req.query.username;
  const username2 = req.query.guest;
  const allFriends = 'SELECT follow_guest FROM follow WHERE follow_host = ?;';
  const countPost = 'SELECT COUNT(*) AS countPost FROM post_content WHERE username= ? GROUP BY username;';
  const countLimPost = 'SELECT COUNT(*) AS countPost FROM post_content WHERE username= ? AND privacy = "All" GROUP BY username;';
  connection.query(allFriends, [username1], (errFriends, results) => {
    if (errFriends) {
      console.log('Database error: ', errFriends);
    } else {
      const friends = [];
      for (let index0 = 0; index0 < results.length; index0 += 1) {
        friends.push(results[index0].follow_guest);
      }
      if (friends.indexOf(username2) !== -1) {
        connection.query(countPost, [username1], (err, count) => {
          if (err) {
            res.status(500).json({
              info: 'Database error',
            });
          } else if (count.length > 0) {
            res.status(200).json(count);
          } else {
            res.status(200).json([{
              countPost: 0,
            }]);
          }
        });
      } else {
        connection.query(countLimPost, [username1], (err, count) => {
          if (err) {
            res.status(500).json({
              info: 'Database error',
            });
          } else if (count.length > 0) {
            res.status(200).json(count);
          } else {
            res.status(200).json([{
              countPost: 0,
            }]);
          }
        });
      }
    }
  });
});

router.get('/countFollowing', noCache, (req, res) => {
  const username1 = req.query.username;
  const countfollowing = 'SELECT COUNT(*) AS countFollowing FROM follow WHERE follow_guest= ? GROUP BY follow_guest;';
  connection.query(countfollowing, [username1], (err, rows) => {
    if (err) {
      res.status(500).json({
        info: 'Database error',
      });
    } else if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(200).json([{
        countFollowing: 0,
      }]);
    }
  });
});

router.get('/countFollower', noCache, (req, res) => {
  const username1 = req.query.username;
  const countfollower = 'SELECT COUNT(*) AS countFollower FROM follow WHERE follow_host=? GROUP BY follow_host;';
  connection.query(countfollower, [username1], (err, rows) => {
    if (err) {
      res.status(500).json({
        info: 'Database error',
      });
    } else if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(200).json([{
        countFollower: 0,
      }]);
    }
  });
});

router.get('/followStatus', noCache, (req, res) => {
  const host = req.query.followHost;
  const guest = req.query.followGuest;
  const checkFollow = 'SELECT * FROM follow WHERE follow_guest = ? AND follow_host = ?;';
  connection.query(checkFollow, [guest, host], (err, result) => {
    if (err) {
      res.status(500).json({
        info: 'Database error: ',
      });
    } else {
      const message = JSON.stringify(result);
      if (message.length === 2) {
        res.status(200).json({
          status: 'unfollow',
        });
      } else {
        res.status(200).json({
          status: 'followed',
        });
      }
    }
  });
});


router.post('/followSuggest', noCache, (req, res) => {
  const host = req.body.followHost;
  const guest = req.body.followGuest;
  const followstatus = req.body.status;
  const follow = 'INSERT INTO follow (follow_host, follow_guest) VALUES (?,?);';
  const unfollow = 'DELETE FROM follow WHERE follow_host=? AND follow_guest=?;';
  if (followstatus === 'Follow') {
    connection.query(follow, [host, guest], (err) => {
      if (err) {
        res.status(500).json({
          info: 'Database error',
        });
      } else {
        res.status(200).json({
          status: 'followed',
        });
      }
    });
  } else if (followstatus === 'Unfollow') {
    connection.query(unfollow, [host, guest], (err) => {
      if (err) {
        res.status(500).json({
          info: 'Database error:',
        });
      } else {
        res.status(200).json({
          status: 'unfollowed',
        });
      }
    });
  } else {
    res.status(500).json({
      info: 'Unexpect error',
    });
  }
});

router.get('/suggestFriend', noCache, (req, res) => {
  const username1 = req.query.username;
  const suggest = `SELECT username, icon FROM user_info 
  WHERE (username, icon) not in
  (SELECT ui.username, ui.icon FROM user_info ui,follow f WHERE f.follow_host=? AND f.follow_guest=ui.username)
  AND username<>?
  ORDER BY RAND() LIMIT 5;`;
  connection.query(suggest, [username1, username1], (err, rows) => {
    if (err) {
      res.status(500).json({
        info: 'Database error ',
      });
    } else {
      res.status(200).json(rows);
    }
  });
});

router.put('/deletePost', [verifySession, verifyToken, noCache], (req, res) => {
  const postId = req.body.post_id;
  const deleteQuery = 'DELETE FROM post_content WHERE post_id=? ;';
  connection.query(deleteQuery, [postId], (err) => {
    if (err) {
      res.status(500).json({
        info: 'Database error:',
      });
    } else {
      res.status(200).json({
        status: 'success',
      });
    }
  });
});

router.put('/deleteComment', [verifySession, verifyToken, noCache], (req, res) => {
  const cmtId = req.body.comment_id;
  const deleteQuery = 'DELETE FROM `comment` WHERE `cmt_id`=? ;';
  connection.query(deleteQuery, [cmtId], (err) => {
    if (err) {
      res.status(500).json({
        info: 'Database error: ',
      });
    } else {
      res.status(200).json({
        status: 'success',
      });
    }
  });
});

module.exports = router;
