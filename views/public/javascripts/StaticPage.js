/* eslint-disable linebreak-style */
/* eslint-disable max-len */
// Add username to href of all page elements
if (document.getElementById('grid-nav') != null) {
  const dashboard = document.getElementById('dashboard');
  const friend = document.getElementById('friendlistpage');
  const profile = document.getElementById('profilepage');
  const href = window.location.href.split('/');
  const username = href[href.length - 1];
  dashboard.href = `${dashboard.href}/${username}`;
  friend.href = `${friend.href}/${username}`;
  profile.href = `${profile.href}/${username}`;
  if (document.getElementsByClassName('btn btn-info btn-lg').length > 0) {
    const tofriends = document.getElementsByClassName('btn btn-info btn-lg');
    for (let count = 0; count <= 1; count += 1) {
      tofriends[count].href = friend.href;
    }
  }
}

// Load the default icon in the canvas with hidden element
function hideDefaultIcon() {
  const icon = document.createElement('img');
  const path = '../externals/default_icon.jpg';
  icon.setAttribute('src', path);
  const canvas = document.getElementById('defaultIcon');
  const context = canvas.getContext('2d');
  if (icon.compconste) {
    context.drawImage(icon, 0, 0, icon.width, icon.height, 0, 0, 120, 120);
  } else {
    icon.onload = async function () {
      await context.drawImage(icon, 0, 0, icon.width, icon.height, 0, 0, 120, 120);
    };
  }
}
if (document.getElementById('defaultIcon') != null) {
  hideDefaultIcon();
}

// Append icons to textarea;
if (document.getElementsByClassName('emoji-finder') != null) {
  const emojis = document.getElementsByClassName('dropdown-item');
  for (let index = 0; index < emojis.length; index += 1) {
    const currEmoji = emojis[index];
    currEmoji.addEventListener('click', (event) => {
      // eslint-disable-next-line no-param-reassign
      event.currentTarget.parentNode.parentNode.parentNode.parentNode.firstElementChild.value += event.currentTarget.innerHTML;
    });
  }
}
if (document.getElementById('name') != null) {
  document.getElementById('name').innerText = '';
}
if (document.getElementById('pwd') != null) {
  document.getElementById('pwd').innerText = '';
}
