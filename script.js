const uploadButton = document.getElementById('upload-btn');
const outputContainer = document.getElementById('output-container');
const outputImg = document.getElementById('output-img');
const downloadButton = document.getElementById('download-btn');
const sizeInput = document.getElementById('size-input');
const sizeRecommendation = document.getElementById('size-recommendation');

uploadButton.addEventListener('click', function() {
  let fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';


  const existingFileInput = document.querySelector('#file-input');
  if(existingFileInput) {
    document.body.removeChild(existingFileInput);
  }

  document.body.appendChild(fileInput);
  fileInput.click();

  fileInput.addEventListener('change', function() {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      outputImg.src = reader.result;
      outputContainer.style.display = 'block';
      downloadButton.style.display = 'block';
      downloadButton.href = resizeImage(outputImg.src, sizeInput.value);
      const [minWidth, maxWidth, minHeight, maxHeight] = getImageSizeRecommendation(file);
      sizeRecommendation.innerText = `recommend: ${minWidth} x ${minHeight} `;
       
    };
    document.body.removeChild(fileInput);
  });
});

sizeInput.addEventListener('input', function() {
  downloadButton.href = resizeImage(outputImg.src, sizeInput.value);

})

downloadButton.addEventListener('click', function() {
  downloadButton.download = 'image.png';
})


function getImageSizeRecommendation(file) {
const sizeInMB = file.size / Math.pow(1024, 2);
const minWidth = Math.round(sizeInMB * 100) + 100 ; 
const maxWidth = Math.round(sizeInMB * 500) + 500 ; 
const minHeight = Math.round(sizeInMB * 75) + 75 ; 
const maxHeight = Math.round(sizeInMB * 250) + 250;

return [minWidth, maxWidth, minHeight, maxHeight];
}

function resizeImage(imageUrl, sizeFactor) {
  const canvas = document.createElement('canvas');
  const img = new Image();
  img.src = imageUrl;
  const width = img.width * sizeFactor;
  const height = img.height * sizeFactor;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0 , 0 , width, height);
  const dataUrl = canvas.toDataURL('image/png');
  const fileSize = formatFileSize(getFileSize(dataUrl));
  sizeRecommendation.innerText = `resized image ${fileSize}`;
  return dataUrl;
}

function getFileSize(dataUrl) {
  const base64 = dataUrl.split(',')[1];
  const binary = atob(base64);
  return binary.length;
}

function formatFileSize(bytes) {
  if(bytes >= 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  } else if(bytes >= 1024) {
    return (bytes / 1024).toFixed(2) + " KB";

  } else {
    return bytes + ' B'
  }
}