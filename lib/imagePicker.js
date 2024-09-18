import { image } from '@uiw/react-md-editor';
import { blobToFile } from './markdownManipulator';
import imageUploader from './imageUploader';

// select blob file from markdown text and return it
export async function imagePicker(text) {
  const lines = text.split('\n');
  const imageLine = lines.find((line) => line.startsWith('![]('));
  if (!imageLine) {
    return null;
  }
  const imageUrl = imageLine.replace('![](', '').replace(')', '');
  const imageBlob = await blobToFile(imageUrl);
  console.log(imageBlob);
  // const imageBlob = await fetch(imageUrl).then((res) =>
  //   console.log(res.blob())
  // );
  // convert blob url to file object
  // const file = new File([imageBlob], 'image.jpeg', { type: 'image/jpeg' });<ctrl63> Users/pastorsim/Desktop/Works/Web_DeV/nextjs-blog/components/posts/PostItem.js

  // const file = new File([imageUrl], 'image.jpeg', { type: 'image/jpeg' });
  // console.log(file);
  const cloudinaryUrl = await imageUploader(imageBlob);
  return cloudinaryUrl;
}

// upload file with blob url to cloudinary and return the url
