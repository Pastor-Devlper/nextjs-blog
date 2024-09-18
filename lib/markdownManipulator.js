export async function urlToBlob(urls) {
  let files = [];
  for (const url of urls) {
    const response = await fetch(url);
    const blob = await response.blob();
    const filename = url.split('/').pop();
    const file = new File([blob], filename, { type: blob.type });
    files.push(file);
  }
  return files;
}

export async function findImagesInMarkdown(text) {
  const lines = text.split('\n');
  const imageLines = lines.filter((line) => line.startsWith('![]('));
  if (!imageLines) {
    return null;
  }
  const imageUrls = imageLines.map((line) => {
    return line.match(/\!\[\]\((.*?)\)/)[1];
  });
  return imageUrls;
}

// upload images to cloudinary and return the urls
export async function uploadImagesToCloudinary(images) {
  // const uploadedUrls = [];
  // for (const image of images) {
  const formData = new FormData();
  formData.append('file', images);
  formData.append('upload_preset', 'your_upload_preset');

  const response = await fetch('/api/upload-image', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  // uploadedUrls.push(data.secure_url);
  const uploadedUrls = data.secure_url;
  // }
  return uploadedUrls;
}

// replace the image urls in the markdown with the cloudinary urls
export async function replaceImageUrlsInMarkdown(
  text,
  imageUrls,
  cloudinaryUrls
) {
  let modifiedText = text;
  for (let i = 0; i < imageUrls.length; i++) {
    modifiedText = modifiedText.replace(imageUrls[i], cloudinaryUrls[i]);
  }
  return modifiedText;
}

// upload multiple image files to cloudinary and return the urls
export async function uploadMultipleImagesToCloudinary(images) {
  const formData = new FormData();
  for (const image of images) {
    formData.append('file', image);
  }
  // formData.append('upload_preset', 'your_upload_preset');
  const response = await fetch('/api/upload-image', {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();
  return data.filePaths;
}

// convert markdown links for youtube to markdown links with thumbnails
export function convertYoutubeLinksToThumbnails(text) {
  const youtubeLinkRegex =
    /\[.*\]\(https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})\)/g;
  const youtubeThumbnailTemplate =
    '![$1](https://img.youtube.com/vi/$1/hqdefault.jpg)';
  const modifiedText = text.replace(youtubeLinkRegex, youtubeThumbnailTemplate);
  return modifiedText;
}
