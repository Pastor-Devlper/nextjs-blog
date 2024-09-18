import { useState, useRef } from 'react';
import PostEditor from '../../components/posts/PostEditor';
import Card from '../../components/ui/card';
import classes from './edit.module.css';
import imageUploader from '../../lib/imageUploader';
import {
  urlToBlob,
  findImagesInMarkdown,
  uploadImagesToCloudinary,
  uploadMultipleImagesToCloudinary,
  replaceImageUrlsInMarkdown,
} from '../../lib/markdownManipulator';

export default function PostEdit() {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState('');
  const [mdData, setMdData] = useState('');

  const titleInputRef = useRef();
  const dateInputRef = useRef();
  const excerptInputRef = useRef();
  const isFeaturedInputRef = useRef();

  const onsubmit = async (e) => {
    e.preventDefault();
    const thumnail = await imageUploader(file);
    const imageUrls = await findImagesInMarkdown(mdData);
    const imageFiles = await urlToBlob(imageUrls);
    const cloudinaryUrls = await uploadMultipleImagesToCloudinary(imageFiles);
    // console.log(cloudinaryUrls);
    const modifiedMdData = await replaceImageUrlsInMarkdown(
      mdData,
      imageUrls,
      cloudinaryUrls
    );
    setMdData(modifiedMdData);
    const title = titleInputRef.current.value;
    const date = dateInputRef.current.value;
    const excerpt = excerptInputRef.current.value;
    const isFeatured = isFeaturedInputRef.current.value;
    const body = modifiedMdData;
    const postText = {
      data: {
        title,
        date,
        excerpt,
        isFeatured,
        thumnail,
      },
      content: body,
    };

    const response = await fetch('/api/upload-mdData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postText),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Post uploaded', data);
      return data;
    } else {
      console.error('Error uploading post');
    }
  };

  return (
    <Card>
      <div className={classes.header}>
        <div className={classes.thumnail}>
          <div className={classes.select}>
            <label htmlFor="thumnail">Choose a thumnail picture</label>
            <input
              type="file"
              id="thumnail"
              name="thumnail"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => {
                if (e.target.files.length === 0) {
                  setPreviewUrl('');
                  setFile();
                } else {
                  const file = e.target.files[0];
                  setFile(file);
                  setPreviewUrl(URL.createObjectURL(file));
                }
              }}
            />
          </div>
          {previewUrl && (
            <div className={classes.preview}>
              <img src={previewUrl} alt="selected" />
            </div>
          )}
        </div>
        <div className={classes.roles}>
          <div className={classes.article}>
            <label htmlFor="title">제목</label>
            <input type="text" id="title" name="title" ref={titleInputRef} />
          </div>
          <div className={classes.article}>
            <label htmlFor="date">날짜</label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              defaultValue={new Date(
                Date.now() - new Date().getTimezoneOffset() * 60000
              )
                .toISOString()
                .slice(0, -1)}
              ref={dateInputRef}
            />
          </div>
          <div className={classes.article}>
            <label htmlFor="excerpt">요약</label>
            <input
              type="text"
              id="excerpt"
              name="excerpt"
              ref={excerptInputRef}
            />
          </div>
          <div className={classes.article}>
            <label htmlFor="isFeatured">노출</label>
            <input
              type="text"
              id="isFeatured"
              name="isFeatured"
              placeholder="true or false"
              ref={isFeaturedInputRef}
            />
          </div>
        </div>
      </div>
      <div className={classes.body}>
        <PostEditor mdData={mdData} setMdData={setMdData} />
      </div>
      <div className={classes.footer}>
        <button type="submit" onClick={onsubmit}>
          저장
        </button>
      </div>
    </Card>
  );
}
