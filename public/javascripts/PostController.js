var app = angular.module('MyApp', ['file-model','ngSanitize']);// eslint-disable-line

app.controller('postController', ($scope, $http) => {
  $scope.addPost = () => {
    const hrefList = window.location.href.split('/');
    const now = new Date();
    const year = now.getFullYear();
    let month = now.getMonth() + 1;
    if (month < 10) {
      month = `0${String(month)}`;
    }
    let date = now.getDate();
    if (date < 10) {
      date = `0${String(date)}`;
    }
    let hour = now.getHours();
    if (hour < 10) {
      hour = `0${String(hour)}`;
    }
    let minute = now.getMinutes();
    if (minute < 10) {
      minute = `0${String(minute)}`;
    }
    const day = now.getDay();
    const daymap = new Map();
    daymap.set(1, 'Monday');
    daymap.set(2, 'Tuesday');
    daymap.set(3, 'Wednesday');
    daymap.set(4, 'Thursday');
    daymap.set(5, 'Friday');
    daymap.set(6, 'Saturday');
    daymap.set(0, 'Sunday');
    const dt = `${year}.${month}.${date}, ${hour}:${minute}, ${daymap.get(day)}`;

    const text = document.getElementById('post-content').value;
    const tempTags = text.split('@');
    const tags = [];
    if (tempTags.length > 0) {
      for (let index = 1; index < tempTags.length; index += 1) {
        const tempUsername = tempTags[index].replace(/\W.*$/, '').replace(/ .*$/, '');
        if (tags.includes(tempUsername) === false) {
          tags.push([tempUsername, `${dt} by ${hrefList[hrefList.length - 1]}`]);
        }
      }
    }
    $http({
      url: '/newPost',
      method: 'POST',
      headers: {
        token: sessionStorage.token,
      },
      data: {
        user: hrefList[hrefList.length - 1],
        pic: document.getElementById('preview-image').src,
        txt: text,
        date: dt,
        postid: `${dt} by ${hrefList[hrefList.length - 1]}`,
        tag: tags,
      },
    }).then(
      (res) => {
        if (res.data.status === 'success') {
          console.log('New post is recorded!');
          document.getElementById('close-post').click();
        }
      },
      (err) => {
        console.log('Add Post Error: ', err.data.info);
        document.getElementById('close-post').click();
      },
    );
  };
});

// eslint-disable-next-line arrow-body-style
app.filter('emoji', ($sce) => {
// eslint-disable-next-line arrow-body-style
  return (val) => {
    return $sce.trustAsHtml(val);
  };
});
