import {v2 as cloudinary} from 'cloudinary';

const uploadOnCloudinary = async (localurl) => {

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
    });
    
    // Upload an image
    const uploadResult = await cloudinary.uploader.upload(localurl, {
        public_id: "avatar"
    }).catch((error)=>{console.log(error)});
    
    // console.log(uploadResult);
    return uploadResult; 
};

export default uploadOnCloudinary;