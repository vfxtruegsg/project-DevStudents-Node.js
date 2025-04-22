import cloudinary from 'cloudinary';
import fs from 'fs/promises';
import { getEnvVar } from './getEnvVar.js';

const cloud_name = getEnvVar('CLOUDINARY_CLOUD_NAME');
const api_key = getEnvVar('CLOUDINARY_API_KEY');
const api_secret = getEnvVar('CLOUDINARY_API_SECRET');
cloudinary.v2.config({
  secure: true,
  cloud_name,
  api_key,
  api_secret,
});

export const saveFileToCloudinary = async (file) => {
  const response = await cloudinary.v2.uploader.upload(file.path, {
    folder: 'photos',
  });
  await fs.unlink(file.path);
  return response.secure_url;
};

export const saveAvatarToCloudinary = async (file) => {
  const response = await cloudinary.v2.uploader.upload(file.path, {
    folder: 'avatars',
    transformation: [
      { width: 250, height: 250, crop: 'fill' },
      { quality: 'auto' },
    ],
  });
  await fs.unlink(file.path);
  return {
    url: response.secure_url,
    public_id: response.public_id,
  };
};

export const deleteFileFromCloudinary = async (public_id) => {
  if (!public_id) return;
  return await cloudinary.v2.uploader.destroy(public_id);
};

// export const saveFileToCloudinary = async (file) => {
//   try {
//     const response = await cloudinary.v2.uploader.upload(file.path, {
//       folder: 'photos',
//     });

//     await fs.unlink(file.path);
//     return response.secure_url;
//   } catch (error) {
//     console.error('❌ Error uploading to Cloudinary:', error);
//     throw new Error('Failed to upload file to Cloudinary');
//   }
// };

// export const saveAvatarToCloudinary = async (file) => {
//   try {
//     console.log('📸 Avatar file received:', file);

//     const response = await cloudinary.v2.uploader.upload(file.path, {
//       folder: 'avatars',
//       transformation: [
//         { width: 250, height: 250, crop: 'fill' },
//         { quality: 'auto' },
//       ],
//     });

//     await fs.unlink(file.path);

//     return {
//       url: response.secure_url,
//       public_id: response.public_id,
//     };
//   } catch (error) {
//     console.error('❌ Error uploading avatar to Cloudinary:', error);
//     throw new Error('Failed to upload avatar to Cloudinary');
//   }
// };

// export const deleteFileFromCloudinary = async (public_id) => {
//   try {
//     if (!public_id) return;

//     const response = await cloudinary.v2.uploader.destroy(public_id);
//     return response;
//   } catch (error) {
//     console.error('❌ Error deleting file from Cloudinary:', error);
//     throw new Error('Failed to delete file from Cloudinary');
//   }
// };
