import apiRequest from "./apiRequest";

const uploadImage = async (imageFile) => {
  const formData = new FormData();

  //append image file to form data
  formData.append('image', imageFile);

  try {
    const response = await apiRequest.post("/image-upload",formData,{
      headers: {
        'Content-Type': 'multipart/form-data', //set header for file upload
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading the image:', error);
    throw error;
  }
}

export default uploadImage;