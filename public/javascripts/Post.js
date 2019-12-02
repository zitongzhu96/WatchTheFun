// Upload image via hidden input slot
function uploadImage(){
    let input = document.getElementById("file-dir");
    input.click();
}
if (document.getElementById("imgfinder")!=null){
    document.getElementById("imgfinder").addEventListener("click",uploadImage);
}


// Change the preview area
function loadImage() {
    if (document.getElementById("file-dir")!=null){
        document.getElementById("file-dir").addEventListener("change", function(event) {
            let area = document.getElementById("preview-area");
            area.style.display="flex";
            area.style.flexFlow="row";
            area.style.margin="20px 20px 20px 20px";
            area.style.width="90%";
            area.style.justifyContent="space-evenly";
            area.style.justifySelf="center";
            area.style.alignItems="center";
            area.style.border="2px ridge gray";
            area.style.borderRadius="3px";
            //TODO: large image file reading not interrupted
            let reader = new FileReader();
            reader.readAsDataURL(event.srcElement.files[0]);
            reader.onload = function() {
                var fileContent = reader.result;
                document.getElementById("preview-image").src = fileContent;
            }
        })
    }
}
window.addEventListener("load", loadImage());

// Clear the preview when closing
function clearPostModal(){
    let textarea=document.getElementById("post-content");
    textarea.value="";
    let file_dir=document.getElementById("file-dir");
    file_dir.value="";
    let area=document.getElementById("preview-area");
    area.style.display="none";
    let text=document.getElementById("preview-text");
    text.innerHTML="";
    let image=document.getElementById("preview-image");
    image.src="";
    window.location.reload();
}
if (document.getElementById("close-post")!=null){
    document.getElementById("close-post").addEventListener("click",clearPostModal);
}


// Clear comment when finish commenting
function clearCommentModal(){
    let chat_post_id=document.getElementById("chat-post-id");
    chat_post_id.innerHTML="";
    let comment_content=document.getElementById("comment-content");
    comment_content.value="";
    window.location.reload();
}
if (document.getElementById("close-comment")!=null){
    document.getElementById("close-comment").addEventListener("click",clearCommentModal)
}


// Clear delete dialog when deletion is done
function clearDelPostModal(){
    let del_post_id=document.getElementById("delete-post-id");
    del_post_id.innerHTML="";
    window.location.reload();
}
if (document.getElementById("close-del-post")!=null){
    document.getElementById("close-del-post").addEventListener("click",clearDelPostModal);
}


function clearDelCommentModal(){
    let del_cmt_id=document.getElementById("delete-comment-id");
    del_cmt_id.innerHTML="";
    window.location.reload();
}
if (document.getElementById("close-del-comment")!=null){
    document.getElementById("close-del-comment").addEventListener("click",clearDelCommentModal);
}

// Do not forget to change exports!
module.exports={
    uploadImage:uploadImage,
    loadImage:loadImage,
    clearPostModal:clearPostModal,
    clearCommentModal:clearCommentModal,
    clearDelPostModal:clearDelPostModal,
    clearDelCommentModal:clearDelCommentModal
};