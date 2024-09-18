// upload image file to cloudinary and return the image url

// const imageUploader = async (file: File) => {
//   const formData = new FormData();
//   formData.append('file', file);

//   const res = await fetch('/api/upload-image', {
//     method: 'POST',
//     body: formData,
//   });

//   const data = await res.json();

//   return data.secure_url;
// };

// export default imageUploader;

const imageUploader = async (files: File) => {
  // const imageURL = `${URL.createObjectURL(files)}`;
  // return imageURL;

  /* Add files to FormData */
  const formData = new FormData();
  formData.append('file', files);

  /* Send request to our api route */
  const response = await fetch('/api/upload-image', {
    method: 'POST',
    body: formData,
  });

  const data = (await response.json()) as {
    status: 'ok' | 'fail';
    message: string;
    filePaths: [string];
  };

  // console.log(data);

  return data.filePaths[0];
  // alert(body.message);
};

export default imageUploader;
