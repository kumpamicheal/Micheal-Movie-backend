/*
const axios = require('axios');
const FormData = require('form-data');

const uploadUnsigned = async (buffer, uploadPreset = 'unsigned_movies_upload') => {
    const form = new FormData();
    form.append('file', buffer, 'video.mp4'); // name can be dynamic if needed
    form.append('upload_preset', uploadPreset);

    const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,
        form,
        { headers: form.getHeaders() }
    );

    return response.data; // Cloudinary upload response
};

module.exports = uploadUnsigned;
*/