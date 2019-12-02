// Add username to href of all page elements
if (document.getElementById("grid-nav")!=null){
    var dashboard = document.getElementById("dashboard");
    var friend = document.getElementById("friendlistpage");
    var profile = document.getElementById("profilepage");
    var href = window.location.href.split("/");
    var username = href[href.length-1];
    dashboard.href = dashboard.href + "/" + username;
    friend.href = friend.href + "/" + username;
    profile.href = profile.href + "/" + username;
    if (document.getElementsByClassName("btn btn-info btn-lg").length >0){
        var tofriends = document.getElementsByClassName("btn btn-info btn-lg");
        for (var count=0;count<=1;count+=1)
        {
            tofriends[count].href=friend.href;
        }
    }
}

// Load the default icon in the canvas with hidden element
function hideDefaultIcon(){
    let icon = document.createElement("img");
    let path="../externals/default_icon.jpg";
    icon.setAttribute("src",path);
    let canvas=document.getElementById("defaultIcon");
    let context = canvas.getContext('2d');
    if (icon.complete) {
      context.drawImage(icon,0,0,icon.width,icon.height,0,0,120,120);
    } else {
      icon.onload = async function () {
        await context.drawImage(icon,0,0,icon.width,icon.height,0,0,120,120);    
      };
    }
}
if (document.getElementById("defaultIcon")!=null){
    hideDefaultIcon();
}

// Append icons to textarea;
if (document.getElementsByClassName("emoji-finder")!=null){
    var emojis=document.getElementsByClassName("dropdown-item");
    for (index=0;index<emojis.length;index++){
        var curr_emoji=emojis[index];
        curr_emoji.addEventListener("click", function(event){
            event.currentTarget.parentNode.parentNode.parentNode.parentNode.firstElementChild.value+=event.currentTarget.innerHTML;
        });
    }
}
    