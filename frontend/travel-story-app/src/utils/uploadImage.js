import apiRequest from "./apiRequest";
import imageCompression from 'browser-image-compression';

const uploadImage = async (imageFile) => {
  const options = {
    maxSizeMB: 1, // Reduce file size to max 1MB
    maxWidthOrHeight: 1024, // Resize dimensions
    useWebWorker: true, // Optimize processing
  };

  try {
    const compressedFile = await imageCompression(imageFile, options);

    const formData = new FormData();
    formData.append("image", compressedFile);

    const response = await apiRequest.post("/image-upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading the image:", error);
    throw error;
  }
};

export default uploadImage;
