// Upload image via hidden input slot
function uploadImage() {
  const input = document.getElementById('file-dir');
  input.click();
}
if (document.getElementById('imgfinder') != null) {
  document.getElementById('imgfinder').addEventListener('click', uploadImage);
}


// Change the preview area
function loadImage() {
  if (document.getElementById('file-dir') != null) {
    document.getElementById('file-dir').addEventListener('change', (event) => {
      const area = document.getElementById('preview-area');
      area.style.display = 'flex';
      area.style.flexFlow = 'row';
      area.style.margin = '20px 20px 20px 20px';
      area.style.width = '90%';
      area.style.justifyContent = 'space-evenly';
      area.style.justifySelf = 'center';
      area.style.alignItems = 'center';
      area.style.border = '2px ridge gray';
      area.style.borderRadius = '3px';
      const reader = new FileReader();
      reader.readAsDataURL(event.srcElement.files[0]);
      reader.onload = () => {
        const fileContent = reader.result;
        document.getElementById('preview-image').src = fileContent;
      };
    });
  }
}
window.addEventListener('load', loadImage());

// Clear the preview when closing
function clearPostModal() {
  const textarea = document.getElementById('post-content');
  textarea.value = '';
  const fileDir = document.getElementById('file-dir');
  fileDir.value = '';
  const area = document.getElementById('preview-area');
  area.style.display = 'none';
  const text = document.getElementById('preview-text');
  text.innerHTML = '';
  const image = document.getElementById('preview-image');
  image.src = '';
  window.location.reload();
}
if (document.getElementById('close-post') != null) {
  document.getElementById('close-post').addEventListener('click', clearPostModal);
}


// Clear comment when finish commenting
function clearCommentModal() {
  const chatPostId = document.getElementById('chat-post-id');
  chatPostId.innerHTML = '';
  const commentContent = document.getElementById('comment-content');
  commentContent.value = '';
  window.location.reload();
}
if (document.getElementById('close-comment') != null) {
  document.getElementById('close-comment').addEventListener('click', clearCommentModal);
}


// Clear deconste dialog when deconstion is done
function clearDelPostModal() {
  const delPostId = document.getElementById('deconste-post-id');
  delPostId.innerHTML = '';
  window.location.reload();
}
if (document.getElementById('close-del-post') != null) {
  document.getElementById('close-del-post').addEventListener('click', clearDelPostModal);
}


function clearDelCommentModal() {
  const delCmtId = document.getElementById('deconste-comment-id');
  delCmtId.innerHTML = '';
  window.location.reload();
}
if (document.getElementById('close-del-comment') != null) {
  document.getElementById('close-del-comment').addEventListener('click', clearDelCommentModal);
}

// Do not forget to change exports!
module.exports = {
  uploadImage,
  loadImage,
  clearPostModal,
  clearCommentModal,
  clearDelPostModal,
  clearDelCommentModal,
};
