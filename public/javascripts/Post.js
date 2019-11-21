// Upload image via hidden input slot
function uploadImage(){
    let input = document.getElementById("file-dir");
    input.click();
}
document.getElementById("imgfinder").addEventListener("click",uploadImage);

// Change the preview area
function loadImage() {
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
window.addEventListener("load", loadImage());

// Clear the preview when closing or posting
function clearModal(){
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
document.getElementById("close-post").addEventListener("click",clearModal);

module.exports={
    uploadImage:uploadImage,
    postMessage:postMessage,
    clearModal:clearModal,
    loadImage:loadImage,
    newElement:newElement,
    newContent:newContent,
    newPerson:newPerson,
    newTime:newTime,
    newTitle:newTitle
};